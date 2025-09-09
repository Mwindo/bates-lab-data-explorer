import React, { ReactNode } from "react";
import styles from "./Header.module.css";

// This is a hack, but easy enough to update for such a small project
const LAST_UPDATED =
  "Last Updated: 2025 September 8 10:42 P.M. ET.\n\n\n Most recent updates:\n";

const UPDATES = ["Added questionnaires"];

const getFormattedUpdates = () => {
  const text = `${LAST_UPDATED}\n${UPDATES.map((update) => `- ${update}`).join(
    "\n"
  )}`;
  return text.split("\n").map((line, index) => (
    <React.Fragment key={index}>
      {line}
      <br />
    </React.Fragment>
  ));
};

export const Header = ({
  setModal,
}: {
  setModal: (x: string | ReactNode) => void;
}) => {
  return (
    <div style={{ justifyItems: "center" }}>
      <h1>Bates Lab Data Explorer</h1>
      <button
        className={styles.last_updated}
        onClick={() => setModal(getFormattedUpdates())}
      >
        Updates
      </button>
    </div>
  );
};
