import sha256 from "crypto-js/sha256";
import {getSectionKeysFromSelectionContext} from "./customSelectionHandling";

/**
 * Generates a hash value for a custom selection based on the exercise ID and section keys.
 * @param exerciseID - The ID of the exercise.
 * @param sectionsKeys - An array of section keys.
 * @returns The hash value generated for the custom selection.
 */
export function getCustomSelectionHash(
  {exerciseID, sectionsKeys} : {exerciseID: string, sectionsKeys: string[]}): string {
  sectionsKeys.sort();
  return sha256(`${exerciseID}:${sectionsKeys.join("_")}`).toString();
}

/**
 * Generates a hash value for a custom selection based on the current selection of sections within the current exercise.
 * @param selectedExercise - The selected exercise containing its ID.
 * @param selectedSections - An array of selected section objects containing section IDs.
 * @returns The hash value generated for the custom selection.
 */
export function getCustomSelectionHashFromSelectionContext(
  {
    selectedExercise,
    selectedSections
  } : {
    selectedExercise: {exerciseID: string},
    selectedSections: {sectionID: string}[]
  }): string {

  return getCustomSelectionHash({
    exerciseID: selectedExercise.exerciseID,
    sectionsKeys: getSectionKeysFromSelectionContext({selectedSections})
  });
}

