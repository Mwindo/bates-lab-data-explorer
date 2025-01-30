import { MouseEvent, ReactNode } from "react";
import classes from "./ListboxItem.module.css";
import generalClasses from "./General.module.css";

export function ListboxItem({
  id,
  children,
  selected,
  onClick,
  index,
}: {
  id: number;
  index: number;
  children: ReactNode;
  selected: boolean;
  onClick: (event: MouseEvent, id: number) => void;
}) {
  return (
    <div
      data-index={index}
      onClick={(e) => onClick(e, id)}
      className={`${classes.listbox_item} ${generalClasses.not_selectable}`}
      style={{
        padding: "8px",
        cursor: "pointer",
        backgroundColor: selected ? "#2C6085" : "",
      }}
    >
      {children}
    </div>
  );
}

export default ListboxItem;
