import styles from "./DescriptionPanel.module.css";
export function DescriptionPanel({
  description,
  setModal,
}: {
  description: string;
  setModal: (description: string) => void;
}) {
  return (
    <>
      <div className={styles.description_text}>
        <button
          onClick={() => setModal("")}
          className={styles.close_description_button}
        >
          ✖
        </button>
        {description}{" "}
      </div>
      <div
        className={styles.description_panel}
        onClick={() => setModal("")}
      ></div>
    </>
  );
}
