import { DataFrame } from "danfojs";
import Listbox from "./Listbox/Listbox";

export function CategoriesPanel({
  tasksDataframe,
  onSelect,
}: {
  tasksDataframe: DataFrame;
  onSelect: (category: string) => void;
}) {
  return (
    <div style={{ width: "200px" }}>
      <Listbox
        label={"Categories"}
        onSelect={(stuff) => onSelect(stuff[0])}
        allowMultiple={false}
        autoSelect={true}
      >
        {["executive_function", "woah"].map((x) => (
          <div key={x} id={x}>
            {x}
          </div>
        ))}
      </Listbox>
    </div>
  );
}
