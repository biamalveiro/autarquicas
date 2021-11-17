const continent = require("./data/enrichedContinent.json");
const azores = require("./data/enrichedAzores.json");
const madeira = require("./data/enrichedMadeira.json");

exports.handler = async function (event) {
  return {
    statusCode: 200,
    body: JSON.stringify({
      continent,
      azores,
      madeira,
    }),
  };
};
