import styles from "./SelectedVariableItem.module.css";

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
    <div id={id}>
      {text}
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
