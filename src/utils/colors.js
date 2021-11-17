import enums from "../enum";

const colors = {
  "PPD/PSD": {
    light: "#F8AB7C",
    regular: "#F37021",
    dark: "#BF4F0A",
  },
  "CDS-PP": {
    light: "#53C6FF",
    regular: "#0093DD",
    dark: "#006BA0",
  },
  PS: {
    light: "#F173A4",
    regular: "#E21665",
    dark: "#A6104A",
  },
  "B.E.": {
    light: "#A76FD2",
    regular: "#652D90",
    dark: "#4A2169",
  },
  "PCP-PEV": {
    light: "#F04A50",
    regular: "#A70E14",
    dark: "#790A0D",
  },
  default: {
    light: "##bdbdbd",
    regular: "#9e9e9e",
    dark: "##616161",
  },
};

const partiesColors = {
  "PPD/PSD": "orange",
  "CDS-PP": "blue",
  PS: "pink",
  "B.E.": "purple",
  "PCP-PEV": "red",
  default: "blue-grey",
};

export const colorNode = (node, party) => {
  if (node === enums.COALITION)
    return {
      fill: colors[party].light,
      stroke: colors[party].regular,
    };

  if (node === enums.NO_COALITION)
    return {
      fill: colors[party].regular,
      stroke: colors[party].dark,
    };
  if (Object.keys(partiesColors).includes(node))
    return {
      fill: colors[node].regular,
      stroke: colors[node].dark,
    };
  return {
    fill: colors.default.regular,
    stroke: colors.default.dark,
  };
};
