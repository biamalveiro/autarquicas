import React, { useEffect, useState } from "react";
import { isNull } from "lodash";
import { sankeyLinkHorizontal } from "d3-sankey";
import { Group } from "@visx/group";
import { Text } from "@visx/text";
import { LinearGradient } from "@visx/gradient";
import Tippy from "@tippyjs/react";

import useChartDimensions from "./hooks/useChartDimensions";
import { sankeyLayout } from "./utils/layout";
import { colorNode } from "./utils/colors";
import { formatCount } from "./utils/formatters";
import NodeLabel from "./NodeLabel";
import Tooltip from "./Tooltip";

const linkPath = sankeyLinkHorizontal()
  .source((d) => [d.source.x1, d.y0])
  .target((d) => [d.target.x0, d.y1]);

export default function Sankey({ party }) {
  const [chartWrapperRef, dimensions] = useChartDimensions({
    marginRight: 120,
    marginLeft: 80,
  });
  const [layout, setLayout] = useState(null);
  const [hoverLink, setHoverLink] = useState(null);

  useEffect(() => {
    async function fetchData() {
      let data = await fetch("/api/sankey", {
        method: "POST",
        body: JSON.stringify({ party, measure: "votes" }),
      });
      const { nodes, links } = await data.json();

      setLayout(
        sankeyLayout(
          nodes,
          links,
          dimensions.boundedWidth,
          dimensions.boundedHeight
        )
      );
    }
    fetchData();
  }, [party, dimensions.boundedWidth, dimensions.boundedHeight]);

  return (
    <div ref={chartWrapperRef} className=" w-128 h-80">
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
                    gradientUnits="userSpaceOnUse"
                    toOffset="60%"
                    fromOffset="30%"
                  />
                  <Tippy content={<Tooltip link={link} />}>
                    <path
                      d={linkPath(link)}
                      stroke={`url('#gradient-${party}-${index}')`}
                      strokeWidth={Math.max(1, link.width)}
                      strokeOpacity={hoverLink === link.index ? 0.6 : 0.4}
                      fill="none"
                      onMouseEnter={() => setHoverLink(link.index)}
                      onMouseLeave={() => setHoverLink(null)}
                      className="cursor-pointer"
                    />
                  </Tippy>
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
                  <NodeLabel node={node} party={party} />
                  {/* {node?.coalitionParties ? (
                    <text
                      dx={1}
                      dy={"0.4rem"}
                      x={node.x1 - node.x0}
                      y={(node.y1 - node.y0) / 2}
                      fill={color.stroke}
                      className=" font-semibold text-sm"
                    >
                      {[...node.coalitionParties].map((p) => (
                        <tspan fill={colorNode(p, party).fill} dx={5}>
                          {p}
                        </tspan>
                      ))}
                    </text>
                  ) : (
                    <text
                      dx={5}
                      dy={"0.4rem"}
                      x={node.x1 - node.x0}
                      y={(node.y1 - node.y0) / 2}
                      fill={color.stroke}
                      className=" font-semibold"
                    >
                      {node.name}
                    </text>
                  )} */}
                  {/* }
                  <Text
                    x={node.x1 - node.x0}
                    dx={5}
                    width={dimensions.marginRight - 5}
                    y={(node.y1 - node.y0) / 2}
                    verticalAnchor={"middle"}
                    fill={color.stroke}
                    className=" font-semibold"
                  >
                    {node?.coalitionParties ? (
                      [...node.coalitionParties].map((p) => <tspan>{p}</tspan>)
                    ) : (
                      <tspan>{node.name}</tspan>
                    )}
                  </Text> */}
                </Group>
              );
            })}
          </Group>
        </svg>
      ) : null}
    </div>
  );
}
