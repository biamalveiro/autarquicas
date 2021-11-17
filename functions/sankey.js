const { getResultsByCity } = require("./utils/data");
const { isEqual, sumBy, isUndefined, isNull } = require("lodash");

const COALITION = "Coligado";
const NO_COALITION = "Não Coligado";
const OTHER_COALITION = "Outras Coligações";

const measures = {
  votes: (d) => d.results.votes,
  mandates: (d) => d.results.mandates,
};

const getNodes = (data, party, measure, coalitionBreakdownParty) => {
  const partyNode = {
    name: party,
    fixedValue: sumBy(data, measures[measure]),
  };

  const nodes = [partyNode, { name: COALITION }, { name: NO_COALITION }];

  if (!isNull(coalitionBreakdownParty)) {
    nodes.push(
      ...[
        {
          name: coalitionBreakdownParty,
        },
        {
          name: OTHER_COALITION,
        },
      ]
    );
  }

  return nodes;
};

const getLinks = (data, party, measure, coalitionBreakdownParty, nodes) => {
  if (party === "PCP-PEV") {
    return [
      {
        source: party,
        target: NO_COALITION,
        value: sumBy(data, measures[measure]),
      },
    ];
  }

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

  if (isNull(coalitionBreakdownParty)) {
    return links;
  }

  links.push(
    ...[
      {
        source: COALITION,
        target: coalitionBreakdownParty,
        value: sumBy(
          data.filter((d) => {
            const coalitionSet = new Set(d.coalitionParties);
            return coalitionSet.has(coalitionBreakdownParty);
          }),
          measures[measure]
        ),
      },
      {
        source: COALITION,
        target: OTHER_COALITION,
        value: sumBy(
          data.filter((d) => {
            const coalitionSet = new Set(d.coalitionParties);
            return (
              !coalitionSet.has(coalitionBreakdownParty) &&
              coalitionSet.size >= 2
            );
          }),
          measures[measure]
        ),
      },
    ]
  );

  return links;
};

exports.handler = async function (event, context) {
  const { party, measure, coalitionParty } = JSON.parse(event.body);

  const partyResults = getResultsByCity(party);

  const nodes = getNodes(partyResults, party, measure, coalitionParty);
  const links = getLinks(partyResults, party, measure, coalitionParty, nodes);

  const coalitions = partyResults
    .filter((d) => d.isCoalition)
    .map((d) => new Set(d.coalitionParties))
    .reduce((combined, el) => {
      return new Set([...combined, ...el]);
    }, new Set());

  coalitions.delete(party);

  return {
    statusCode: 200,
    body: JSON.stringify({
      nodes,
      links,
      coalitionParties: [...coalitions],
    }),
  };
};
