import {useContext} from "preact/compat";
import {useRef, useState} from "preact/hooks";
import {JSX} from "preact";
import {
  CustomSelectionsExercisesStorageSetterType,
  CustomSelectionsExportType,
  CustomSelectionsOneExerciseStorageType,
  CustomSelectionsOneExportType,
  CustomSelectionsStorageSetterType,
  CustomSelectionsStorageType,
  MultipleCustomSelectionsExercisesStorageSetterType,
  MultipleCustomSelectionsStorageSetterType,
  OneCustomSelectionStorageType,
  SectionSelectionContextType
} from "../../../@types/customSelectionTypes";
import {NotificationContextType} from "../../../@types/notificationTypes";
import {NotificationContext, NotificationType} from "../../../hooks/notificatonContext";
import {SectionSelectionContext} from "../../../hooks/sectionSelectionContext";
import {LANG_NS_MAIN} from "../../../constants";
import i18n from "../../../i18n";
import {
  getCustomSelectionExerciseFromID,
  getCustomSelectionFromHash,
  getTitleFromExerciseID,
  propFilterExerciseID,
  sectionsMapperRestoreElementIDs
} from "../../../util/customSelectionHandling";
import {getCustomSelectionHashFromSelectionContext} from "../../../util/hashHandling";
import {SortableExercisesCollection} from "./SortableExercisesCollection";
import * as Dialog from '@radix-ui/react-dialog';
import {Cross2Icon} from '@radix-ui/react-icons';
import '../styles.css';
import './styles.css';

/**
 * Component for managing custom selections storage (WLE Selections) dialogue.
 *
 * @returns JSX element representing the custom selections storage (WLE Selections) dialogue.
 */
