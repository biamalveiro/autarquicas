import { Group } from "@visx/group";
import { Text } from "@visx/text";
import React from "react";
import { formatCount } from "./utils/formatters";
import { colorNode } from "./utils/colors";

export default function NodeLabel({ node, party }) {
  const isTitleNode = node.depth === 0;
  const translateDirection = isTitleNode ? -1 : 1;

  let nodeName = node.name;

  let fontSize = "text-base";
  if (isTitleNode) {
    fontSize = "text-lg";
  }

  if (node.depth === 2) {
    fontSize = "text-sm";
    nodeName = node.coalitionParties.filter((p) => p !== party).join("-");
  }

  return (
    <Group top={(node.y1 - node.y0) / 2}>
      <Text
        verticalAnchor="middle"
        x={isTitleNode ? node.x1 - node.x0 : 0}
        textAnchor={isTitleNode ? "end" : "start"}
        dx={`${0.8 * translateDirection}rem`}
        className={`font-semibold ${fontSize}`}
        fill={colorNode(node.name, party).stroke}
        width={120}
      >
        {nodeName}
      </Text>
      {isTitleNode ? (
        <Text
          verticalAnchor="middle"
          textAnchor="end"
          dx={`${0.3 * translateDirection}rem`}
          dy={"1rem"}
          className={"text-xs fill-current text-gray-500"}
        >
          {`${formatCount(node.value)} votos`}
        </Text>
      ) : null}
    </Group>
  );
}
