import styles from "./SelectedVariableItem.module.css";
import generalStyles from "./General.module.css";

export function SelectedVariableItem({
  text,
  id,
  onRemove,
}: {
  text: string;
  id: string;
  onRemove: (id: string) => void;
}) {
  return (
    <div id={id}>
      {text}
      <button className={styles.remove_button} onClick={() => onRemove(id)}>
        Remove
      </button>
    </div>
  );
}
