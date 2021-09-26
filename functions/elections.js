const resultsData = require("./data/results.json");
const partiesData = require("./data/parties.json");

const escapeForRegex = (text) => text.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
const acronymRegex = (party) =>
  new RegExp(`(?<=-|[.-]|^)${escapeForRegex(party)}(?=-|[.-]|$)`);
const coalitionPartiesRegex = new RegExp(
  /(?<=^|\.|\/|-)(B.E.)|(CDS-PP)|([a-zA-Z]|\/)+(?=\.|\/|-|$)/g
);
const checkIsCoalition = (acronym) =>
  partiesData.filter((party) => party.acronym === acronym)[0].coalition;

exports.handler = async function (event, context) {
  const { party } = JSON.parse(event.body);

  const partyResults = resultsData
    .map((city) => {
      let cityPartyVotes = city.cityResults.filter((votes) =>
        acronymRegex(party).test(votes.acronym)
      );

      if (cityPartyVotes.length === 0) return null;

      cityPartyVotes = cityPartyVotes[0];

      const isCoalition = checkIsCoalition(cityPartyVotes.acronym);
      const coalitionParties = isCoalition
        ? cityPartyVotes.acronym.match(coalitionPartiesRegex)
        : undefined;

      return {
        acronym: cityPartyVotes.acronym,
        isWinner: city.cityResults[0].acronym === cityPartyVotes.acronym,
        isCoalition,
        coalitionParties,
        district: city.district,
        districtKey: city.districtKey,
        cityName: city.name,
        cityKey: city.key,
        votes: cityPartyVotes.votes,
        results: cityPartyVotes,
      };
    })
    .filter(Boolean);

  return {
    statusCode: 200,
    body: JSON.stringify({ party, results: partyResults }),
  };
};
