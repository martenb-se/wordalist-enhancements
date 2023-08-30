import {useContext} from "preact/compat";
import { SectionSelectionContextType } from '../../../@types/customSelectionTypes';
import {SectionSelectionContext} from "../../../hooks/sectionSelectionContext";
import {LANG_NS_MAIN} from "../../../constants";
import i18n from "../../../i18n";
import {getExerciseIdFromLocation} from "../../../util/locationParsing";
import {getPracticeSelectionURLFromSelectionContext} from "../../../util/locationGeneration";
import * as Toolbar from '@radix-ui/react-toolbar';
import {
  CrossCircledIcon, BookmarkIcon, ExternalLinkIcon, BookmarkFilledIcon,
} from '@radix-ui/react-icons';
import '../styles.css';
import './styles.css';

/**
 * Toolbar component for custom selections in the exercise page.
 *
 * @returns JSX element representing the toolbar.
 */
const CustomSelectionsToolbar = () => {
  const sectionSelectionContext: SectionSelectionContextType = useContext(SectionSelectionContext);

  return (<Toolbar.Root className="ToolbarRoot CustomSelectionsToolbarRoot" aria-label="Formatting options">
      <Toolbar.Button
        className="ToolbarButton"
        disabled={sectionSelectionContext.selectedExercise.exerciseID !== getExerciseIdFromLocation() ||
          sectionSelectionContext.selectedSections.length === 0}
        onClick={() => {
        sectionSelectionContext.setDialogueSaveSelectionsOpen();
      }}>
        {sectionSelectionContext.selectionStorageMatch && (<BookmarkFilledIcon />) || (<BookmarkIcon />)}
        <span className="ToolbarButtonText">
          {sectionSelectionContext.selectionStorageMatch &&
            i18n.t(`${LANG_NS_MAIN}:pageExercisePracticeToolbarSaveUpdateButton`) ||
            i18n.t(`${LANG_NS_MAIN}:pageExercisePracticeToolbarSaveButton`)}
        </span>
      </Toolbar.Button>
      <Toolbar.Button
        className="ToolbarButton Warning"
        disabled={sectionSelectionContext.selectedExercise.exerciseID !== getExerciseIdFromLocation() ||
          sectionSelectionContext.selectedSections.length === 0}
        style={{marginLeft: 'auto'}}
        onClick={sectionSelectionContext.reset}>
        <CrossCircledIcon />
        <span className="ToolbarButtonText">{i18n.t(`${LANG_NS_MAIN}:pageExercisePracticeToolbarResetButton`)}</span>
      </Toolbar.Button>
      {sectionSelectionContext.selectedSections.length > 0 &&
        sectionSelectionContext.selectedExercise.exerciseID === getExerciseIdFromLocation() && (
          <Toolbar.Link
            className="ToolbarLink"
            href={getPracticeSelectionURLFromSelectionContext(sectionSelectionContext)}
            target="_blank"
            style={{marginRight: 10}}>
            <ExternalLinkIcon />
            {i18n.t(`${LANG_NS_MAIN}:pageExercisePracticeToolbarDirectLink`, {
              count: sectionSelectionContext.selectedSections.length,
              exercise: sectionSelectionContext.selectedExercise.exerciseTitle
            })}
          </Toolbar.Link>
        ) || (
          <span className="ToolbarText">
            {i18n.t(`${LANG_NS_MAIN}:pageExercisePracticeToolbarDisabledLink`)}
          </span>
        )}
    </Toolbar.Root>
  )
}

export default CustomSelectionsToolbar;
