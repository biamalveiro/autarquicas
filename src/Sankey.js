import React, { useEffect, useState } from "react";
import { isNull } from "lodash";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { Group } from "@visx/group";
import Container from "@mui/material/Container";

import useChartDimensions from "./hooks/useChartDimensions";
import { sankeyLayout } from "./utils/layout";
import { colorNode } from "./utils/colors";
import NodeLabel from "./NodeLabel";
import SankeyLink from "./SankeyLink";

export default function Sankey({
  party,
  measure,
  coalitionBreakdownParty,
  heightScale,
  setActiveLink,
  activeLink,
}) {
  const [layout, setLayout] = useState(null);
  const [coalitionParty, setCoalitionParty] = useState(coalitionBreakdownParty);
  const [coalitionPartyOptions, setCoalitionPartyOptions] = useState([]);
  const [heightValue, setHeightValue] = useState(100);

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
      setHeightValue(heightScale(nodes.find((n) => n.name === party).value));
    }
    fetchData();
  }, [
    party,
    measure,
    dimensions.boundedWidth,
    dimensions.boundedHeight,
    coalitionParty,
    heightScale,
  ]);

  return (
    <Container ref={chartWrapperRef}>
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
              <FormControl variant="standard">
                <Select
                  width="30%"
                  size="xs"
                  value={coalitionParty}
                  onChange={(evt) => setCoalitionParty(evt.target.value)}
                >
                  {coalitionPartyOptions.map((coalitionOption, i) => (
                    <MenuItem
                      key={`select-option=${i}`}
                      value={coalitionOption}
                    >
                      {coalitionOption}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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

                return (
                  <SankeyLink
                    key={`link-${party}-${index}`}
                    link={link}
                    index={index}
                    party={party}
                    isActiveLink={
                      activeLink?.link?.index === link.index &&
                      activeLink.party === party
                    }
                    onClick={() =>
                      setActiveLink({
                        party,
                        link,
                        linkTarget: link.target.name,
                        coalitionParty,
                      })
                    }
                  />
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
    </Container>
  );
}
