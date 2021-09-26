const { getResultsByCity } = require("./utils/data");
const { isEqual, sumBy } = require("lodash");

const COALITION = "Coligado";
const NO_COALITION = "Não Coligado";

const measures = {
  votes: (d) => d.results.votes,
};

const getNodes = (data, party, measure) => {
  const partyNode = {
    name: party,
    fixedValue: sumBy(data, measures[measure]),
  };

  const nodes = [partyNode, { name: COALITION }, { name: NO_COALITION }];

  const coalitions = data
    .filter((d) => d.isCoalition)
    .map((d) => new Set(d.coalitionParties))
    .reduce((aggregator, el) => {
      if (!aggregator.some((s) => isEqual(s, el))) {
        aggregator.push(el);
      }
      return aggregator;
    }, []);

  for (const coalition of coalitions) {
    coalition.delete(party);
    nodes.push({
      name: [...coalition].sort().join("."),
      isCoalition: true,
      coalitionParties: [...coalition],
    });
  }
  return nodes;
};

const getLinks = (data, party, measure, nodes) => {
  const links = [
    {
      source: party,
      target: COALITION,
      value: sumBy(
        data.filter((d) => d.isCoalition),
        measures[measure]
      ),
    },
    {
      source: party,
      target: NO_COALITION,
      value: sumBy(
        data.filter((d) => !d.isCoalition),
        measures[measure]
      ),
    },
  ];

  const coalitionNodes = nodes.filter((n) => n.isCoalition);

  for (const coalitionNode of coalitionNodes) {
    const coalitionVotes = sumBy(
      data.filter((d) => {
        const coalitionSet = new Set(d.coalitionParties);
        coalitionSet.delete(party);
        return isEqual(coalitionSet, new Set(coalitionNode.coalitionParties));
      }),
      measures[measure]
    );

    links.push({
      source: COALITION,
      target: coalitionNode.name,
      value: coalitionVotes,
    });
  }

  return links;
};

exports.handler = async function (event, context) {
  const { party, measure } = JSON.parse(event.body);

  const partyResults = getResultsByCity(party);
  const nodes = getNodes(partyResults, party, measure);
  const links = getLinks(partyResults, party, measure, nodes);

  return {
    statusCode: 200,
    body: JSON.stringify({
      nodes,
      links,
    }),
  };
};
