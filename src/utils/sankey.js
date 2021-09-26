import { acronymRegex } from "./regex";
import { sum } from "d3-array";
import { sankey, sankeyLeft } from "d3-sankey";
import { isEqual } from "lodash";
import enums from "../enum";

const countVotes = (data, acronym) =>
  sum(
    data.filter((votes) => acronym === votes.acronym),
    (d) => d.votes
  );

const countPartyVotes = (data, party) =>
  sum(
    data.filter((votes) => acronymRegex(party).test(votes.acronym)),
    (d) => d.votes
  );

const getNodes = (data, party) => {
  const partyNode = {
    name: party,
    fixedValue: countPartyVotes(data, party),
    isCoalitionNode: false,
  };

  let nodes = [
    partyNode,
    { name: enums.COALITION, isCoalitionNode: false },
    { name: enums.NO_COALITION, isCoalitionNode: false },
  ];

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
      coalitionParties: coalition,
    });
  }

  return nodes;
};

const getLinks = (data, party, nodes) => {
  let links = [
    {
      source: party,
      target: enums.COALITION,
      value: sum(
        data.filter((d) => d.isCoalition),
        (d) => d.votes
      ),
    },
    {
      source: party,
      target: enums.NO_COALITION,
      value: sum(
        data.filter((d) => !d.isCoalition),
        (d) => d.votes
      ),
    },
  ];

  const coalitionNodes = nodes.filter((n) => n.isCoalition);

  for (const coalitionNode of coalitionNodes) {
    const coalitionVotes = sum(
      data.filter((d) => {
        const coalitionSet = new Set(d.coalitionParties);
        coalitionSet.delete(party);
        return isEqual(coalitionSet, coalitionNode.coalitionParties);
      }),
      (d) => d.votes
    );

    links.push({
      source: enums.COALITION,
      target: coalitionNode.name,
      value: coalitionVotes,
    });
  }

  return links;
};

export const sankeyLayout = (data, party, width, height) => {
  const sankeyNodes = getNodes(data, party);
  const sankeyLinks = getLinks(data, party, sankeyNodes);

  const sankeyData = {
    nodes: sankeyNodes,
    links: sankeyLinks,
  };

  console.log(sankeyData);
  const sankeyLayout = sankey()
    .nodeId((d) => d.name)
    .nodeAlign(sankeyLeft)
    .nodeSort(null)
    .nodeWidth(8)
    .nodePadding(15)
    .size([width, height]);

  return sankeyLayout(sankeyData);
};
