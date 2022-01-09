import Sankey from "./Sankey";
import { useState } from "react";
import { scaleLinear } from "@visx/scale";
import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";

import Map from "./Map";
import Legend from "./Legend";

function App() {
  const [activeLink, setActiveLink] = useState(null);

  const sankeyHeightScale = scaleLinear({
    domain: [0, 1872569],
    range: [80, 350],
  });

  return (
    <Container
      className="px-4 mx-auto my-10"
      sx={{ width: { sx: "100%", md: "75%" } }}
    >
      <h1 className="text-3xl text-gray-800 font-semibold text-center">
        A união faz a força?
      </h1>
      <h1 className=" text-base uppercase text-gray-500 text-center">
        Autárquicas 2021
      </h1>
      <p className="text-center text-gray-600 text-sm w-3/4 mx-auto mt-4 mb-4">
        Em eleições autárquicas, vão a votos os órgãos autárquicos de 308
        municípios do país. São muitos os casos em que os principais partidos se
        juntam em coligações que ambicionam conseguir mais votos. Com quem se
        coliga cada um dos principais partidos? Quantos votos de cada partido
        são fruto de coligações?
      </p>
      <Legend />
      <Stack direction={{ xs: "column", md: "row-reverse" }}>
        <Map activeLink={activeLink} />
        <Stack direction="column" sx={{ width: { sx: "100%", md: "50%" } }}>
          {[
            { name: "PS", breakdown: "L" },
            { name: "PPD/PSD", breakdown: "CDS-PP" },
            { name: "PCP-PEV", breakdown: null },
            { name: "B.E.", breakdown: "PS" },
            { name: "CDS-PP", breakdown: "PPD/PSD" },
          ].map((p) => (
            <Sankey
              key={`sankey-${p.name}`}
              party={p.name}
              measure={"votes"}
              coalitionBreakdownParty={p.breakdown}
              heightScale={sankeyHeightScale}
              setActiveLink={setActiveLink}
              activeLink={activeLink}
            />
          ))}
        </Stack>
      </Stack>
    </Container>
  );
}

export default App;
