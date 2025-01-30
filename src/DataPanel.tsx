import { DataFrame } from "danfojs";
import { TasksPanel } from "./TasksPanel";
import { VariablesPanel } from "./VariablesPanel";
import { CategoriesPanel } from "./CategoriesPanel";
import { useEffect, useState } from "react";
import * as dfd from "danfojs/dist/danfojs-browser/src";

const tasksFileURL = `${
  import.meta.env.BASE_URL
}data_dictionary/task_dictionary.csv`;

export function DataPanel({
  variablesDataframeFile,
}: {
  variablesDataframeFile: File;
}) {
  const [tasksData, setTasksData] = useState<DataFrame | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedTask, setSelectedTask] = useState<string>("");

  useEffect(() => {
    dfd.readCSV(tasksFileURL).then((x) => {
      console.log("Task Dictionary:", x.head());
      setTasksData(x);
    });
  }, []);

  if (!tasksData) {
    return <>Loading</>;
  }

  return (
    <div style={{ display: "flex" }}>
      <CategoriesPanel
        tasksDataframe={tasksData}
        onSelect={setSelectedCategory}
      ></CategoriesPanel>
      <TasksPanel
        tasksDataframe={tasksData}
        onSelect={setSelectedTask}
        category={selectedCategory}
      ></TasksPanel>
      <VariablesPanel
        variablesDataframeFile={variablesDataframeFile}
        tasksDataframe={tasksData}
        category={selectedCategory}
        task={selectedTask}
      ></VariablesPanel>
    </div>
  );
}
