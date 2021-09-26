import Sankey from "./Sankey";

function App() {
  return (
    <div className="w-2/3 mx-auto my-10">
      <h1 className="text-3xl text-gray-800 font-semibold text-center">
        Eleições Autárquicas 2021
      </h1>
      <div className="flex flex-wrap">
        {["PS", "PPD/PSD", "B.E.", "CDS-PP", "PCP"].map((p) => (
          <Sankey party={p} />
        ))}
      </div>
    </div>
  );
}

export default App;
