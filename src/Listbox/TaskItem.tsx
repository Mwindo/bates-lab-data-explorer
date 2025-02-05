import listboxStyles from "./Listbox.module.css";

export function TaskItem({
  name,
  description,
  id,
  setModal,
}: {
  name: string;
  description: string;
  id: string;
  setModal: (description: string) => void;
}) {
  return (
    <div id={id}>
      <button
        onClick={(e) => {
          e.preventDefault();
          setModal(description);
        }}
        className={listboxStyles.info_button}
        title={description}
      >
        ?
      </button>
      {name}
    </div>
  );
}
