import { useCallback, useEffect, useState } from "react";
import Listbox from "./Listbox/Listbox";
import { SelectableVariableItem } from "./Listbox/SelectableVariableItem";
import { SelectedVariableItem } from "./Listbox/SelectedVariableItem";
import * as dfd from "danfojs/dist/danfojs-browser/src";
import { DataFrame } from "danfojs/dist/danfojs-base";
import { LoadingPanel } from "./LoadingPanel";
import dataPanelStyles from "./DataPanel.module.css";

const VARIABLE_METADATA_DIRECTORY_URL = `${
  import.meta.env.BASE_URL
}data_dictionary/variable_dictionaries`;

const VARIABLE_METADATA_CSV_FILES = [
  "all_tasks.csv",
  "bird_alligator.csv",
  "door_opening.csv",
  "fruit_stroop.csv",
  "gift_delay.csv",
  "grass_snow.csv",
  "snack_delay.csv",
  "sustained_attention.csv",
];

const areSetsEqual = (a: any, b: any) =>
  a.size === b.size && [...a].every((value) => b.has(value));

// const getVariables(category: string, task: string) {

// }

export function VariablesPanel({
  variablesDataframeFile,
  tasksDataframe,
  category,
  tasks,
  setModal,
  lockedVariableNames,
}: {
  variablesDataframeFile: File;
  tasksDataframe: DataFrame;
  category: string;
  tasks: string[];
  setModal: (description: string) => void;
  lockedVariableNames?: string[];
}) {
  const getCategoryForTask = (task: string) => {
    const result = (tasksDataframe.loc({
      rows: tasksDataframe["task"].eq(task),
      columns: ["category"],
    }).values[0] || ["all"]) as string[];
    return result[0];
  };

  const [selectedVariables, setSelectedVariables] = useState<string[]>([]);
  const [variablesInQueue, setVariablesInQueue] = useState<string[]>(
    lockedVariableNames || []
  );
  const [selectedVariablesInQueue, setSelectedVariablesInQueue] = useState<
    string[]
  >([]);
  const [filterString, setFilterString] = useState<string>("");

  const [variablesMetadata, setVariablesMetadata] = useState<DataFrame | null>(
    null
  );

  const [loadingMessage, setLoadingMessage] = useState<string>("");

  const getVariables = useCallback(() => {
    if (tasks && tasks.length) {
      const result = variablesMetadata.loc({
        rows: variablesMetadata["task"].values.map((x) =>
          [...tasks, "all_tasks"].includes(x)
        ),
        columns: ["variable_name"],
      });
      return result.getColumnData[0] as string[];
    }
    return variablesMetadata?.getColumnData[0] as string[];
  }, [category, tasks, variablesMetadata]);

  function explodeByMonths(df) {
    // Collect new rows in plain JS objects
    const newRows = [];

    // Loop over each row
    for (let i = 0; i < df.shape[0]; i++) {
      // Convert that row to an object for easy manipulation
      const rowObj = dfd.toJSON(df.iloc({ rows: [i] }))[0];

      // If months is present and not null
      if (rowObj.months) {
        // Split on comma
        const splitMonths = rowObj.months.split(",");
        // For each split month, push a new row
        splitMonths.forEach((m) => {
          // Copy the original row, but replace months with the single month
          const newRow = {
            ...rowObj,
            variable_name: rowObj.variable_name + m.trim(),
          };
          newRows.push(newRow);
        });
      } else {
        // If months is empty or null, just add the original row
        newRows.push(rowObj);
      }
    }

    // Construct and return a new DataFrame
    return new dfd.DataFrame(newRows);
  }

  const loadVariableMetada = () => {
    Promise.all(
      VARIABLE_METADATA_CSV_FILES.map((filename) =>
        dfd
          .readCSV(`${VARIABLE_METADATA_DIRECTORY_URL}/${filename}`)
          .then((df) => {
            // Create a new column filled with the CSV path
            const taskName = filename.slice(0, -4);
            const taskColumn = new Array(df.shape[0]).fill(taskName);
            const categoryColumn = new Array(df.shape[0]).fill(
              getCategoryForTask(taskName)
            );
            df = df.addColumn("task", taskColumn); // mutate df by adding "task" column
            df = df.addColumn("category", categoryColumn);
            df = explodeByMonths(df);
            return df;
          })
      )
    )
      .then((dataFrames) => {
        // Merge all the DataFrames
        const mergedDF = dfd.concat({
          dfList: dataFrames,
          axis: 0,
        }) as DataFrame;
        setVariablesMetadata(mergedDF);
      })
      .catch((err) => console.error("Error reading variable CSVs", err));
  };

  useEffect(() => {
    loadVariableMetada();
  }, []);

  const saveAsCSV = async () => {
    setLoadingMessage("Gathering data. This could take several seconds.");
    // Create a new DataFrame that only includes the columns in selectedVariablesInQueue
    try {
      const variablesDataframe = await dfd.readCSV(variablesDataframeFile);
      const filteredDf = variablesDataframe.loc({
        columns: variablesInQueue,
      });
      // Trigger a CSV download using the filtered DataFrame
      dfd.toCSV(filteredDf, {
        fileName: "data.csv",
        download: true,
      });
    } catch {
      alert(
        "There was an error saving the CSV. Are you sure you loaded the correct file? Refresh and try again."
      );
    }
    setLoadingMessage("");
  };

  const getVariableDescription = (variableName: string) => {
    const description = variablesMetadata
      ?.loc({
        rows: variablesMetadata["variable_name"].eq(variableName),
      })
      .loc({ columns: ["variable_description"] }).values[0];
    return description ? description.toString() : "No description";
  };

  if (!variablesMetadata) {
    return <LoadingPanel />;
  }

  return (
    <div style={{ display: "flex", gap: "1rem" }}>
      <div className={dataPanelStyles.variable_panel}>
        <Listbox label="Variables" onSelect={setSelectedVariables}>
          {getVariables()
            .filter((x) =>
              `${x}`.toLowerCase().includes(filterString.toLowerCase())
            )
            .map((x) => (
              <SelectableVariableItem
                key={x}
                isInQueue={variablesInQueue.includes(`${x}`)}
                description={getVariableDescription(x)}
                name={`${x}`}
                id={`${x}`}
                setModal={setModal}
                onAdd={(id) =>
                  setVariablesInQueue([
                    ...new Set(variablesInQueue.concat([id])),
                  ])
                }
              ></SelectableVariableItem>
            ))}
        </Listbox>
        <div
          id="selectable-variables-options"
          style={{ display: "flex", flexDirection: "column", gap: "8px" }}
        >
          <button
            className="little_button"
            onClick={() =>
              setVariablesInQueue([
                ...new Set(variablesInQueue.concat(selectedVariables)),
              ])
            }
            disabled={selectedVariables.length === 0}
          >
            Add Selected
          </button>
          <button
            className="little_button"
            onClick={() =>
              setVariablesInQueue([
                ...new Set(
                  variablesInQueue.concat(
                    getVariables().filter((x) =>
                      `${x}`.toLowerCase().includes(filterString.toLowerCase())
                    )
                  )
                ),
              ])
            }
          >
            Add All
          </button>
          <span>
            <label htmlFor="filter">Filter:</label>
            <input
              className="textbox"
              id="filter"
              onChange={(e) => setFilterString(e.target.value)}
            ></input>
          </span>
        </div>
      </div>
      <div className={dataPanelStyles.variable_panel}>
        <Listbox
          label="Selected Variables"
          onSelect={setSelectedVariablesInQueue}
        >
          {variablesInQueue.map((x) => (
            <SelectedVariableItem
              key={x}
              text={`${x}`}
              id={`${x}`}
              locked={lockedVariableNames?.includes(x)}
              onRemove={(id) => {
                setVariablesInQueue(variablesInQueue.filter((x) => x != id));
                setSelectedVariablesInQueue(
                  selectedVariablesInQueue.filter((s) => s !== `${x}`)
                );
              }}
            ></SelectedVariableItem>
          ))}
        </Listbox>
        <div
          id="selected-variables-options"
          style={{ display: "flex", flexDirection: "column", gap: "8px" }}
        >
          <button
            className="little_button"
            onClick={() => {
              setVariablesInQueue(
                variablesInQueue.filter(
                  (x) =>
                    !selectedVariablesInQueue.includes(x) ||
                    lockedVariableNames?.includes(x)
                )
              );
              setSelectedVariablesInQueue([]);
            }}
            disabled={
              selectedVariablesInQueue.length === 0 ||
              areSetsEqual(
                new Set(selectedVariablesInQueue),
                new Set(lockedVariableNames)
              )
            }
          >
            Remove Selected
          </button>
          <button
            className="little_button"
            onClick={() => {
              setVariablesInQueue(lockedVariableNames || []);
              setSelectedVariablesInQueue([]);
            }}
            disabled={
              variablesInQueue.length ===
              (lockedVariableNames ? lockedVariableNames.length : 0)
            }
          >
            Remove All
          </button>
          <button
            className="little_button"
            onClick={async () => await saveAsCSV()}
            disabled={
              variablesInQueue.length ===
              (lockedVariableNames ? lockedVariableNames.length : 0)
            }
          >
            Save As CSV
          </button>
        </div>
      </div>
      {loadingMessage && <LoadingPanel message={loadingMessage} />}
    </div>
  );
}
