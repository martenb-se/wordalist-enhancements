import {useContext} from "preact/compat";
import {JSXInternal} from "preact/src/jsx";
import {NotificationContextType} from "../../../@types/notificationTypes";
import {SectionSelectionContextType} from "../../../@types/customSelectionTypes";
import {NotificationContext, NotificationType} from "../../../hooks/notificatonContext";
import {SectionSelectionContext} from "../../../hooks/sectionSelectionContext";
import {DIALOGUE_SAVE_CUSTOM_SELECTION_NAME_ID, LANG_NS_MAIN} from "../../../constants";
import i18n from "../../../i18n";
import * as Dialog from '@radix-ui/react-dialog';
import {Cross2Icon} from '@radix-ui/react-icons';
import '../styles.css';

/**
 * Component for displaying a dialogue to save a custom selection.
 *
 * @returns JSX element representing the custom selection save dialogue.
 */
const CustomSelectionSaveDialogue = () => {
  const notificationContext: NotificationContextType = useContext(NotificationContext);
  const sectionSelectionContext: SectionSelectionContextType = useContext(SectionSelectionContext);

  /**
   * Handles the form submission event for closing the dialogue and saving custom selection settings.
   * @param {JSXInternal.TargetedEvent<HTMLFormElement, Event>} event - The form submission event triggering
   * the function.
   */
  const onSubmitCloseDialogueAndSaveSettings = (event: JSXInternal.TargetedEvent<HTMLFormElement, Event>): void => {
    // Stop default events
    event.stopPropagation();
    event.preventDefault();

    // Get the chosen name from the input element
    const chosenNameState: string | undefined =
      (document.getElementById(DIALOGUE_SAVE_CUSTOM_SELECTION_NAME_ID) as HTMLInputElement)?.value;

    // Verification
    if (!chosenNameState || chosenNameState.length === 0) {
      // Display an error notification if the name is empty
      notificationContext.setOptions({
        type: NotificationType.ERROR,
        timeout: 10000,
        title: i18n.t(`${LANG_NS_MAIN}:pageExerciseSaveDialogueErrorGeneralTitle`),
        text: i18n.t(`${LANG_NS_MAIN}:pageExerciseSaveDialogueErrorNoNameText`)
      });

      // Close the dialogue and return
      sectionSelectionContext.setDialogueSaveSelectionsClosed();
      return;
    }

    // Update Exercises Storage
    sectionSelectionContext.setInCustomSelectionsExercisesStorage({
      exerciseID: sectionSelectionContext.selectedExercise.exerciseID,
      exerciseTitle: sectionSelectionContext.selectedExercise.exerciseTitle
    });

    // Update Selections Storage
    sectionSelectionContext.setInCustomSelectionsStorage({
      name: chosenNameState,
      exerciseID: sectionSelectionContext.selectedExercise.exerciseID,
      exerciseTitle: sectionSelectionContext.selectedExercise.exerciseTitle,
      sections: sectionSelectionContext.selectedSections
    });

    // Close the dialogue after saving settings
    sectionSelectionContext.setDialogueSaveSelectionsClosed();
  }

  return (
    <Dialog.Root open={sectionSelectionContext.dialogueSaveSelectionsOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="DialogOverlay"/>
        <Dialog.Content className="DialogContent">
          <Dialog.Title className="DialogTitle">
            {i18n.t(`${LANG_NS_MAIN}:pageExerciseSaveDialogueTitle`)}
          </Dialog.Title>
          <form target="#" onSubmit={onSubmitCloseDialogueAndSaveSettings}>
            <div className="DialogContentScroll">
              <Dialog.Description className="DialogDescription">
                {i18n.t(`${LANG_NS_MAIN}:pageExerciseSaveDialogueGeneralDescription`)}
              </Dialog.Description>
              <fieldset className="Fieldset">
                <label className="Label" htmlFor={DIALOGUE_SAVE_CUSTOM_SELECTION_NAME_ID}>
                  {i18n.t(`${LANG_NS_MAIN}:pageExerciseSaveDialogueName`)}
                </label>
                <input
                  className="Input"
                  id={DIALOGUE_SAVE_CUSTOM_SELECTION_NAME_ID}
                  required={true}
                  value={sectionSelectionContext.selectionStorageMatch?.name}/>
              </fieldset>
            </div>
            <div className="ButtonGroup">
              <button className="Button green" type="submit">
                {i18n.t(`${LANG_NS_MAIN}:save`)}
              </button>
            </div>
            <button
              className="IconButton"
              aria-label="Close"
              onClick={sectionSelectionContext.setDialogueSaveSelectionsClosed}>
              <Cross2Icon/>
            </button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default CustomSelectionSaveDialogue;
