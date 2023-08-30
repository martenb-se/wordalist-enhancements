import {
  CustomSelectionsExercisesStorageType,
  CustomSelectionsOneActiveSectionType,
  CustomSelectionsOneExerciseStorageType,
  CustomSelectionsStorageType,
  CustomSelectionStatisticsType,
  OneCustomSelectionSectionType,
  OneCustomSelectionStorageType
} from "../@types/customSelectionTypes";
import {ELEM_PAGE_EXERCISE_SECTIONS_ADDITION_BASE_ID} from "../constants";
import {isDateToday} from "./dateHandling";


/**
 * Retrieves an array of section IDs (keys) from the provided selection context's selectedSections array.
 * @param selectedSections - The array of selected sections containing section IDs.
 * @returns An array of section IDs (keys).
 */
export function getSectionKeysFromSelectionContext(
  {
    selectedSections
  }: {
    selectedSections: { sectionID: string }[]
  }): string[] {

  return selectedSections.reduce((acc: string[], {sectionID}): string[] => {
    return [...acc, sectionID]
  }, []);
}

/**
 * Retrieves a custom selection object from the provided hash.
 * @param hash - The hash to search for within the custom selection's storage.
 * @param sectionSelectionContext - The section selection context containing custom selections' storage.
 * @returns The found custom selection object, or null if not found.
 */
export function getCustomSelectionFromHash(
  {
    hash,
    sectionSelectionContext
  }: {
    hash: string,
    sectionSelectionContext: {
      customSelectionsStorage: CustomSelectionsStorageType
    }
  }): OneCustomSelectionStorageType | null {

  const customSelectionFound: CustomSelectionsStorageType =
    sectionSelectionContext.customSelectionsStorage.filter(
      (props: OneCustomSelectionStorageType): boolean => hash === props.hash);

  return customSelectionFound ? customSelectionFound[0] : null;
}

/**
 * Filters out and returns an array of custom selection objects excluding the one with the provided hash.
 * @param hash - The hash to exclude from the filter.
 * @param sectionSelectionContext - The section selection context containing custom selections' storage.
 * @returns An array of custom selection objects.
 */
export function filterCustomSelectionFromHash(
  {
    hash,
    sectionSelectionContext
  }: {
    hash: string,
    sectionSelectionContext: {
      customSelectionsStorage: CustomSelectionsStorageType
    }
  }): CustomSelectionsStorageType {
  const customSelectionFiltered: CustomSelectionsStorageType =
    sectionSelectionContext.customSelectionsStorage.filter(
      (props: OneCustomSelectionStorageType): boolean => hash !== props.hash);

  return customSelectionFiltered ? customSelectionFiltered : [];
}

/**
 * Filters out and returns an array of custom selection objects excluding those with the provided exercise ID.
 * @param exerciseID - The exercise ID to exclude from the filter.
 * @param sectionSelectionContext - The section selection context containing custom selections' storage.
 * @returns An array of custom selection objects.
 */
export function filterCustomSelectionFromExerciseID(
  {
    exerciseID,
    sectionSelectionContext
  }: {
    exerciseID: string,
    sectionSelectionContext: {
      customSelectionsStorage: CustomSelectionsStorageType
    }
  }): CustomSelectionsStorageType {
  const customSelectionFiltered: CustomSelectionsStorageType =
    sectionSelectionContext.customSelectionsStorage.filter(
      (props: OneCustomSelectionStorageType): boolean => exerciseID !== props.exerciseID);

  return customSelectionFiltered ? customSelectionFiltered : [];
}

/**
 * Retrieves an array of custom selection objects based on the provided exercise ID.
 * @param exerciseID - The exercise ID for which to retrieve custom selections.
 * @param sectionSelectionContext - The section selection context containing custom selections' storage.
 * @returns An array of custom selection objects matching the provided exercise ID.
 */
export function getCustomSelectionsFromExerciseID(
  {
    exerciseID,
    sectionSelectionContext
  }: {
    exerciseID: string,
    sectionSelectionContext: {
      customSelectionsStorage: CustomSelectionsStorageType
    }
  }): CustomSelectionsStorageType {
  const customSelectionFound: CustomSelectionsStorageType =
    sectionSelectionContext.customSelectionsStorage.filter(
      (props: OneCustomSelectionStorageType): boolean => exerciseID === props.exerciseID);

  return customSelectionFound ? customSelectionFound : [];
}

