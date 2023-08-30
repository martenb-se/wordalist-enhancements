import {useContext} from "preact/compat";
import {useEffect, useState} from "preact/hooks";
import {useSortable} from "@dnd-kit/sortable";
import {JSX} from "preact";
import {
  CustomSelectionStatisticsType,
  OneCustomSelectionStorageType,
  SectionSelectionContextType
} from "../../../../@types/customSelectionTypes";
import {AlertContextType} from "../../../../@types/alertContextTypes";
import {SettingContextType} from "../../../../@types/settingsTypes";
import {FirebaseContextType} from "../../../../@types/firebaseContextTypes";
import {DnDelementStyleType, DnDuseSortableReturnType} from "../../../../@types/dndTypes";
import {AlertContext} from "../../../../hooks/alertContext";
import {SectionSelectionContext} from "../../../../hooks/sectionSelectionContext";
import {SettingsContext} from "../../../../hooks/settingsContext";
import {FirebaseContext} from "../../../../hooks/firebaseContext";
import {LANG_NS_MAIN} from "../../../../constants";
import i18n from "../../../../i18n";
import {
  getExerciseURLFromSelectionContext,
  getPracticeSelectionURLFromSelectionContext
} from "../../../../util/locationGeneration";
import {
  getDefinedCustomSelectionStatistics,
  getTitleFromExerciseID,
  sectionsMapperRestoreElementIDs
} from "../../../../util/customSelectionHandling";
import {isDateToday} from "../../../../util/dateHandling";
import {dndHTMLAttributesTypeScriptCorrection} from "../../../../util/dndUtil";
import {SortableSectionsCollection} from "../SortableSectionsCollection";
import {
  CrossCircledIcon,
  DragHandleDots2Icon,
  DropdownMenuIcon,
  ExternalLinkIcon,
  Pencil2Icon
} from "@radix-ui/react-icons";
import {CSS} from "@dnd-kit/utilities";

/**
 * Displays a sortable custom selection item.
 *
 * @param props - The props for the SortableCustomSelection component.
 * @returns The JSX element representing the sortable custom selection item.
 */
