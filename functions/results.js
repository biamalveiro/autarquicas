const { getResultsByCity } = require("./utils/data");

const COALITION = "Coligado";
const NO_COALITION = "Não Coligado";
const OTHER_COALITION = "Outras Coligações";

exports.handler = async function (event, context) {
  const { party, linkTarget, coalitionParty } = JSON.parse(event.body);

  let partyResults = getResultsByCity(party);

  switch (linkTarget) {
    case NO_COALITION:
      partyResults = partyResults.filter((city) => city.acronym === party);
      break;
    case coalitionParty:
      partyResults = partyResults.filter(
        (city) =>
          city.isCoalition && city.coalitionParties.includes(coalitionParty)
      );
      break;
    case OTHER_COALITION:
      partyResults = partyResults.filter(
        (city) =>
          city.isCoalition && city.coalitionParties.includes(coalitionParty)
      );
      break;
    case COALITION:
      partyResults = partyResults.filter((city) => city.acronym !== party);
      break;
    default:
      break;
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ results: partyResults }),
  };
};