/**
 * Retrieves a custom selection exercise object based on the provided exercise ID.
 * @param exerciseID - The exercise ID for which to retrieve the custom selection exercise.
 * @param sectionSelectionContext - The section selection context containing custom selection exercises storage.
 * @returns The custom selection exercise object matching the provided exercise ID, or `null` if not found.
 */
export function getCustomSelectionExerciseFromID(
  {
    exerciseID,
    sectionSelectionContext
  }: {
    exerciseID: string,
    sectionSelectionContext: {
      customSelectionsExercisesStorage: CustomSelectionsExercisesStorageType
    }
  }): CustomSelectionsOneExerciseStorageType | null {

  const customSelectionExerciseFound: CustomSelectionsExercisesStorageType =
    sectionSelectionContext.customSelectionsExercisesStorage.filter(
      (props: CustomSelectionsOneExerciseStorageType): boolean => exerciseID === props.exerciseID);

  return customSelectionExerciseFound ? customSelectionExerciseFound[0] : null;
}

/**
 * Filters out custom selection exercise objects based on the provided exercise ID.
 * @param exerciseID - The exercise ID for which to filter out custom selection exercises.
 * @param sectionSelectionContext - The section selection context containing custom selection exercises storage.
 * @returns An array of custom selection exercise objects excluding the ones matching the provided exercise ID.
 */
export function filterCustomSelectionExerciseFromID(
  {
    exerciseID,
    sectionSelectionContext
  }: {
    exerciseID: string,
    sectionSelectionContext: {
      customSelectionsExercisesStorage: CustomSelectionsExercisesStorageType
    }
  }): CustomSelectionsExercisesStorageType {

  const customSelectionExerciseFiltered: CustomSelectionsExercisesStorageType =
    sectionSelectionContext.customSelectionsExercisesStorage.filter(
      (props: CustomSelectionsOneExerciseStorageType): boolean => exerciseID !== props.exerciseID);

  return customSelectionExerciseFiltered ? customSelectionExerciseFiltered : [];
}

/**
 * Generates a unique checkbox ID based on the provided exercise and section IDs.
 * @param exerciseID - The ID of the exercise.
 * @param sectionID - The ID of the section.
 * @returns A unique checkbox ID derived from the exercise and section IDs.
 */
export function getCheckboxIdFromExerciseAndSection(
  {
    exerciseID,
    sectionID
  }: {
    exerciseID: string,
    sectionID: string,
  }): string {
  return `${ELEM_PAGE_EXERCISE_SECTIONS_ADDITION_BASE_ID}-${exerciseID}-${sectionID}-checkbox`
}

/**
 * Creates a filtering function to match exercise IDs.
 * @param matchingExerciseID - The exercise ID to match against.
 * @returns A filtering function that checks if the exerciseID property matches the provided ID.
 */
export function propFilterExerciseID(matchingExerciseID: string): (filterProp: { exerciseID: string }) => boolean {
  /**
   * Filtering function that checks if the exerciseID property matches the provided ID.
   * @param {Object} filterProp - The object containing the exerciseID property.
   * @param {string} filterProp.exerciseID - The exercise ID to compare.
   * @returns {boolean} True if the exerciseID matches, false otherwise.
   */
  return (filterProp: { exerciseID: string }): boolean => matchingExerciseID === filterProp.exerciseID;
}

/**
 * Creates a filtering function to match hashes.
 * @param matchingHash - The hash to match against.
 * @returns A filtering function that checks if the hash property matches the provided hash.
 */
export function propFilterCustomSelectionHash(matchingHash: string):
  (oneCustomSelectionStorage: {hash: string}) => boolean {
  /**
   * Filtering function that checks if the hash property matches the provided hash.
   * @param {Object} filterProp - The object containing the hash property.
   * @param {string} filterProp.hash - The hash to compare.
   * @returns {boolean} True if the hash matches, false otherwise.
   */
  return (filterProp: {hash: string}): boolean => matchingHash === filterProp.hash;
}

