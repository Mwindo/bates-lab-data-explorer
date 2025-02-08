import { DataFrame } from "danfojs";
import Listbox from "./Listbox/Listbox";
import dataPanelStyles from "./DataPanel.module.css";

export function CategoriesPanel({
  tasksDataframe,
  onSelect,
}: {
  tasksDataframe: DataFrame;
  onSelect: (category: string) => void;
}) {
  return (
    <div className={dataPanelStyles.categories_panel}>
      <Listbox
        label={"Categories"}
        onSelect={(stuff) => onSelect(stuff[0])}
        allowMultiple={false}
        autoSelect={true}
      >
        {["executive_function", "testing"].map((x) => (
          <div key={x} id={x}>
            {x}
          </div>
        ))}
      </Listbox>
    </div>
  );
}
