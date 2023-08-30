import {useContext} from "preact/compat";
import {SectionSelectionContextType} from "../../../@types/customSelectionTypes";
import {SectionSelectionContext} from "../../../hooks/sectionSelectionContext";
import {ELEM_PAGE_EXERCISE_SECTIONS_ADDITION_BASE_ID, LANG_NS_MAIN} from "../../../constants";
import i18n from "../../../i18n";
import RadixCheckbox from "../index";
import {propFilterElementID} from "../../../util/customSelectionHandling";

/**
 * Checkbox component for selecting exercise sections in the Wordalist exercise page.
 *
 * @param props - The properties for the exercise section checkbox.
 */
export const WordalistExerciseSectionCheckbox = (props: {
  id: string
  exerciseID: string,
  sectionID: string,
  exerciseTitle: string,
  sectionTitle: string
}) => {
  const sectionSelectionContext: SectionSelectionContextType = useContext(SectionSelectionContext);

  return (
    <div class={ELEM_PAGE_EXERCISE_SECTIONS_ADDITION_BASE_ID}>
      <RadixCheckbox
        id={props.id}
        exerciseID={props.exerciseID}
        sectionID={props.sectionID}
        exerciseTitle={props.exerciseTitle}
        sectionTitle={props.sectionTitle}
        label={i18n.t(`${LANG_NS_MAIN}:pageExercisePracticeSelectionLabel`)}
        checked={
          sectionSelectionContext.selectedSections.filter(
            ({sectionID}) => sectionID === props.sectionID).length > 0
        }
        onChangeCallback={(
          checked,
          {elementID, exerciseID, sectionID, exerciseTitle, sectionTitle}) => {

          if (checked && exerciseID.length > 0 && sectionSelectionContext.selectedExercise.exerciseID.length === 0 ||
            checked && exerciseID.length > 0 && sectionSelectionContext.selectedExercise.exerciseID !== exerciseID) {
            // New or changed exercise
            // Reset all selected sections and add selected section
            sectionSelectionContext.resetAndAddToSelectedSections({
              elementID,
              sectionID,
              sectionTitle
            });

            // Set exercise
            sectionSelectionContext.setSelectedExercise({exerciseID, exerciseTitle});

          } else if (checked &&
            // Add ID
            sectionSelectionContext.selectedSections.filter(propFilterElementID(elementID)).length === 0) {

            sectionSelectionContext.addToSelectedSections({
              elementID,
              sectionID,
              sectionTitle
            });
          } else if (!checked &&
            sectionSelectionContext.selectedSections.filter(propFilterElementID(elementID)).length > 0) {
            // Remove ID or reset whole context
            if (sectionSelectionContext.selectedSections.length === 1) {
              // Reset whole context if last ID is to be removed
              sectionSelectionContext.reset();
            } else {
              // Remove ID
              sectionSelectionContext.removeFromSelectedSections({elementID});
            }
          }

        }}/>
    </div>
  );
};
