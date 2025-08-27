import { DataFrame } from "danfojs";
import { TasksPanel } from "./TasksPanel";
import { VariablesPanel } from "./VariablesPanel";
import { CategoriesPanel } from "./CategoriesPanel";
import { useEffect, useState } from "react";
import * as dfd from "danfojs/dist/danfojs-browser/src";
import { LoadingPanel } from "./LoadingPanel";

const tasksFileURL = `${
  import.meta.env.BASE_URL
}data_dictionary/task_dictionary.csv`;

export function DataPanel({
  variablesDataframeFile,
  setModal,
}: {
  variablesDataframeFile: File;
  setModal: (description: string) => void;
}) {
  const [tasksData, setTasksData] = useState<DataFrame | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);

  useEffect(() => {
    dfd.readCSV(tasksFileURL).then((x) => {
      setTasksData(x);
    });
  }, []);

  if (!tasksData) {
    return <LoadingPanel />;
  }

  return (
    <div style={{ display: "flex", gap: "1rem", overflow: "scroll" }}>
      <div>
        <CategoriesPanel
          categories={[...new Set(tasksData.values.map((x) => x[1]))]}
          onSelect={setSelectedCategory}
        />
      </div>
      <div>
        <TasksPanel
          tasksDataframe={tasksData}
          onSelect={setSelectedTasks}
          category={selectedCategory}
          setModal={setModal}
        />
      </div>
      {/* Ensure this flex item can shrink */}
      <div style={{ flex: "1 1 0", minWidth: 0 }}>
        <VariablesPanel
          variablesDataframeFile={variablesDataframeFile}
          tasksDataframe={tasksData}
          category={selectedCategory}
          tasks={selectedTasks}
          lockedVariableNames={["tcid"]}
          setModal={setModal}
        />
      </div>
    </div>
  );
}
