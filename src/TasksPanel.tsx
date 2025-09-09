import { useCallback, useState } from "react";
import Listbox from "./Listbox/Listbox";
import { DataFrame } from "danfojs";
import { TaskItem } from "./Listbox/TaskItem";
import dataPanelStyles from "./DataPanel.module.css";

export function TasksPanel({
  tasksDataframe,
  onSelect,
  category,
  setModal,
}: {
  tasksDataframe: DataFrame;
  onSelect: (tasks: string[]) => void;
  category: string;
  setModal: (description: string) => void;
}) {
  const [limitToSelectedCategory, setLimitToSelectedCategory] =
    useState<boolean>(false);

  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);

  const getTasks = useCallback(() => {
    if (category && limitToSelectedCategory) {
      const result = tasksDataframe.loc({
        rows: tasksDataframe["category"].eq(category),
      });
      return result.values as string[];
    }
    return tasksDataframe.values as unknown as string[];
  }, [category, tasksDataframe, limitToSelectedCategory]);

  const selectTasks = (tasks: string[]) => {
    onSelect(tasks);
    setSelectedTasks(tasks);
  };

  return (
    <div className={dataPanelStyles.tasks_panel}>
      <Listbox
        label={"Tasks"}
        onSelect={(tasks) => {
          selectTasks(tasks);
        }}
        autoSelect={true}
        selected={selectedTasks}
      >
        {getTasks().map((x) => (
          <TaskItem
            key={x[0]}
            id={x[0]}
            name={x[0]}
            description={x[2]}
            setModal={setModal}
          />
        ))}
      </Listbox>
      <div
        id="tasks-options"
        style={{ display: "flex", flexDirection: "column", gap: "8px" }}
      >
        <button
          className="little_button"
          onClick={() => selectTasks(tasksDataframe.values.map((x) => x[0]))}
        >
          Select All
        </button>
        <span>
          <input
            type="radio"
            id="show-all"
            name="categories-filter"
            defaultChecked
            value="all"
            onClick={() => setLimitToSelectedCategory(false)}
          />
          <label htmlFor="show-all">Show all</label>
        </span>
        <span>
          <input
            type="radio"
            id="filter-to-category"
            name="categories-filter"
            value="category"
            onClick={() => setLimitToSelectedCategory(true)}
          />
          <label htmlFor="filter-to-category">
            Filter by selected category
          </label>
        </span>
      </div>
    </div>
  );
}