/**
 * Creates a filtering function to match element IDs.
 * @param matchingElementID - The element ID to match against.
 * @returns A filtering function that checks if the elementID property matches the provided ID.
 */
export function propFilterElementID(matchingElementID: string):
  (oneCustomSelectionStorage: {elementID: string}) => boolean {
  /**
   * Filtering function that checks if the elementID property matches the provided ID.
   * @param {Object} filterProp - The object containing the elementID property.
   * @param {string} filterProp.hash - The element ID to compare.
   * @returns {boolean} True if the elementID matches, false otherwise.
   */
  return (filterProp: {elementID: string}): boolean => matchingElementID === filterProp.elementID;
}

/**
 * Creates a filtering function to match section IDs.
 * @param matchingSectionID - The section ID to match against.
 * @returns A filtering function that checks if the sectionID property matches the provided ID.
 */
export function propFilterSectionID(matchingSectionID: string):
  (oneCustomSelectionStorage: {sectionID: string}) => boolean {
  /**
   * Filtering function that checks if the sectionID property matches the provided ID.
   * @param {Object} filterProp - The object containing the sectionID property.
   * @param {string} filterProp.hash - The section ID to compare.
   * @returns {boolean} True if the sectionID matches, false otherwise.
   */
  return (filterProp: {sectionID: string}): boolean => matchingSectionID === filterProp.sectionID;
}

/**
 * Creates a mapper function that restores HTML element IDs in custom selection sections based on the provided
 * current exercise ID.
 * @param currentExerciseID - The current exercise ID to use for restoring HTML element IDs.
 * @returns A mapping function that restores HTML element IDs in a custom selection sections list.
 */
export function sectionsMapperRestoreElementIDs(currentExerciseID: string): (
  section: { index: number, sectionID: string, sectionTitle: string }
) => CustomSelectionsOneActiveSectionType {
  /**
   * Mapping function that restores element IDs in a custom selection sections list.
   * @param {Object} storedProps - The object containing stored properties.
   * @param {number} storedProps.index - The index of the section.
   * @param {string} storedProps.sectionID - The ID of the section.
   * @param {string} storedProps.sectionTitle - The title of the section.
   * @returns {Object} An object with restored properties and element ID.
   */
  return (section: OneCustomSelectionSectionType): CustomSelectionsOneActiveSectionType => {
    return {
      ...section,
      elementID: getCheckboxIdFromExerciseAndSection({
        exerciseID: currentExerciseID,
        sectionID: section.sectionID
      })
    };
  };
}

/**
 * Retrieves the title of an exercise based on its ID from the custom selections exercises storage. If the exercise is
 * not found, a default title with the exercise ID is returned.
 * @param options - The options object containing exercise ID and section selection context.
 * @param options.exerciseID - The ID of the exercise for which to retrieve the title.
 * @param options.sectionSelectionContext - The section selection context containing custom selections
 * exercises storage.
 * @returns The exercise title if found, or a default title with the exercise ID.
 */
export function getTitleFromExerciseID(
  {
    exerciseID,
    sectionSelectionContext
  }: {
    exerciseID: string,
    sectionSelectionContext: {
      customSelectionsExercisesStorage: CustomSelectionsExercisesStorageType
    }
  }) {
  return getCustomSelectionExerciseFromID(
    {exerciseID, sectionSelectionContext}
  )?.exerciseTitle ?? `Exercise #${exerciseID}`
}

/**
 * Retrieves defined custom selection statistics from a custom selection object. If any of the statistics are not
 * defined in the provided object, default values are used.
 * @param customSelection - The custom selection object from which to retrieve statistics.
 * @returns An object containing custom selection statistics.
 */
export function getDefinedCustomSelectionStatistics(customSelection: OneCustomSelectionStorageType):
  CustomSelectionStatisticsType {
  return {
    lastPracticed: customSelection.lastPracticed ? customSelection.lastPracticed : null,
    practicesToday:
      customSelection.practicesToday && customSelection.lastPracticed &&
      isDateToday(new Date(customSelection.lastPracticed)) ? customSelection.practicesToday : 0,
    practicesTotal: customSelection.practicesTotal ? customSelection.practicesTotal : 0
  }
}
