import {useContext} from "preact/compat";
import {useSortable} from "@dnd-kit/sortable";
import {JSX} from "preact";
import {
  CustomSelectionsOneExerciseStorageType,
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
 * Displays a sortable exercise item.
 *
 * @param props - The props for the SortableExercise component.
 * @returns The JSX element representing the sortable exercise item.
 */
export function SortableExercise(props: {
  id: number,
  customSelectionsExercises: CustomSelectionsOneExerciseStorageType,
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
   * Handles the click event for deleting the exercise.
   */
  function onClickDeleteExercise() {
    alertContext.setOptions({
      title: i18n.t(`${LANG_NS_MAIN}:customSelectionsStorageDialogueAlertDeleteExerciseTitle`),
      text: i18n.t(
        `${LANG_NS_MAIN}:customSelectionsStorageDialogueAlertDeleteExerciseText`,
        {exercise: props.customSelectionsExercises.exerciseTitle}),
      okButtonText: i18n.t(`${LANG_NS_MAIN}:yes`),
      cancelButtonText: i18n.t(`${LANG_NS_MAIN}:no`),
      okCallback: () => {
        sectionSelectionContext.deleteFromCustomSelectionsExercisesStorage({
          exerciseID: props.customSelectionsExercises.exerciseID
        });
      },
      cancelCallback: () => {
        return;
      }
    });
    alertContext.setOpen();
  }

  return (
    <li className="SortableExercise" ref={setNodeRef} style={style}>
      <DragHandleDots2Icon {...listeners} {...dndHTMLAttributesTypeScriptCorrection(attributes)} />
      <span>{props.customSelectionsExercises.exerciseTitle}</span>
      <button
        className="SortableItemButton ButtonDelete"
        onClick={onClickDeleteExercise}>
        <CrossCircledIcon/>
      </button>
      <div className="FloatBarrier"></div>
      <div>{props.children}</div>
    </li>
  );
}
