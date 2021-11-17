import { Group } from "@visx/group";
import { Text } from "@visx/text";
import React from "react";
import { formatCount } from "./utils/formatters";
import { colorNode } from "./utils/colors";
import enums from "./enum";

const measureLabel = {
  votes: "votos",
  mandates: "mandatos",
};

export default function NodeLabel({ node, party, measure }) {
  const nodeName = node.name === "PCP-PEV" ? "CDU" : node.name;

  const y = (node.y1 - node.y0) / 2;

  return (
    <Group top={node.name === enums.OTHER_COALITION ? y + 10 : y}>
      <Text
        verticalAnchor="middle"
        x={0}
        textAnchor={"start"}
        dx={"0.8rem"}
        className={"font-semibold text-base"}
        fill={colorNode(node.name, party).stroke}
        width={node.name === enums.NO_COALITION ? 70 : 120}
      >
        {nodeName}
      </Text>
      <Text
        verticalAnchor="middle"
        textAnchor="start"
        dx={"0.8rem"}
        dy={
          [enums.NO_COALITION, enums.OTHER_COALITION].includes(node.name)
            ? "1.5rem"
            : "1rem"
        }
        className={"text-xs fill-current text-gray-500"}
      >
        {`${measure === "votes" ? formatCount(node.value) : node.value} ${
          measureLabel[measure]
        }`}
      </Text>
      )
    </Group>
  );
}
