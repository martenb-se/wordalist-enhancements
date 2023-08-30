import {useContext} from "preact/compat";
import {useSortable} from "@dnd-kit/sortable";
import {JSX} from "preact";
import {
  OneCustomSelectionSectionType,
  SectionSelectionContextType
} from "../../../../@types/customSelectionTypes";
import {AlertContextType} from "../../../../@types/alertContextTypes";
import {DnDelementStyleType, DnDuseSortableReturnType} from "../../../../@types/dndTypes";
import {AlertContext} from "../../../../hooks/alertContext";
import {SectionSelectionContext} from "../../../../hooks/sectionSelectionContext";
import {LANG_NS_MAIN} from "../../../../constants";
import i18n from "../../../../i18n";
import {dndHTMLAttributesTypeScriptCorrection} from "../../../../util/dndUtil";
import {CrossCircledIcon, DragHandleDots2Icon} from "@radix-ui/react-icons";
import {CSS} from "@dnd-kit/utilities";

/**
 * Displays a sortable section item.
 *
 * @param props - The props for the SortableSection component.
 * @returns The JSX element representing the sortable section item.
 */
export function SortableSection(props: {
  id: number,
  hash: string,
  section: OneCustomSelectionSectionType,
  children?: string | JSX.Element | JSX.Element[] | (() => JSX.Element)
}): JSX.Element {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  }: DnDuseSortableReturnType = useSortable({id: props.id});

  const style: DnDelementStyleType = {transform: CSS.Transform.toString(transform), transition,};

  const alertContext: AlertContextType = useContext(AlertContext);
  const sectionSelectionContext: SectionSelectionContextType = useContext(SectionSelectionContext);

  /**
   * Handler for the delete section button click.
   */
  function onClickDeleteSection(): void {
    alertContext.setOptions({
      title: i18n.t(`${LANG_NS_MAIN}:customSelectionsStorageDialogueAlertDeleteSectionTitle`),
      text: i18n.t(
        `${LANG_NS_MAIN}:customSelectionsStorageDialogueAlertDeleteSectionText`,
        {section: props.section.sectionTitle}),
      okButtonText: i18n.t(`${LANG_NS_MAIN}:yes`),
      cancelButtonText: i18n.t(`${LANG_NS_MAIN}:no`),
      okCallback: () => {
        sectionSelectionContext.deleteFromCustomSelectionSectionsStorage({
          hash: props.hash,
          sectionID: props.section.sectionID
        });
      },
      cancelCallback: () => {
        return;
      }
    });

    alertContext.setOpen();
  }

  return (
    <li className="SortableSection" ref={setNodeRef} style={style}>
      <DragHandleDots2Icon {...listeners} {...dndHTMLAttributesTypeScriptCorrection(attributes)} />
      <span>{props.section.sectionTitle}</span>
      <button
        className="SortableItemButton ButtonDelete"
        onClick={onClickDeleteSection}>
        <CrossCircledIcon/>
      </button>
      <div className="FloatBarrier"></div>
    </li>
  );
}
