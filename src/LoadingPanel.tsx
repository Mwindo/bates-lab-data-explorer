import styles from "./LoadingPanel.module.css";

export function LoadingPanel({ message }: { message?: string }) {
  return (
    <div className={styles.loading_backdrop}>
      <div className={styles.loading_message}>
        <div>{message && message}</div>
        <div className={styles.lds_ring}>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </div>
  );
}
