import React, { useEffect, useState } from "react";
import { isNull } from "lodash";
import { Select } from "@chakra-ui/react";
import { sankeyLinkHorizontal } from "d3-sankey";
import { Group } from "@visx/group";
import { LinearGradient } from "@visx/gradient";
import Tippy from "@tippyjs/react";

import useChartDimensions from "./hooks/useChartDimensions";
import { sankeyLayout } from "./utils/layout";
import { colorNode } from "./utils/colors";
import NodeLabel from "./NodeLabel";
import Tooltip from "./Tooltip";

const linkPath = sankeyLinkHorizontal()
  .source((d) => [d.source.x1, d.y0])
  .target((d) => [d.target.x0, d.y1]);

export default function Sankey({
  party,
  measure,
  coalitionBreakdownParty,
  heightScale,
  setActiveLink,
  activeLink,
}) {
  const [layout, setLayout] = useState(null);
  const [hoverLink, setHoverLink] = useState(null);
  const [coalitionParty, setCoalitionParty] = useState(coalitionBreakdownParty);
  const [coalitionPartyOptions, setCoalitionPartyOptions] = useState([]);

  const heightValue = heightScale(
    layout?.nodes.find((n) => n.name === party)?.value
  );

  const [chartWrapperRef, dimensions] = useChartDimensions({
    marginRight: 120,
    marginLeft: 10,
    marginTop: 10,
    height: heightValue,
  });

  useEffect(() => {
    async function fetchData() {
      let data = await fetch("/api/sankey", {
        method: "POST",
        body: JSON.stringify({ party, measure, coalitionParty }),
      });
      const { nodes, links, coalitionParties } = await data.json();

      setCoalitionPartyOptions(coalitionParties);

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
  }, [
    party,
    measure,
    dimensions.boundedWidth,
    dimensions.boundedHeight,
    coalitionParty,
  ]);

  return (
    <div ref={chartWrapperRef} className="w-128">
      {!isNull(layout) ? (
        <>
          <h3
            className="text-lg font-bold"
            style={{ color: colorNode(party, party).stroke }}
          >
            {party === "PCP-PEV" ? "CDU" : party}
          </h3>
          {!isNull(coalitionParty) ? (
            <div className="w-3/4 flex flex-row items-center mb-6">
              <p className=" text-gray-600 text-sm mr-2">
                Ver coligações que íncluem{" "}
              </p>
              <Select
                width="30%"
                size="xs"
                value={coalitionParty}
                onChange={(evt) => setCoalitionParty(evt.target.value)}
              >
                {coalitionPartyOptions.map((coalitionOption, i) => (
                  <option key={`select-option=${i}`} value={coalitionOption}>
                    {coalitionOption}
                  </option>
                ))}
              </Select>
            </div>
          ) : null}
          <svg viewBox={[0, 0, dimensions.width, dimensions.height]}>
            <Group top={dimensions.marginTop} left={dimensions.marginLeft}>
              <rect
                width={dimensions.boundedWidth}
                height={dimensions.boundedHeight}
                fill="transparent"
                onClick={() => setActiveLink(null)}
              />
              {layout.links.map((link, index) => {
                if (link.value === 0) return null;
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
                        strokeOpacity={
                          hoverLink === link.index ||
                          (activeLink?.link?.index === link.index &&
                            activeLink.party === party)
                            ? 0.5
                            : 0.2
                        }
                        fill="none"
                        onMouseEnter={() => setHoverLink(link.index)}
                        onMouseLeave={() => setHoverLink(null)}
                        className="cursor-pointer"
                        onClick={() =>
                          setActiveLink({
                            party,
                            linkTarget: link.target.name,
                            coalitionParty,
                          })
                        }
                      />
                    </Tippy>
                  </Group>
                );
              })}
              {layout.nodes.map((node, index) => {
                if (node.value === 0) return null;
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
                    {node.depth > 0 ? (
                      <NodeLabel node={node} party={party} measure={measure} />
                    ) : null}
                  </Group>
                );
              })}
            </Group>
          </svg>
        </>
      ) : null}
    </div>
  );
}
