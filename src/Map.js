import React, { useEffect, useLayoutEffect, useState } from "react";
import * as topojson from "topojson-client";
import useChartDimensions from "./hooks/useChartDimensions";
import { Mercator } from "@visx/geo";
import { isEmpty, isNull, isUndefined } from "lodash";
import { colorNode } from "./utils/colors";
import { Group } from "@visx/group";
import Tippy from "@tippyjs/react";

import LinkResults from "./LinkResults";
import MapTooltip from "./MapTooltip";

const convertToGeojson = (topo) => {
  return topojson.feature(topo, topo.objects.concelhos);
};

export default function Map({ activeLink }) {
  const [map, setMap] = useState(null);
  const [activeResults, setActiveResults] = useState([]);
  const [hoverCity, setHoverCity] = useState(null);
  const [mapWrapperRef, dimensions] = useChartDimensions({ marginBottom: 100 });

  useLayoutEffect(() => {
    async function fetchData() {
      const { party, linkTarget, coalitionParty } = activeLink;
      let data = await fetch("/api/results", {
        method: "POST",
        body: JSON.stringify({ party, linkTarget, coalitionParty }),
      });
      const { results } = await data.json();

      setActiveResults(results);
    }
    if (isNull(activeLink)) {
      setActiveResults([]);
    } else {
      fetchData();
    }
  }, [activeLink]);

  useEffect(() => {
    async function fetchData() {
      let data = await fetch("/api/map");
      const mapData = await data.json();

      setMap({
        continent: convertToGeojson(mapData.continent),
        azores: convertToGeojson(mapData.azores),
        madeira: convertToGeojson(mapData.madeira),
      });
    }
    fetchData();
  }, []);

  console.log("render map");

  return (
    <div ref={mapWrapperRef} className="h-screen w-128 sticky top-12">
      <svg width={dimensions.width} height={dimensions.boundedHeight * 0.7}>
        {!isNull(map) ? (
          <>
            <Group id="continent">
              <Mercator
                data={map.continent.features}
                fitSize={[
                  [dimensions.boundedWidth, dimensions.boundedHeight * 0.7],
                  map.continent,
                ]}
              >
                {({ features }) =>
                  features.map(({ feature, path, projection }, i) => {
                    const partyForColor = !isNull(activeLink)
                      ? activeLink.party
                      : feature.properties.winner;

                    let fillOpacity = 0.8;

                    let { fill } = colorNode(partyForColor);

                    if (!isEmpty(activeResults)) {
                      const city = activeResults.find(
                        (r) => r.cityKey === feature.properties.key
                      );

                      if (!isUndefined(city)) {
                        if (!city.isWinner) {
                          fillOpacity = 0.3;
                        }
                      } else {
                        fill = "transparent";
                      }
                    }

                    if (
                      feature.properties.key === hoverCity &&
                      !isNull(hoverCity)
                    ) {
                      fillOpacity = fillOpacity + 0.2;
                    }

                    return (
                      <Tippy
                        duration={[100, 100]}
                        delay={250}
                        content={
                          fill !== "transparent" ? (
                            <MapTooltip feature={feature} />
                          ) : null
                        }
                      >
                        <path
                          key={`map-feature-${feature.properties.key}`}
                          d={path || ""}
                          fill={fill}
                          fillOpacity={fillOpacity}
                          stroke={
                            fill !== "transparent" ? "white" : "lightgray"
                          }
                          strokeWidth={
                            feature.properties.key === hoverCity ? 2 : 1
                          }
                          onMouseEnter={() =>
                            setHoverCity(feature.properties.key)
                          }
                          onMouseLeave={() => setHoverCity(null)}
                        />
                      </Tippy>
                    );
                  })
                }
              </Mercator>
            </Group>
            {/* <Group id="azores" top={dimensions.boundedHeight * 0.75} left={0}>
              <rect
                y={10}
                width={dimensions.boundedWidth * 0.8}
                height={dimensions.boundedHeight * 0.15}
                fill="transparent"
                stroke="lightgrey"
              />
              <Text className=" font-semibold">Açores</Text>
              <Group left={5} top={10}>
                <Mercator
                  data={map.azores.features}
                  fitSize={[
                    [
                      dimensions.width * 0.8 - 20,
                      dimensions.height * 0.15 - 20,
                    ],
                    map.azores,
                  ]}
                >
                  {({ features }) =>
                    features.map(({ feature, path, projection }, i) => {
                      console.log(feature);
                      const color = colorNode(
                        feature.properties.winner,
                        feature.properties.winner
                      );
                      return (
                        <path
                          key={`map-feature-${feature.properties["NAME_2"]}`}
                          d={path || ""}
                          fill={color.fill}
                          fillOpacity={0.8}
                          stroke={"white"}
                          strokeWidth={1}
                        />
                      );
                    })
                  }
                </Mercator>
              </Group>
            </Group> */}
          </>
        ) : null}
      </svg>
      {!isEmpty(activeResults) ? <LinkResults results={activeResults} /> : null}
    </div>
  );
}
