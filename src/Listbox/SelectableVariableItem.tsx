import styles from "./SelectableVariableItem.module.css";
import generalStyles from "./General.module.css";

export function SelectableVariableItem({
  isInQueue,
  name,
  description,
  id,
  onAdd,
}: {
  isInQueue: boolean;
  name: string;
  description: string;
  id: string;
  onAdd: (id: string) => void;
}) {
  return (
    <div id={id}>
      <button
        onClick={(e) => {
          e.preventDefault();
          window.alert(description);
        }}
        className={styles.info_button}
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
