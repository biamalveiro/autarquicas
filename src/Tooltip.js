import React from "react";
import enums from "./enum";
import { formatCount } from "./utils/formatters";

export default function Tooltip({ link, measure }) {
  return (
    <div className="border border-gray-400 shadow-lg py-1 px-2 bg-white text-sm">
      <h1>
        {![enums.COALITION, enums.NO_COALITION].includes(link.target.name)
          ? "com "
          : null}
        <span className="font-semibold">{link.target.name}</span>
      </h1>
      <span className="text-xs">{formatCount(link.value)}</span>
    </div>
  );
}
