import {getSectionKeysFromSelectionContext} from "./customSelectionHandling";

/**
 * Generates the URL for practicing selected sections.
 * @param exerciseID - The ID of the exercise.
 * @param sectionsKeys - An array of section keys.
 * @returns The URL for practicing the selected sections.
 */
export function getPracticeSelectionURL(
  {exerciseID, sectionsKeys} : {exerciseID: string, sectionsKeys: string[]}): string {
  return `/practice/${exerciseID}/${sectionsKeys.join(",")}/start`;
}

/**
 * Generates the URL for the exercise page.
 * @param exerciseID - The ID of the exercise.
 * @returns The URL for the exercise page.
 */
export function getExerciseURL(
  {exerciseID} : {exerciseID: string}): string {
  return `/exercise/${exerciseID}`;
}

/**
 * Generates the URL for practicing selected sections based on the provided sections selection.
 * @param selectedExercise - The selected exercise.
 * @param selectedSections - The selected sections.
 * @returns The URL for practicing the selected sections.
 */
export function getPracticeSelectionURLFromSelectionContext(
  {
    selectedExercise,
    selectedSections
  } : {
    selectedExercise: {exerciseID: string},
    selectedSections: {sectionID: string}[]
  }): string {

  return getPracticeSelectionURL({
    exerciseID: selectedExercise.exerciseID,
    sectionsKeys: getSectionKeysFromSelectionContext({selectedSections})
  });
}

/**
 * Generates the URL for the exercise page based on the provided sections selection.
 * @param selectedExercise - The selected exercise.
 * @returns The URL for the exercise page.
 */
export function getExerciseURLFromSelectionContext(
  {
    selectedExercise
  } : {
    selectedExercise: {exerciseID: string}
  }): string {

  return getExerciseURL({
    exerciseID: selectedExercise.exerciseID
  });
}
