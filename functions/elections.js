const resultsData = require("./data/results.json");
const partiesData = require("./data/parties.json");
const { acronymRegex, coalitionPartiesRegex } = require("./utils/regex");
const { getResultsByCity } = require("./utils/data");

exports.handler = async function (event, context) {
  const { party } = JSON.parse(event.body);

  const partyResults = getResultsByCity(party);

  return {
    statusCode: 200,
    body: JSON.stringify({ party, results: partyResults }),
  };
};
