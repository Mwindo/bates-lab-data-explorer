import { useCallback, useEffect, useState } from "react";
import Listbox from "./Listbox/Listbox";
import { SelectableVariableItem } from "./Listbox/SelectableVariableItem";
import { SelectedVariableItem } from "./Listbox/SelectedVariableItem";
import * as dfd from "danfojs/dist/danfojs-browser/src";
import { DataFrame } from "danfojs/dist/danfojs-base";

const VARIABLE_METADATA_DIRECTORY_URL = `${
  import.meta.env.BASE_URL
}data_dictionary/variable_dictionaries`;

const VARIABLE_METADATA_CSV_FILES = [
  "all_tasks.csv",
  "bird_alligator.csv",
  "gift_delay.csv",
  "grass_snow.csv",
];

// const getVariables(category: string, task: string) {

// }

export function VariablesPanel({
  variablesDataframeFile,
  tasksDataframe,
  category,
  task,
}: {
  variablesDataframeFile: File;
  tasksDataframe: DataFrame;
  category: string;
  task: string;
}) {
  const getCategoryForTask = (task: string) => {
    const result = (tasksDataframe.loc({
      rows: tasksDataframe["task"].eq(task),
      columns: ["category"],
    }).values[0] || ["all"]) as string[];
    return result[0];
  };

  const [limitToSelectedCategory, setLimitToSelectedCategory] =
    useState<boolean>(false);
  const [limitToSelectedTask, setLimitToSelectedTask] =
    useState<boolean>(false);

  const [selectedVariables, setSelectedVariables] = useState<string[]>([]);
  const [variablesInQueue, setVariablesInQueue] = useState<string[]>([]);
  const [selectedVariablesInQueue, setSelectedVariablesInQueue] = useState<
    string[]
  >([]);
  const [filterString, setFilterString] = useState<string>("");

  const [variablesMetadata, setVariablesMetadata] = useState<DataFrame | null>(
    null
  );

  const getVariables = useCallback(() => {
    console.log("variablesMetadata", variablesMetadata);
    if (task && limitToSelectedTask) {
      const result = variablesMetadata.loc({
        rows: variablesMetadata["task"]
          .eq(task)
          .or(variablesMetadata["category"].eq("all")),
        columns: ["variable_name"],
      });
      console.log("result", result.getColumnData);
      return result.getColumnData[0] as string[];
    }
    if (category && limitToSelectedCategory) {
      const result = variablesMetadata.loc({
        rows: variablesMetadata["category"]
          .eq(category)
          .or(variablesMetadata["category"].eq("all")),
        columns: ["variable_name"],
      });

      console.log("result", result.getColumnData);
      return result.getColumnData[0] as string[];
    }
    return variablesMetadata?.getColumnData[0] as string[];
  }, [
    category,
    task,
    limitToSelectedTask,
    limitToSelectedCategory,
    variablesMetadata,
  ]);

  function explodeByMonths(df) {
    // Collect new rows in plain JS objects
    const newRows = [];

    // Loop over each row
    for (let i = 0; i < df.shape[0]; i++) {
      // Convert that row to an object for easy manipulation
      const rowObj = dfd.toJSON(df.iloc({ rows: [i] }))[0];
      console.log(rowObj);

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
        console.log("Variables Dictionary Merged:", mergedDF.head());
        setVariablesMetadata(mergedDF);
      })
      .catch((err) => console.error("Error reading variable CSVs", err));
  };

  useEffect(() => {
    loadVariableMetada();
  }, []);

  const saveAsCSV = async () => {
    // Create a new DataFrame that only includes the columns in selectedVariablesInQueue
    console.log(variablesInQueue);
    const variablesDataframe = await dfd.readCSV(variablesDataframeFile);
    const filteredDf = variablesDataframe.loc({
      columns: variablesInQueue,
    });
    filteredDf.print();

    // Trigger a CSV download using the filtered DataFrame
    dfd.toCSV(filteredDf, {
      fileName: "data.csv",
      download: true,
    });
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
    return <></>;
  }

  return (
    <div style={{ display: "flex" }}>
      <div style={{ width: "500px" }}>
        <Listbox label="Variables" onSelect={setSelectedVariables}>
          {getVariables()
            .filter((x) => `${x}`.startsWith(filterString))
            .map((x) => (
              <SelectableVariableItem
                key={x}
                isInQueue={variablesInQueue.includes(`${x}`)}
                description={getVariableDescription(x)}
                name={`${x}`}
                id={`${x}`}
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
          >
            Add Selected
          </button>
          <button
            className="little_button"
            onClick={() =>
              // This does not work need to add existing
              setVariablesInQueue(
                getVariables().filter((x) => `${x}`.startsWith(filterString))
              )
            }
          >
            Add All
          </button>
          <span>
            <label htmlFor="filter">Filter:</label>
            <input
              id="filter"
              onChange={(e) => setFilterString(e.target.value)}
            ></input>
          </span>
          <span>
            <input
              type="radio"
              id="variables-show-all"
              name="variables-filter"
              defaultChecked
              value="all"
              onClick={() => {
                setLimitToSelectedCategory(false);
                setLimitToSelectedTask(false);
              }}
            />
            <label htmlFor="variables-show-all">Show all</label>
          </span>
          <span>
            <input
              type="radio"
              id="variables-filter-to-category"
              name="variables-filter"
              value="category"
              onClick={() => {
                setLimitToSelectedCategory(true);
                setLimitToSelectedTask(false);
              }}
            />
            <label htmlFor="variables-filter-to-category">
              Filter by selected category
            </label>
          </span>
          <span>
            <input
              type="radio"
              id="variables-filter-to-task"
              name="variables-filter"
              value="task"
              onClick={() => {
                setLimitToSelectedTask(true);
                setLimitToSelectedCategory(false);
              }}
            />
            <label htmlFor="variables-filter-to-task">
              Filter by selected task
            </label>
          </span>
        </div>
      </div>
      <div style={{ width: "500px" }}>
        <Listbox
          label="Selected Variables"
          onSelect={setSelectedVariablesInQueue}
        >
          {variablesInQueue.map((x) => (
            <SelectedVariableItem
              key={x}
              text={`${x}`}
              id={`${x}`}
              onRemove={(id) =>
                setVariablesInQueue(variablesInQueue.filter((x) => x != id))
              }
            ></SelectedVariableItem>
          ))}
        </Listbox>
        <div
          id="selected-variables-options"
          style={{ display: "flex", flexDirection: "column", gap: "8px" }}
        >
          <button
            className="little_button"
            onClick={() =>
              setVariablesInQueue(
                variablesInQueue.filter(
                  (x) => !selectedVariablesInQueue.includes(x)
                )
              )
            }
          >
            Remove Selected
          </button>
          <button
            className="little_button"
            onClick={() => setVariablesInQueue([])}
          >
            Remove All
          </button>
          <button
            className="little_button"
            onClick={async () => await saveAsCSV()}
          >
            Save As CSV
          </button>
        </div>
      </div>
    </div>
  );
}
