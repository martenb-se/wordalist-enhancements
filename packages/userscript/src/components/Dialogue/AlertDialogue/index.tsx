import {useContext} from "preact/compat";
import {AlertContextType} from "../../../@types/alertContextTypes";
import {AlertContext} from "../../../hooks/alertContext";
import * as Dialog from '@radix-ui/react-dialog';
import {Cross2Icon} from '@radix-ui/react-icons';
import '../styles.css';
import './styles.css';

/**
 * Represents an alert dialogue component.
 * This component displays a customizable alert dialogue using the Radix UI library.
 */
const AlertDialogue = () => {
  const alertContext: AlertContextType = useContext(AlertContext);

  /**
   * Handles the click event when the cancel button is clicked.
   * Invokes the cancel callback from the alert context and closes the dialogue.
   */
  function clickCancel() {
    alertContext.options.cancelCallback();
    alertContext.setClosed();
  }

  /**
   * Handles the click event when the OK button is clicked.
   * Invokes the OK callback from the alert context and closes the dialogue.
   */
  function clickOK() {
    alertContext.options.okCallback();
    alertContext.setClosed();
  }

  return (
    <Dialog.Root open={alertContext.open}>
      <Dialog.Portal>
        <Dialog.Overlay className="DialogOverlay Alert"/>
        <Dialog.Content className="DialogContent Alert">
          <Dialog.Title className="DialogTitle">{alertContext.options.title}</Dialog.Title>
          <div className="DialogContentScroll">
            <Dialog.Description className="DialogDescription">
              {alertContext.options.text}
            </Dialog.Description>
          </div>
          <div className="ButtonGroup">
            <button className="Button mauve" onClick={clickCancel}>
              {alertContext.options.cancelButtonText}
            </button>
            <button className="Button blue" onClick={clickOK}>
              {alertContext.options.okButtonText}
            </button>
          </div>
          <button className="IconButton" aria-label="Close" onClick={alertContext.setClosed}>
            <Cross2Icon/>
          </button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default AlertDialogue;
