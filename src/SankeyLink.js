import React, { useState } from "react";
import { colorNode } from "./utils/colors";
import { Group } from "@visx/group";
import { LinearGradient } from "@visx/gradient";
import { sankeyLinkHorizontal } from "d3-sankey";
import Tippy from "@tippyjs/react";

import Tooltip from "./Tooltip";

const linkPath = sankeyLinkHorizontal()
  .source((d) => [d.source.x1, d.y0])
  .target((d) => [d.target.x0, d.y1]);

function SankeyLink({ link, index, party, isActiveLink, onClick }) {
  const [isOnHover, setIsOnHover] = useState(false);
  const startColor = colorNode(link.source.name, party).fill;
  const endColor = colorNode(link.target.name, party).fill;

  return (
    <Group>
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
          strokeOpacity={isOnHover || isActiveLink ? 0.5 : 0.2}
          fill="none"
          onMouseEnter={() => setIsOnHover(true)}
          onMouseLeave={() => setIsOnHover(false)}
          className="cursor-pointer"
          onClick={onClick}
        />
      </Tippy>
    </Group>
  );
}

export default SankeyLink;
