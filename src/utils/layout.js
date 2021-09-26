import { sankey, sankeyLeft } from "d3-sankey";

export const sankeyLayout = (nodes, links, width, height) => {
  const sankeyLayout = sankey()
    .nodeId((d) => d.name)
    .nodeAlign(sankeyLeft)
    .nodeSort(null)
    .nodeWidth(8)
    .nodePadding(15)
    .size([width, height]);

  return sankeyLayout({ nodes, links });
};
