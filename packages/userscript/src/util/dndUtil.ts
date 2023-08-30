
import {JSX} from "preact";
import {HTMLAttributes, StateUpdater} from "preact/compat";
import {Active, DragEndEvent, DraggableAttributes, Over} from "@dnd-kit/core";
import {arrayMove} from "@dnd-kit/sortable";

/**
 * Corrects TypeScript types for HTML attributes when using @dnd-kit/core's DraggableAttributes attributes.
 *
 * @param attributes - The draggable attributes.
 * @returns HTML attributes with corrected TypeScript types.
 *
 * @remarks
 * This function is used to ensure that TypeScript types are correctly matched for HTML attributes that are related
 * to @dnd-kit/core's DraggableAttributes. The main focus is on the 'role' attribute, which requires proper typing for
 * proper compatibility with JSX.
 *
 * In particular, the 'attributes.role' parameter is a normal string, but in JSX, the 'role' attribute
 * is associated with a set of predefined strings, such as "alert", "alertdialog", "application", "article", "banner",
 * "button", "cell", "checkbox", "columnheader", "combobox", "complementary", and so on. The purpose of this function
 * is to ensure that the 'role' attribute provided in the 'attributes' parameter is correctly typed as a 'JSX.AriaRole'.
 */
export function dndHTMLAttributesTypeScriptCorrection(
  attributes: DraggableAttributes
): HTMLAttributes<HTMLButtonElement> {
  /**
   * Create and return HTML attributes with corrected types for drag-and-drop functionality.
   */
  return {
    ...attributes,
    role: attributes.role as JSX.AriaRole,
  };
}

/**
 * Returns a function to handle the drag end event for reordering items.
 * The returned function updates the order of items in a list based on the drag end event.
 *
 * @template T - The type of items being reordered that must include the "id" property.
 * @param setItems - The state updater function for setting the updated items.
 * @returns The function that handles the drag end event.
 */
export function getHandleDragEndFunction<T extends { id: number }>(setItems: StateUpdater<T[]>):
  (event: DragEndEvent) => void {
  /**
   * Handles the drag end event to reorder items based on drag-and-drop actions.
   *
   * @param event - The DragEndEvent object containing information about the drag-and-drop action.
   */
  return (event: DragEndEvent): void => {
    const {active, over}: { active: Active, over: Over | null } = event;

    if (active && over && active.id !== over.id) {
      const activeIdNumber: number = typeof active.id === "string" ? parseInt(active.id) : active.id;
      const overIdNumber: number = typeof over.id === "string" ? parseInt(over.id) : over.id;

      setItems((items: T[]) => {
        const oldIndex: number = items.map(({id}: { id: number }) => id).indexOf(activeIdNumber);
        const newIndex: number = items.map(({id}: { id: number }) => id).indexOf(overIdNumber);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }
}
