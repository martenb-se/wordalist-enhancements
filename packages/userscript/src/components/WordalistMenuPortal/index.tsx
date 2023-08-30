import { JSX } from "preact";
import { JSXInternal } from "preact/src/jsx";

/**
 * Portal menu item component for the Wordalist menu.
 *
 * @param props - Component properties.
 * @returns JSX element representing the portal menu item.
 */
export const WordalistMenuPortal = (
  props : {
    children: string | JSX.Element | JSX.Element[] | (() => JSX.Element),
    id: string,
    onClickCallback: (event: JSXInternal.TargetedMouseEvent<HTMLAnchorElement>) => void
  }) => {
  return (
    <li id={props.id}>
      <a href="#" onClick={(event: JSX.TargetedMouseEvent<HTMLAnchorElement>) => {
        // Stop the default behavior of the click event.
        event.stopPropagation();
        event.preventDefault();

        // Run callback
        props.onClickCallback(event);
      }}>{props.children}</a>
    </li>
  );
};
