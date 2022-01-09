import React, { useEffect, useState } from "react";
import * as topojson from "topojson-client";
import useChartDimensions from "./hooks/useChartDimensions";
import { Mercator } from "@visx/geo";
import { isEmpty, isNull } from "lodash";
import { Group } from "@visx/group";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";

import City from "./City";
import LinkResults from "./LinkResults";

const convertToGeojson = (topo) => {
  return topojson.feature(topo, topo.objects.concelhos);
};

function Map({ activeLink }) {
  const [isFetchingData, setIsFetchingData] = useState(false);
  const [map, setMap] = useState(null);
  const [activeResults, setActiveResults] = useState([]);
  const [mapWrapperRef, dimensions] = useChartDimensions({
    marginBottom: 0,
    marginTop: 0,
  });

  useEffect(() => {
    async function fetchData() {
      setIsFetchingData(true);
      const { party, linkTarget, coalitionParty } = activeLink;
      let data = await fetch("/api/results", {
        method: "POST",
        body: JSON.stringify({ party, linkTarget, coalitionParty }),
      });
      const { results } = await data.json();
      setIsFetchingData(false);
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
      setIsFetchingData(true);

      let data = await fetch("/api/map");
      const mapData = await data.json();

      setMap({
        continent: convertToGeojson(mapData.continent),
        azores: convertToGeojson(mapData.azores),
        madeira: convertToGeojson(mapData.madeira),
      });
      setIsFetchingData(false);
    }
    fetchData();
  }, []);

  return (
    <Box
      sx={{
        height: "max-content",
        backgroundColor: "white",
        position: "sticky",
        top: 0,
        py: 2,
        zIndex: 1300, // https://mui.com/customization/z-index/#main-content
      }}
    >
      <Container
        ref={mapWrapperRef}
        sx={{
          height: { xs: 400, md: 700 },
          width: { xs: 200, md: 350 },
        }}
      >
        <svg width={dimensions.width} height={dimensions.height}>
          {!isNull(map) ? (
            <>
              <Group id="continent">
                {!isFetchingData && (
                  <Mercator
                    data={map.continent.features}
                    fitSize={[
                      [
                        dimensions.boundedHeight / 2.5,
                        dimensions.boundedHeight,
                      ],
                      map.continent,
                    ]}
                  >
                    {({ features }) =>
                      features.map(({ feature, path, projection }, i) => {
                        const city = activeResults.find(
                          (r) => r.cityKey === feature.properties.key
                        );

                        return (
                          <City
                            key={`city-${feature.properties.key}`}
                            feature={feature}
                            path={path}
                            activeLink={activeLink}
                            city={city}
                          />
                        );
                      })
                    }
                  </Mercator>
                )}
              </Group>
            </>
          ) : null}
        </svg>
      </Container>
      {!isEmpty(activeResults) ? <LinkResults results={activeResults} /> : null}
    </Box>
  );
}

export default Map;
