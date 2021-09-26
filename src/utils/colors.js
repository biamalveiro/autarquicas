import colors from "./colors.json";
import enums from "../enum";

const partiesColors = {
  "PPD/PSD": "orange",
  "CDS-PP": "blue",
  PS: "pink",
  "B.E.": "purple",
  PCP: "red",
  default: "blue-grey",
};

export const colorNode = (node, party) => {
  if (node === enums.COALITION)
    return {
      fill: colors[`${partiesColors[party]}-200`],
      stroke: colors[`${partiesColors[party]}-400`],
    };

  if (node === enums.NO_COALITION)
    return {
      fill: colors[`${partiesColors[party]}-500`],
      stroke: colors[`${partiesColors[party]}-800`],
    };
  if (Object.keys(partiesColors).includes(node))
    return {
      fill: colors[`${partiesColors[node]}-500`],
      stroke: colors[`${partiesColors[node]}-800`],
    };
  return {
    fill: colors[`${partiesColors.default}-500`],
    stroke: colors[`${partiesColors.default}-800`],
  };
};
