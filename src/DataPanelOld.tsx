import { DataFrame } from "danfojs/dist/danfojs-base";
import * as dfd from "danfojs/dist/danfojs-browser/src";
import { useState, useEffect } from "react";

const tasksFileURL = `${
  import.meta.env.BASE_URL
}data_dictionary/task_dictionary.csv`;
const variablesDirectoryFilesURL = `${
  import.meta.env.BASE_URL
}data_dictionary/variable_dictionaries`;

// Example list of CSV file names under `variable_dictionaries`
const variableCSVFiles = [
  "all_tasks.csv",
  "bird_alligator.csv",
  "gift_delay.csv",
  "grass_snow.csv",
];

function Selectable({ display, info }: { display: string; info: string }) {
  const onClick = () => alert(info);
  return (
    <div title={info}>
      <span>
        <span className="selectable">{display}</span>{" "}
        <button
          onClick={onClick}
          style={{ cursor: "pointer", width: "16px", height: "16px" }}
        >
          i
        </button>
      </span>
    </div>
  );
}

export function DataPanelOld({ data }: { data: DataFrame }) {
  const [tasksData, setTasksData] = useState<DataFrame | null>(null);
  const [variablesData, setVariablesData] = useState<DataFrame | null>(null);

  // Load tasks CSV
  useEffect(() => {
    dfd.readCSV(tasksFileURL).then((x) => {
      console.log("Task Dictionary:", x.head());
      setTasksData(x);
    });
  }, []);

  // Load multiple variable CSVs, then merge them
  useEffect(() => {
    // Build an array of full paths to each CSV file
    const variableCSVPaths = variableCSVFiles.map(
      (fileName) => `${variablesDirectoryFilesURL}/${fileName}`
    );

    Promise.all(variableCSVPaths.map((path) => dfd.readCSV(path)))
      .then((dataFrames) => {
        const mergedDF: DataFrame = dfd.concat({
          dfList: dataFrames,
          axis: 0,
        }) as DataFrame;
        console.log("Variables Dictionary Merged:", mergedDF.head());
        setVariablesData(mergedDF);
      })
      .catch((err) => console.error("Error reading variable CSVs", err));
  }, []);

  return (
    <>
      <div
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h2>Categories</h2>
          {tasksData &&
            [...new Set([...tasksData.column("category").values])].map(
              (cat, idx) => (
                <Selectable key={idx} display={cat as string} info="none" />
              )
            )}
        </div>
        <div>
          <h2>Tasks</h2>
          {tasksData &&
            tasksData.values.map((row, idx) => (
              <Selectable
                key={idx}
                display={row[0] as string}
                info={row[2] as string}
              />
            ))}
        </div>
        <div>
          <h2>Variables</h2>
          {/* Example usage of merged variablesData */}
          {variablesData &&
            variablesData.values.map((row, idx) => (
              <Selectable
                key={idx}
                display={row[0] as string}
                info={row[1] as string}
              />
            ))}
        </div>
        <div>
          <h2>Selected Variables</h2>
          {/* Implementation detail for selected variables */}
        </div>
      </div>
    </>
  );
}