export function SortableCustomSelection(props: {
  id: number,
  customSelectionStorage: OneCustomSelectionStorageType,
  children?: string | JSX.Element | JSX.Element[] | (() => JSX.Element)
}): JSX.Element {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  }: DnDuseSortableReturnType = useSortable({id: props.id});
  const style: DnDelementStyleType = {transform: CSS.Transform.toString(transform), transition,}

  const alertContext: AlertContextType = useContext(AlertContext);
  const sectionSelectionContext: SectionSelectionContextType = useContext(SectionSelectionContext);
  const settingsContext: SettingContextType = useContext(SettingsContext);
  const firebaseContext: FirebaseContextType = useContext(FirebaseContext);
  const [openSections, setOpenSections] = useState(false);
  const [goToPageInitiated, setGoToPageInitiated] = useState(false);

  /**
   * useEffect to navigate to the exercise page when navigation is initiated.
   */
  useEffect(() => {
    if (goToPageInitiated) {
      window.location.href = getExerciseURLFromSelectionContext(sectionSelectionContext);
    }
  }, [sectionSelectionContext.selectedSections]);

  const [lastPracticedString, setLastPracticedString] =
    useState<string>(i18n.t(`${LANG_NS_MAIN}:lastPracticedNever`));
  const [practicesToday, setPracticesToday] = useState<number>(0);
  const [practicesTotal, setPracticesTotal] = useState<number>(0);

  /**
   * useEffect to update statistics based on local and synced data.
   */
  useEffect(() => {
    const curStatistics: CustomSelectionStatisticsType =
      getDefinedCustomSelectionStatistics(props.customSelectionStorage)

    // Sync enabled
    if (settingsContext.options.enableFirebaseSync &&
      props.customSelectionStorage.hash in firebaseContext.syncedStatistics) {
      const syncedStatistics: CustomSelectionStatisticsType =
        firebaseContext.syncedStatistics[props.customSelectionStorage.hash];

      // Update lastPracticed
      if (!curStatistics.lastPracticed && syncedStatistics.lastPracticed ||
        curStatistics.lastPracticed && syncedStatistics.lastPracticed &&
        (new Date(syncedStatistics.lastPracticed)).getDate() > (new Date(curStatistics.lastPracticed)).getDate()) {
        curStatistics.lastPracticed = syncedStatistics.lastPracticed
      }

      // Last practice is today, update practicesToday
      if (syncedStatistics.lastPracticed && isDateToday(new Date(syncedStatistics.lastPracticed))) {
        curStatistics.practicesToday += syncedStatistics.practicesToday;
      }

      // Update practicesTotal
      curStatistics.practicesTotal += syncedStatistics.practicesTotal;

    }

    // Set date text
    if (curStatistics.lastPracticed) {
      setLastPracticedString((new Date(curStatistics.lastPracticed)).toLocaleString());
    }

    // Set statistics
    setPracticesToday(curStatistics.practicesToday);
    setPracticesTotal(curStatistics.practicesTotal);

  }, [
    props.customSelectionStorage.lastPracticed,
    props.customSelectionStorage.practicesToday,
    props.customSelectionStorage.practicesTotal,
    settingsContext.options.enableFirebaseSync,
    firebaseContext.syncedStatistics
  ]);

  /**
   * Handler for the delete custom selection button click.
   */
  function onClickDeleteCustomSelection(): void {
    alertContext.setOptions({
      title: i18n.t(`${LANG_NS_MAIN}:customSelectionsStorageDialogueAlertDeleteCustomExerciseTitle`),
      text:
        i18n.t(`${LANG_NS_MAIN}:customSelectionsStorageDialogueAlertDeleteCustomExerciseText`,
          {exercise: props.customSelectionStorage.name}),
      okButtonText: i18n.t(`${LANG_NS_MAIN}:yes`),
      cancelButtonText: i18n.t(`${LANG_NS_MAIN}:no`),
      okCallback: (): void => {
        sectionSelectionContext.deleteFromCustomSelectionsStorage({hash: props.customSelectionStorage.hash});
      },
      cancelCallback: (): void => {
        return;
      }
    });
    alertContext.setOpen();
  }

  /**
   * Handler for the edit custom selection button click.
   */
  function onClickEditCustomSelection(): void {
    // Allow page change
    setGoToPageInitiated(true);

    sectionSelectionContext.setSelectedExercise({
      exerciseID: props.customSelectionStorage.exerciseID,
      exerciseTitle:
        getTitleFromExerciseID({
          exerciseID: props.customSelectionStorage.exerciseID,
          sectionSelectionContext
        }),
    });

    // Set all sections
    sectionSelectionContext.setMultipleSelectedSections(
      props.customSelectionStorage.sections.map(
        sectionsMapperRestoreElementIDs(props.customSelectionStorage.exerciseID)));
  }

  return (
    <li className="SortableCustomSelection" ref={setNodeRef} style={style}>
      <DragHandleDots2Icon {...listeners} {...dndHTMLAttributesTypeScriptCorrection(attributes)} />
      <span>
        <a
          className="CustomSelectionLink"
          href={getPracticeSelectionURLFromSelectionContext({
            selectedExercise: {exerciseID: props.customSelectionStorage.exerciseID},
            selectedSections: props.customSelectionStorage.sections
          })}>
          <ExternalLinkIcon/> {
          props.customSelectionStorage.name
        } ({
          i18n.t(`${LANG_NS_MAIN}:wordalistSection`, {count: props.customSelectionStorage.sections.length})
        })
        </a>
      </span>
      <div className="CustomSelectionButtonGroup">
        <button
          className="SortableItemButton ButtonDelete"
          onClick={onClickDeleteCustomSelection}>
          <CrossCircledIcon/>
        </button>
        <button
          className={`SortableItemButton ButtonAction${openSections ? " ButtonActive" : ""}`}
          onClick={() => setOpenSections(!openSections)}>
          <DropdownMenuIcon/>
        </button>
        <button
          className="SortableItemButton ButtonAction"
          onClick={onClickEditCustomSelection}>
          <Pencil2Icon/>
        </button>
      </div>
      <div className="FloatBarrier"></div>
      <div className="CustomSelectionStatistics">
        <span className={`SectionPracticesToday${practicesToday > 0 ? "" : " NotPracticedToday"}`}>
          {i18n.t(`${LANG_NS_MAIN}:practicesToday`)}: {`${practicesToday}`}
        </span>
        <span className="SectionPracticesTotal">
          {i18n.t(`${LANG_NS_MAIN}:practicesTotal`)}: {practicesTotal}
        </span>
        <span className="SectionLastPractice">
          {i18n.t(`${LANG_NS_MAIN}:lastPracticed`)}: {lastPracticedString}
        </span>
        <div className="FloatBarrier"></div>
      </div>
      <div className="FloatBarrier"></div>
      {openSections && (
        <SortableSectionsCollection
          sections={props.customSelectionStorage.sections}
          hash={props.customSelectionStorage.hash}
        ></SortableSectionsCollection>
      )}
    </li>
  );
}
