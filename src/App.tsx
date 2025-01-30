import { useState } from "react";
import "./App.css";
import * as dfd from "danfojs/dist/danfojs-browser/src";
import { DataPanel } from "./DataPanel";
import { DataFrame } from "danfojs/dist/danfojs-base";
import { VariablesPanel } from "./VariablesPanel";

function App() {
  const [batesLabData, setBatesLabData] = useState<DataFrame | null>(null);

  const handleFileInput = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".csv";

    fileInput.addEventListener("change", (event: any) => {
      const target = event.target;
      if (target && target.files && target.files.length > 0) {
        const file = target.files[0];
        processCSV(file);
      }
    });

    // Programmatically trigger the file input click event
    fileInput.click();
  };

  const processCSV = async (file: string) => {
    const df = await dfd.readCSV(file);
    console.log(df.head());
    setBatesLabData(df);
  };

  return (
    <>
      <div style={{ justifyItems: "center" }}>
        <h1>Bates Lab Data Explorer</h1>
      </div>
      {!batesLabData ? (
        <div style={{ justifyItems: "center" }}>
          <p>Welcome to the Bates Lab Data Explorer. To get started:</p>
          <ul>
            <li>Log into the Bates Lab server</li>
            <li>
              Click "Select Data File" below, which will open your file explorer
            </li>
            <li>Navigate to the CSV file "TDS_wide.csv"</li>
          </ul>
          <div style={{ textAlign: "center" }}>
            <button className="big_button" onClick={handleFileInput}>
              Select Data File
            </button>
          </div>
        </div>
      ) : (
        <DataPanel dataframe={batesLabData}></DataPanel>
      )}
    </>
  );
}

export default App;
