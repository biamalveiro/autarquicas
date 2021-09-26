import Sankey from "./Sankey";

function App() {
  return (
    <div className="md:w-3/4 w-full mx-auto my-10">
      <h1 className="text-3xl text-gray-800 font-semibold text-center">
        Eleições Autárquicas 2021
      </h1>
      <div className="flex flex-wrap">
        {["PS", "PPD/PSD", "B.E.", "CDS-PP"].map((p) => (
          <Sankey key={`sankey-${p}`} party={p} />
        ))}
      </div>
    </div>
  );
}

export default App;
