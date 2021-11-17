import Sankey from "./Sankey";
import { useState, useEffect } from "react";
import { scaleLinear } from "@visx/scale";
import Map from "./Map";

function App() {
  const [measure, setMeasure] = useState("votes");
  const [activeLink, setActiveLink] = useState(null);
  const [sankeyHeightScale, setSankeyHeightScale] = useState(() =>
    scaleLinear()
  );

  useEffect(() => {
    const maxValue = measure === "votes" ? 1872569 : 912;

    setSankeyHeightScale(() =>
      scaleLinear({
        domain: [0, maxValue],
        range: [80, 350],
      })
    );
  }, [measure, setSankeyHeightScale]);

  return (
    <div className="md:w-3/4 w-full mx-auto my-10">
      <h1 className="text-3xl text-gray-800 font-semibold text-center">
        Autárquicas 2021
      </h1>
      <div className="flex">
        <button onClick={() => setMeasure("votes")} className="btn btn-blue">
          Votos
        </button>
        <button onClick={() => setMeasure("mandates")} className="btn btn-blue">
          Mandatos
        </button>
      </div>
      <div className="flex flex-row">
        <div className="flex flex-col flex-wrap w-1/2">
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
              measure={measure}
              coalitionBreakdownParty={p.breakdown}
              heightScale={sankeyHeightScale}
              setActiveLink={setActiveLink}
              activeLink={activeLink}
            />
          ))}
        </div>
        <Map activeLink={activeLink} />
      </div>
    </div>
  );
}

export default App;
