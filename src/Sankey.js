import React, { useEffect, useState } from "react";
import { sankeyLayout } from "./utils/sankey";
import { sankeyLinkHorizontal } from "d3-sankey";
import { Group } from "@visx/group";
import { Text } from "@visx/text";
import useChartDimensions from "./hooks/useChartDimensions";
import { isNull } from "lodash";
import { colorNode } from "./utils/colors";
import { LinearGradient } from "@visx/gradient";

const linkPath = sankeyLinkHorizontal()
  .source((d) => [d.source.x1, d.y0])
  .target((d) => [d.target.x0, d.y1]);

export default function Sankey({ party }) {
  const [chartWrapperRef, dimensions] = useChartDimensions({
    marginRight: 200,
  });
  const [layout, setLayout] = useState(null);

  useEffect(() => {
    async function fetchData() {
      let partyData = await fetch("/api/elections", {
        method: "POST",
        body: JSON.stringify({ party }),
      });
      partyData = await partyData.json();

      setLayout(
        sankeyLayout(
          partyData.results,
          party,
          dimensions.boundedWidth,
          dimensions.boundedHeight
        )
      );
    }
    fetchData();
  }, [party, dimensions.boundedWidth, dimensions.boundedHeight]);

  console.log(layout?.links);

  return (
    <div ref={chartWrapperRef} className=" w-1/2 h-80">
      {!isNull(layout) ? (
        <svg viewBox={[0, 0, dimensions.width, dimensions.height]}>
          <Group top={dimensions.marginTop} left={dimensions.marginLeft}>
            {layout.links.map((link, index) => {
              const startColor = colorNode(link.source.name, party).fill;
              const endColor = colorNode(link.target.name, party).fill;

              return (
                <Group key={`link-${party}-${index}`}>
                  <LinearGradient
                    from={startColor}
                    to={endColor}
                    id={`gradient-${party}-${index}`}
                    vertical={false}
                  />

                  <path
                    d={linkPath(link)}
                    stroke={`url('#gradient-${party}-${index}')`}
                    strokeWidth={Math.max(1, link.width)}
                    opacity={0.5}
                    fill="none"
                  />
                </Group>
              );
            })}
            {layout.nodes.map((node, index) => {
              const color = colorNode(node.name, party);
              return (
                <Group
                  top={node.y0}
                  left={node.x0}
                  key={`node-${party}-${index}`}
                >
                  <rect
                    width={node.x1 - node.x0}
                    height={node.y1 - node.y0}
                    stroke={color.stroke}
                    fill={color.fill}
                  />
                  <Text
                    x={node.x1 - node.x0}
                    dx={5}
                    width={dimensions.marginRight - 5}
                    y={(node.y1 - node.y0) / 2}
                    verticalAnchor={"middle"}
                    fill={color.stroke}
                    className=" font-semibold"
                  >
                    {node.name}
                  </Text>
                </Group>
              );
            })}
          </Group>
        </svg>
      ) : null}
    </div>
  );
}
