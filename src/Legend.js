import React from "react";
import { colorNode } from "./utils/colors";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";

function Legend() {
  return (
    <Grid container spacing={2} className="mb-8" justifyContent="center">
      {[
        "PS",
        "PPD/PSD",
        "PCP-PEV",
        "B.E.",
        "CDS-PP",
        "Coligações ou Grupos de Cidadãos",
      ].map((p) => (
        <Grid item>
          <Stack direction="row" spacing={1} alignItems="center">
            <div
              key={`legend-${p}`}
              className="h-3 w-3"
              style={{ backgroundColor: colorNode(p, p).fill }}
            />
            <span className="text-gray-600 text-xs">{p}</span>
          </Stack>
        </Grid>
      ))}
    </Grid>
  );
}

export default Legend;