const CustomSelectionsStorageDialogue = () => {
  const notificationContext: NotificationContextType = useContext(NotificationContext);
  const sectionSelectionContext: SectionSelectionContextType = useContext(SectionSelectionContext);

  const [currentView, setCurrentView] = useState<string | null>(null)
  const textareaImportElement =
    useRef<HTMLTextAreaElement>(document.createElement("textarea"))

  /**
   * Converts custom selections data to a JSON string representation able to be exported.
   * @param {Object} options - The options object containing custom selections storage.
   * @param {CustomSelectionsStorageType} options.customSelectionsStorage - The custom selections storage to convert.
   * @returns {string} A JSON string representation of the converted custom selections' data.
   */
  const convertCustomSelectionsToJSONString = (
    {
      customSelectionsStorage
    }: {
      customSelectionsStorage: CustomSelectionsStorageType
    }): string => {
    return JSON.stringify(
      customSelectionsStorage.map(
        ({name, exerciseID, sections}: OneCustomSelectionStorageType): CustomSelectionsOneExportType => {
          return {
            name,
            exerciseID,
            exerciseTitle: getTitleFromExerciseID({exerciseID, sectionSelectionContext}),
            sections
          };
        }
      )
    );
  };

  /**
   * Closes the dialogue for custom selections' storage.
   * This function sets the current view to null and closes the custom selections storage dialogue.
   */
  function closeDialogue(): void {
    setCurrentView(null);
    sectionSelectionContext.setDialogueCustomSelectionsStorageClosed();
  }

  /**
   * Handles the click event on the custom selections JSON textarea HTML element, copying the JSON content to the
   * clipboard.
   * @param {Event} event - The click event on the textarea HTML element.
   */
  function onClickCustomSelectionsJSONTextarea(event: JSX.TargetedMouseEvent<HTMLTextAreaElement>): void {
    // Attempt to copy the JSON content to the clipboard
    navigator.clipboard.writeText((event.target as HTMLTextAreaElement)?.value).then(() => {
      // Display a success notification when content is successfully copied
      notificationContext.setOptions({
        type: NotificationType.NOTIFICATION,
        title: i18n.t(`${LANG_NS_MAIN}:customSelectionsStorageDialogueExportExercises`),
        text: i18n.t(`${LANG_NS_MAIN}:customSelectionsStorageDialogueExportNotificationCopyToClipboard`),
        timeout: 1000
      });
    }).catch(() => {
      // Display a warning notification if copying to clipboard fails
      notificationContext.setOptions({
        type: NotificationType.WARNING,
        title: i18n.t(`${LANG_NS_MAIN}:customSelectionsStorageDialogueExportExercises`),
        text: i18n.t(`${LANG_NS_MAIN}:customSelectionsStorageDialogueExportErrorCopyToClipboard`)
      });
    });
  }

  /**
   * Handles the click event for the "Save and Import" button.
   * Parses and imports custom selections from the provided JSON value.
   */
  function onClickSaveAndImport(): void {
    // Get the JSON value from the import textarea
    const importValue: string | undefined = textareaImportElement.current?.value;

    if (importValue && importValue.length > 0) {
      try {
        // Parse the imported JSON value into custom selections
        const customSelectionsImport: CustomSelectionsExportType = JSON.parse(importValue);

        let skippedImports = 0;
        let imports = 0;
        const exercisesToAdd: CustomSelectionsExercisesStorageSetterType[] = [];
        const customSelectionsToAdd: CustomSelectionsStorageSetterType[] = [];

        // Function to find exercises and sections to add
        const findExercisesToAdd = (
          {
            name,
            sections,
            exerciseID,
            exerciseTitle
          }: CustomSelectionsOneExportType): void => {
          // Check if the custom selection already exists
          const existingCustomSelection: OneCustomSelectionStorageType | null =
            getCustomSelectionFromHash({
              hash: getCustomSelectionHashFromSelectionContext({
                selectedExercise: {exerciseID},
                selectedSections: sections
              }),
              sectionSelectionContext
            });

          // Check if the exercise already exists
          const existingCustomSelectionExercise: CustomSelectionsOneExerciseStorageType | null =
            getCustomSelectionExerciseFromID({exerciseID, sectionSelectionContext});

          // Add exercise if it doesn't exist
          if (!existingCustomSelectionExercise &&
            exercisesToAdd.filter(propFilterExerciseID(exerciseID)).length === 0) {
            exercisesToAdd.push({exerciseID, exerciseTitle});
          }

          // Add section if it doesn't exist
          if (!existingCustomSelection) {
            customSelectionsToAdd.push({
              exerciseID,
              name,
              exerciseTitle,
              sections: sections.map(sectionsMapperRestoreElementIDs(exerciseID))
            });

            imports++;
          } else {
            skippedImports++;
          }
        };

        // Iterate through imported custom selections
        customSelectionsImport.forEach(findExercisesToAdd);

        // Update exercises and custom selections storage
        sectionSelectionContext.setMultipleInCustomSelectionsExercisesStorage({
          customSelectionsExercisesStorageSetters: exercisesToAdd
        } as MultipleCustomSelectionsExercisesStorageSetterType);

        sectionSelectionContext.setMultipleInCustomSelectionsStorage({
          customSelectionsStorageSetters: customSelectionsToAdd
        } as MultipleCustomSelectionsStorageSetterType);

        // Display a success notification with import information
        notificationContext.setOptions({
          type: NotificationType.NOTIFICATION,
          title:
            i18n.t(`${LANG_NS_MAIN}:customSelectionsStorageDialogueImportExercises`),
          text:
            i18n.t(
              `${LANG_NS_MAIN}:customSelectionsStorageDialogueImportNotificationImported`, {count: imports}) +
            i18n.t(
              `${LANG_NS_MAIN}:customSelectionsStorageDialogueImportNotificationAndSkipped`, {count: skippedImports})
        });
      } catch {
        // Display an error notification if import text format is incorrect
        notificationContext.setOptions({
          type: NotificationType.ERROR,
          title: i18n.t(`${LANG_NS_MAIN}:customSelectionsStorageDialogueImportExercises`),
          text: i18n.t(`${LANG_NS_MAIN}:customSelectionsStorageDialogueImportErrorFormat`)
        });
      }
    }
  }

  /**
   * Creates a view toggler function that switches between "import" and "export" views.
   *
   * @param view - The view to toggle between ("import" or "export").
   * @returns A function that toggles the current view.
   */
  function viewToggler(view: "import" | "export"): () => void {
    /**
     * Toggles the current view between "import" and "export" based on the given view parameter.
     */
    return (): void => {
      if (currentView !== view) {
        setCurrentView(view);
      } else {
        setCurrentView(null);
      }
    };
  }

  return (
    <Dialog.Root open={sectionSelectionContext.dialogueCustomSelectionsStorageOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="DialogOverlay"/>
        <Dialog.Content className="DialogCustomSelectionsStorage DialogContent">
          <Dialog.Title className="DialogTitle">
            {!currentView && i18n.t(`${LANG_NS_MAIN}:customSelectionsStorageDialogueTitle`)}
            {currentView === "import" && i18n.t(`${LANG_NS_MAIN}:customSelectionsStorageDialogueImportExercises`)}
            {currentView === "export" && i18n.t(`${LANG_NS_MAIN}:customSelectionsStorageDialogueExportExercises`)}
          </Dialog.Title>
          {!currentView && (
            <div className="DialogContentScroll">
              <Dialog.Description className="DialogDescription">
                {i18n.t(`${LANG_NS_MAIN}:customSelectionsStorageDialogueDescription`)}
              </Dialog.Description>
              <SortableExercisesCollection/>
            </div>
          )}
          {currentView === "export" && (
            <div className="DialogContentScroll">
              <Dialog.Description className="DialogDescription">
                {i18n.t(`${LANG_NS_MAIN}:customSelectionsStorageDialogueExportDescription`)}
              </Dialog.Description>
              <textarea
                className="Textarea"
                readOnly={true}
                value={convertCustomSelectionsToJSONString(sectionSelectionContext)}
                onClick={onClickCustomSelectionsJSONTextarea}/>
            </div>
          )}
          {currentView === "import" && (
            <div className="DialogContentScroll">
              <Dialog.Description className="DialogDescription">
                {i18n.t(`${LANG_NS_MAIN}:customSelectionsStorageDialogueImportDescription`)}
              </Dialog.Description>
              <textarea
                className="Textarea"
                ref={textareaImportElement}/>
            </div>
          )}
          <div className="ButtonGroup">
            {currentView === "import" && (
              <button
                tabIndex={-1}
                className="Button green"
                onClick={onClickSaveAndImport}>
                {i18n.t(`${LANG_NS_MAIN}:customSelectionsStorageDialogueImportSaveButton`, {count: 0})}
              </button>
            )}
            <button
              tabIndex={-1}
              className={`Button ${currentView === "import" ? "blue" : "mauve"}`}
              onClick={viewToggler("import")}>
              {i18n.t(`${LANG_NS_MAIN}:customSelectionsStorageDialogueImportExercises`)}
            </button>
            <button
              tabIndex={-1}
              className={`Button ${currentView === "export" ? "blue" : "mauve"}`}
              onClick={viewToggler("export")}>
              {i18n.t(`${LANG_NS_MAIN}:customSelectionsStorageDialogueExportExercises`)}
            </button>
          </div>
          <button className="IconButton" aria-label="Close" onClick={closeDialogue}>
            <Cross2Icon/>
          </button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default CustomSelectionsStorageDialogue;
