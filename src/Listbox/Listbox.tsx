import React, { ReactElement, ReactNode, useEffect, useState } from "react";
import ListboxItem from "./ListboxItem";
import classes from "./Listbox.module.css";

export function Listbox({
  children,
  label,
  onSelect,
  allowMultiple = true,
  autoSelect = false,
  selected,
}: {
  children: ReactNode;
  label: string;
  onSelect: (stuff: any) => void;
  allowMultiple?: boolean;
  autoSelect?: boolean;
  selected?: string[];
}) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [lastClickedIndex, setLastClickedIndex] = useState<number | null>(null);

  // Convert children to a stable array so we can find indices for shift-click
  const childArray = React.Children.toArray(children) as ReactElement[];

  const setSelection = (selection: any) => {
    setSelectedIds(selection);
    onSelect(selection);
  };

  useEffect(() => {
    if (autoSelect && childArray.length) {
      setSelection([childArray[0].props.id]);
    }
  }, []);

  useEffect(() => {
    if (!childArray.length) {
      setSelection([]);
      onSelect([]);
    } else if (selected) {
      setSelectedIds(selected);
    }
  }, [children, selected]);

  const handleItemClick = (
    event: MouseEvent,
    clickedId: string,
    clickedIndex: number
  ) => {
    const { shiftKey, ctrlKey, metaKey } = event;

    if (allowMultiple && shiftKey && lastClickedIndex !== null) {
      // SHIFT-click: select range
      const start = Math.min(lastClickedIndex, clickedIndex);
      const end = Math.max(lastClickedIndex, clickedIndex);

      // Get all ids in that range
      const rangeIds = childArray
        .slice(start, end + 1)
        .map((child) => child.props.id);

      setSelection(rangeIds);
    } else if (allowMultiple && (ctrlKey || metaKey)) {
      // CTRL/CMD-click: toggle the clicked item
      setSelection((prev) =>
        prev.includes(clickedId)
          ? prev.filter((id) => id !== clickedId)
          : [...prev, clickedId]
      );
    } else {
      // Normal click: select only this one
      setSelection([clickedId]);
    }

    // Update the "last clicked" index
    setLastClickedIndex(clickedIndex);
  };

  return (
    <>
      <div style={{ display: "block" }}>
        <h2 style={{ textWrap: "nowrap" }}>
          {label + ` (${childArray.length})`}
        </h2>
        <div className={classes.listbox}>
          {childArray.map((child, index) => {
            const childId = child.props.id;
            const isSelected = selectedIds.includes(childId);

            // Wrap each child in a ListboxItem with the correct selection props
            return (
              <ListboxItem
                index={index}
                key={childId}
                id={childId}
                selected={isSelected}
                onClick={(e) => handleItemClick(e, childId, index)}
              >
                {child}
              </ListboxItem>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default Listbox;
