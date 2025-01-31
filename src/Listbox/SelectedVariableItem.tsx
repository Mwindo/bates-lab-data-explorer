import styles from "./SelectedVariableItem.module.css";

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
      <button
        className={styles.remove_button}
        onClick={(e) => {
          e.stopPropagation();
          onRemove(id);
        }}
      >
        Remove
      </button>
    </div>
  );
}
