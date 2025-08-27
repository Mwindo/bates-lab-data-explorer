import Listbox from "./Listbox/Listbox";
import dataPanelStyles from "./DataPanel.module.css";

export function CategoriesPanel({
  categories,
  onSelect,
}: {
  categories: string[];
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
        {categories.map((x) => (
          <div key={x} id={x}>
            {x}
          </div>
        ))}
      </Listbox>
    </div>
  );
}
