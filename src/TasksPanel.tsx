import { useCallback, useState } from "react";
import Listbox from "./Listbox/Listbox";
import { DataFrame } from "danfojs";
import { TaskItem } from "./Listbox/TaskItem";

export function TasksPanel({
  tasksDataframe,
  onSelect,
  category,
  setModal,
}: {
  tasksDataframe: DataFrame;
  onSelect: (task: string) => void;
  category: string;
  setModal: (description: string) => void;
}) {
  const [limitToSelectedCategory, setLimitToSelectedCategory] =
    useState<boolean>(false);

  const getTasks = useCallback(() => {
    if (category && limitToSelectedCategory) {
      const result = tasksDataframe.loc({
        rows: tasksDataframe["category"].eq(category),
      });
      return result.values as string[];
    }
    return tasksDataframe.values as unknown as string[];
  }, [category, tasksDataframe, limitToSelectedCategory]);

  return (
    <div style={{ width: "220px" }}>
      <Listbox
        label={"Tasks"}
        onSelect={(stuff) => onSelect(stuff[0])}
        allowMultiple={false}
        autoSelect={true}
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
