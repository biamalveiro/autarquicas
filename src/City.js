import React, { useState } from "react";
import MapTooltip from "./MapTooltip";
import Tippy from "@tippyjs/react";
import { isNull, isUndefined } from "lodash";

import { colorNode } from "./utils/colors";

export default function City({ feature, path, activeLink, city }) {
  const [isOnHover, setIsOnHover] = useState(false);

  const partyForColor = isNull(activeLink)
    ? feature.properties.winner
    : city?.acronym;

  const { fill: color } = colorNode(partyForColor);

  const fill = !isNull(activeLink) && isUndefined(city) ? "transparent" : color;
  let fillOpacity = isNull(activeLink) || city?.isWinner ? 0.8 : 0.3;

  if (isOnHover) {
    fillOpacity += 0.2;
  }

  return (
    <Tippy
      key={`map-tippy-${feature.properties.key}`}
      duration={[100, 100]}
      delay={250}
      content={fill !== "transparent" ? <MapTooltip feature={feature} /> : null}
    >
      <path
        key={`map-feature-${feature.properties.key}`}
        d={path || ""}
        fill={fill}
        fillOpacity={fillOpacity}
        stroke={fill !== "transparent" ? "white" : "lightgray"}
        strokeWidth={isOnHover ? 2 : 1}
        onMouseEnter={() => setIsOnHover(true)}
        onMouseLeave={() => setIsOnHover(false)}
      />
    </Tippy>
  );
}
