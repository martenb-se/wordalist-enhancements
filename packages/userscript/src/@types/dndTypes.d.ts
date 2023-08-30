import {DraggableAttributes} from "@dnd-kit/core";
import {SyntheticListenerMap} from "@dnd-kit/core/dist/hooks/utilities";
import {Transform} from "@dnd-kit/utilities";

/**
 * Represents the attributes and event listeners for a draggable element in a sortable context.
 */
export type DnDuseSortableReturnType = {
  /** The attributes that should be applied to the draggable element. */
  attributes: DraggableAttributes,
  /** Synthetic event listeners for the draggable element. */
  listeners?: SyntheticListenerMap,
  /** Function to set the DOM node reference of the draggable element. */
  setNodeRef: (node: HTMLElement | null) => void,
  /** Transformation applied to the draggable element during movement. */
  transform: Transform | null,
  /** CSS transition property for smooth movement animations. */
  transition?: string
}

export type DnDelementStyleType = {
  /** CSS transform property for element transformation. */
  transform?: string,
  /** CSS transition property for smooth animations during transitions. */
  transition?: string
}
