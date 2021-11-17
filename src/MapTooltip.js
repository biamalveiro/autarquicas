import { Group } from "@visx/group";
import { scaleLinear, scaleBand } from "@visx/scale";
import { Text } from "@visx/text";
import { Bar } from "@visx/shape";
import React from "react";
import useChartDimensions from "./hooks/useChartDimensions";
import { colorNode } from "./utils/colors";

const barHeight = 10;
const barSpacing = 25;
const marginY = 20;

export default function MapTooltip({ feature }) {
  const [chartWrapperRef, dimensions] = useChartDimensions({
    height:
      feature.properties.results.length * (barHeight + barSpacing) -
      barSpacing +
      2 * marginY,
    width: 300,
    marginLeft: 10,
    marginRight: 10,
    marginTop: marginY,
    marginBottom: marginY,
  });

  const scaleX = scaleLinear({
    range: [0, dimensions.boundedWidth],
    domain: [0, 100],
  });

  return (
    <div className="rounded border border-gray-400 shadow-lg py-2 px-1 bg-white text-sm">
      <h2 className="font-bold">{feature.properties["NAME_2"]}</h2>
      <div ref={chartWrapperRef}>
        <svg width={dimensions.width} height={dimensions.height}>
          <Group top={dimensions.marginTop}>
            {feature.properties.results.map((res, index) => {
              const { fill, stroke } = colorNode(res.acronym, res.acronym);
              return (
                <Group
                  top={barHeight * index + barSpacing * index}
                  left={dimensions.marginLeft}
                >
                  <Bar
                    key={`bar-tooltip-${feature.properties.key}-${res.acronym}`}
                    y={barHeight / 2}
                    width={scaleX(res.percentage)}
                    height={barHeight}
                    fill={fill}
                  />
                  <Text
                    fill={stroke}
                    y={barHeight}
                    x={scaleX(res.percentage)}
                    dx={5}
                    verticalAnchor="middle"
                  >
                    {`${res.percentage}%`}
                  </Text>
                  <Text className="font-bold" fill={stroke}>
                    {res.acronym}
                  </Text>
                </Group>
              );
            })}
          </Group>
        </svg>
      </div>
    </div>
  );
}
