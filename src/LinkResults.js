import Stack from "@mui/material/Stack";
import React from "react";
import { colorNode } from "./utils/colors";

export default function LinkResults({ results }) {
  const { fill } = colorNode(results[0].acronym, results[0].acronym);
  return (
    <div>
      <Stack direction="column">
        <Stack direction="row" spacing={1} alignItems="center">
          <div className="w-3 h-3" style={{ backgroundColor: fill }} />
          <span>Venceu ({results.filter((r) => r.isWinner).length})</span>
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          <div
            className="w-3 h-3"
            style={{ backgroundColor: fill, opacity: 0.3 }}
          />
          <span>
            Não elegeu presidente (
            {results.length - results.filter((r) => r.isWinner).length})
          </span>
        </Stack>
      </Stack>
    </div>
  );
}
