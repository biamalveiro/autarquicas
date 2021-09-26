const { isUndefined } = require("lodash");
const { acronymRegex, coalitionPartiesRegex } = require("./regex");
const partiesData = require("../data/parties.json");
const resultsData = require("../data/results.json");

const getResultsByCity = (party) => {
  const partyResults = resultsData
    .map((city) => {
      const partyResultsInCity = city.cityResults.find(({ acronym }) =>
        acronymRegex(party).test(acronym)
      );

      if (isUndefined(partyResultsInCity)) return null;

      const isCoalition = partiesData.find(
        ({ acronym }) => partyResultsInCity.acronym === acronym
      ).coalition;

      const coalitionParties = isCoalition
        ? partyResultsInCity.acronym.match(coalitionPartiesRegex)
        : undefined;

      return {
        acronym: partyResultsInCity.acronym,
        isCoalition,
        coalitionParties,
        district: city.district,
        districtKey: city.districtKey,
        cityName: city.name,
        cityKey: city.key,
        results: partyResultsInCity,
      };
    })
    .filter(Boolean);

  return partyResults;
};

module.exports = {
  getResultsByCity,
};
