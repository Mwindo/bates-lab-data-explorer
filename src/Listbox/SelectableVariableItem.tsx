import styles from "./SelectableVariableItem.module.css";
import listboxStyles from "./Listbox.module.css";

export function SelectableVariableItem({
  isInQueue,
  name,
  description,
  id,
  onAdd,
  setModal,
}: {
  isInQueue: boolean;
  name: string;
  description: string;
  id: string;
  onAdd: (id: string) => void;
  setModal: (description: string) => void;
}) {
  return (
    <div id={id}>
      <button
        onClick={(e) => {
          e.preventDefault();
          setModal(`${name}: ${description || "No description"}`);
        }}
        className={listboxStyles.info_button}
        title={description}
      >
        ?
      </button>
      {name}
      <button
        className={
          isInQueue ? `${styles.added_button}` : `${styles.add_button}`
        }
        disabled={isInQueue}
        onClick={() => onAdd(id)}
      >
        {isInQueue ? "Added" : "Add"}
      </button>
    </div>
  );
}
