import React from "react";
import { colorNode } from "./utils/colors";

export default function LinkResults({ results }) {
  console.log(results);
  return (
    <div>
      <h3 className="font-bold text-sm">Câmaras</h3>
      <p>
        <span
          className="font-bold"
          style={{
            color: colorNode(results[0].acronym, results[0].acronym).stroke,
          }}
        >
          {results.filter((r) => r.isWinner).length}
        </span>{" "}
        / {results.length}{" "}
      </p>
    </div>
  );
}
