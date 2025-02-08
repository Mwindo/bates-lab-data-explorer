import styles from "./SelectedVariableItem.module.css";
import listboxStyles from "./Listbox.module.css";

export function SelectedVariableItem({
  text,
  id,
  onRemove,
  locked = false,
}: {
  text: string;
  id: string;
  onRemove: (id: string) => void;
  locked?: boolean;
}) {
  return (
    <div id={id} className={listboxStyles.listbox_text_container}>
      <div className={listboxStyles.listbox_text}>{text}</div>
      <button
        disabled={locked}
        className={styles.remove_button}
        onClick={(e) => {
          e.stopPropagation();
          onRemove(id);
        }}
      >
        {locked ? "Required" : "Remove"}
      </button>
    </div>
  );
}
