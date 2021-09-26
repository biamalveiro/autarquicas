import React from "react";
import enums from "./enum";
import { formatCount } from "./utils/formatters";

export default function Tooltip({ link }) {
  return (
    <div className=" bg-gray-700 shadow-lg px-2 py-1 text-sm text-white">
      <h1>
        {![enums.COALITION, enums.NO_COALITION].includes(link.target.name)
          ? "com "
          : null}
        <span className="font-semibold">{link.target.name}</span>
      </h1>
      <span className="text-xs">{formatCount(link.value)} votos</span>
    </div>
  );
}
