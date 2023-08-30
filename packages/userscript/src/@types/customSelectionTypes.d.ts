/**
 * Represents a custom selection.
 */
export type CustomSelectionType = {
  /** The ID of the HTML element. */
  elementID: string,
  /** The ID of the exercise. */
  exerciseID: string,
  /** The ID of the section. */
  sectionID: string,
  /** The title of the exercise. */
  exerciseTitle: string,
  /** The title of the section. */
  sectionTitle: string
}

/**
 * Represents a custom selection exercise.
 */
export type CustomSelectionExerciseType = {
  /** The ID of the exercise. */
  exerciseID: string,
  /** The title of the exercise. */
  exerciseTitle: string
}

/**
 * Represents a custom selection with one active section.
 */
export type CustomSelectionsOneActiveSectionType = {
  /** The index of the active section. */
  index: number,
  /** The ID of the HTML element. */
  elementID: string,
  /** The ID of the section. */
  sectionID: string,
  /** The title of the section. */
  sectionTitle: string
}

/**
 * Represents an array of custom selections with active sections.
 */
export type CustomSelectionsActiveSectionsType = CustomSelectionsOneActiveSectionType[]

/**
 * Represents the addition of a section to a custom selection.
 */
export type CustomSelectionSectionAdditionType = {
  /** The ID of the HTML element. */
  elementID: string,
  /** The ID of the section. */
  sectionID: string,
  /** The title of the section. */
  sectionTitle: string
}

/**
 * Represents the removal of a section from a custom selection.
 */
export type CustomSelectionRemoveSectionType = {
  /** The ID of the HTML element. */
  elementID: string
}

/* Saved */
/* - Sections */

/**
 * Represents a single section within a custom selection.
 */
export type OneCustomSelectionSectionType = {
  /** The index of the section. */
  index: number,
  /** The ID of the section. */
  sectionID: string,
  /** The title of the section. */
  sectionTitle: string
}

/**
 * Represents an array of custom selection sections.
 */
export type CustomSelectionSectionsType = OneCustomSelectionSectionType[];

/* - Custom Selections */

/**
 * Represents a single custom selection's storage details.
 */
export type OneCustomSelectionStorageType = {
  /** The index of the custom selection. */
  index: number,
  /** The hash of the custom selection. */
  hash: string,
  /** The name of the custom selection. */
  name: string,
  /** The ID of the associated exercise. */
  exerciseID: string,
  /** The sections included in the custom selection. */
  sections: CustomSelectionSectionsType,
  /** The date of the last practice, if available. */
  lastPracticed?: string,
  /** The total number of practices. */
  practicesTotal?: number,
  /** The number of practices today. */
  practicesToday?: number
}

/**
 * Represents an array of custom selection storage entries.
 */
export type CustomSelectionsStorageType = OneCustomSelectionStorageType[];

/* - Exercises */

/**
 * Represents a single exercise within custom selections' storage.
 */
export type CustomSelectionsOneExerciseStorageType = {
  /** The index of the exercise entry. */
  index: number,
  /** The ID of the exercise. */
  exerciseID: string,
  /** The title of the exercise. */
  exerciseTitle: string
}

/**
 * Represents an array of exercise entries in custom selections storage.
 */
export type CustomSelectionsExercisesStorageType = CustomSelectionsOneExerciseStorageType[];

/* Statistics */
/* - Custom Selections */

/**
 * Represents statistics related to a custom selection.
 */
export type CustomSelectionStatisticsType = {
  /** The date of the last practice, or null if never practiced. */
  lastPracticed: string | null,
  /** The total number of practices for the custom selection. */
  practicesTotal: number,
  /** The number of practices for the custom selection on the current day. */
  practicesToday: number
}

/* Setters */
/* - Sections */

/**
 * Represents parameters for setting or updating a section in custom selections' storage.
 */
export type CustomSelectionsSectionStorageSetterType = {
  /** The hash to identify the correct custom selection. */
  hash: string,
  /** The index of the section to update, if provided. */
  index?: number | null,
  /** The ID of the section. */
  sectionID: string,
  /** The title of the section. */
  sectionTitle: string
}

/* - Custom Selections */

/**
 * Represents parameters for setting or updating custom selections in storage.
 */
export type CustomSelectionsStorageSetterType = {
  /** The index of the custom selection to update, if provided. */
  index?: number | null,
  /** The name of the custom selection. */
  name: string,
  /** The ID of the associated exercise. */
  exerciseID: string,
  /** The title of the associated exercise. */
  exerciseTitle: string,
  /** The active sections for the custom selection. */
  sections: CustomSelectionsActiveSectionsType,
  /** The date of the last practice, if available. */
  lastPracticed?: string,
  /** The total number of practices. */
  practicesTotal?: number,
  /** The number of practices today. */
  practicesToday?: number
}

/**
 * Represents parameters for setting or updating multiple custom selections in storage.
 */
export type MultipleCustomSelectionsStorageSetterType = {
  /** An array of custom selection setters. */
  customSelectionsStorageSetters: CustomSelectionsStorageSetterType[],
  /** Whether to reset the storage beforehand. */
  resetStorage?: boolean
}

/* - Exercises */

/**
 * Represents parameters for setting or updating an exercise in custom selections storage.
 */
export type CustomSelectionsExercisesStorageSetterType = {
  /** The index of the exercise to update, if provided. */
  index?: number | null,
  /** The ID of the exercise. */
  exerciseID: string,
  /** The title of the exercise. */
  exerciseTitle: string
}

/**
 * Represents parameters for setting or updating multiple exercises in custom selections storage.
 */
export type MultipleCustomSelectionsExercisesStorageSetterType = {
  /** An array of exercise setters. */
  customSelectionsExercisesStorageSetters: CustomSelectionsExercisesStorageSetterType[],
  /** Whether to reset the storage beforehand. */
  resetStorage?: boolean
}

/* Migration / Export / Import */

/**
 * Represents data for exporting a single custom selection.
 */
export type CustomSelectionsOneExportType = {
  /** The name of the custom selection. */
  name: string,
  /** The ID of the associated exercise. */
  exerciseID: string,
  /** The title of the associated exercise. */
  exerciseTitle: string,
  /** The sections included in the custom selection. */
  sections: CustomSelectionSectionsType
}

/**
 * Represents data for exporting an array of custom selections.
 */
export type CustomSelectionsExportType = CustomSelectionsOneExportType[];

/* Context State */
/**
 * Represents the state of the section selection context.
 */
export type SectionSelectionContextType = {
  /** The selected custom selection exercise. */
  selectedExercise: CustomSelectionExerciseType,
  /** The iterator for the selected section. */
  selectedSectionIterator: number,
  /** The selected sections. */
  selectedSections: CustomSelectionsActiveSectionsType,
  /** The hash of the selection. */
  selectionHash: string,
  /** The matched selection in storage. */
  selectionStorageMatch: OneCustomSelectionStorageType | null,
  /** Whether the dialogue for saving selections is open. */
  dialogueSaveSelectionsOpen: boolean,
  /** Whether the dialogue for custom selections storage is open. */
  dialogueCustomSelectionsStorageOpen: boolean,
  /** Storage of custom selection exercises. */
  customSelectionsExercisesStorage: CustomSelectionsExercisesStorageType,
  /** Storage of custom selections. */
  customSelectionsStorage: CustomSelectionsStorageType,
  /** Setter function to open the save selections dialogue. */
  setDialogueSaveSelectionsOpen: () => void,
  /** Setter function to close the save selections dialogue. */
  setDialogueSaveSelectionsClosed: () => void,
  /** Setter function to open the custom selections storage dialogue. */
  setDialogueCustomSelectionsStorageOpen: () => void,
  /** Setter function to close the custom selections storage dialogue. */
  setDialogueCustomSelectionsStorageClosed: () => void,
  /**
   * Setter function to update custom selection exercise storage.
   * @param params - Parameters for updating custom selection exercises storage.
   */
  setInCustomSelectionsExercisesStorage:
    (params: CustomSelectionsExercisesStorageSetterType) => void,
  /**
   * Setter function to update multiple custom selection exercises in storage.
   * @param params - Parameters for updating multiple custom selection exercises in storage.
   */
  setMultipleInCustomSelectionsExercisesStorage:
    (params: MultipleCustomSelectionsExercisesStorageSetterType) => void,
  /**
   * Setter function to delete an exercise from custom selections exercises storage.
   * @param params - Parameters for deleting an exercise from custom selections exercises storage.
   */
  deleteFromCustomSelectionsExercisesStorage: ({exerciseID}: { exerciseID: string }) => void,
  /**
   * Function to update custom selections' storage.
   * @param params - Parameters for updating custom selections storage.
   */
  setInCustomSelectionsStorage:
    (params: CustomSelectionsStorageSetterType) => void,
  /**
   * Setter function to update multiple custom selections in storage.
   * @param params - Parameters for updating multiple custom selections in storage.
   */
  setMultipleInCustomSelectionsStorage:
    (params: MultipleCustomSelectionsStorageSetterType) => void,
  /**
   * Function to delete a custom selection from storage.
   * @param params - Parameters for deleting a custom selection from storage.
   */
  deleteFromCustomSelectionsStorage: ({hash}: { hash: string }) => void,
  /**
   * Setter function to update a section in custom selections section storage.
   * @param params - Parameters for updating a section in custom selections section storage.
   */
  setInCustomSelectionSectionsStorage:
    (params: CustomSelectionsSectionStorageSetterType) => void,
  /**
   * Setter function to update multiple sections in custom selections section storage.
   * @param customSelectionsSectionStorageSetters - Array of parameters for updating sections in custom selections
   * section storage.
   */
  setMultipleInCustomSelectionSectionsStorage:
    (customSelectionsSectionStorageSetters: CustomSelectionsSectionStorageSetterType[]) => void,
  /**
   * Function to delete a section from custom selections section storage.
   * @param params - Parameters for deleting a section from custom selections section storage.
   */
  deleteFromCustomSelectionSectionsStorage:
    ({hash, sectionID}: { hash: string, sectionID: string }) => void,
  /**
   * Setter function to update the "last practiced" date in custom selections' storage.
   * @param params - Parameters for updating the "last practiced" date in custom selections' storage.
   */
  updateLastPracticedInCustomSelectionsStorage: ({hash}: { hash: string }) => void,
  /**
   * Get statistics for a specific custom selection.
   * @param params - Parameters for retrieving statistics for a custom selection.
   * @returns Statistics related to the custom selection.
   */
  getCustomSelectionsStatistics: ({hash}: { hash: string }) => CustomSelectionStatisticsType,
  /** Reset the state to its initial values. */
  reset: () => void,
  /**
   * Reset the state and add a section to the selected sections.
   * @param sectionID - The ID of the section to add.
   * @param sectionTitle - The title of the section to add.
   * @param elementID - The ID of the HTML element to add.
   */
  resetAndAddToSelectedSections: ({sectionID, sectionTitle, elementID}: CustomSelectionSectionAdditionType) => void,
  /**
   * Set the selected exercise.
   * @param exerciseID - The ID of the exercise.
   * @param exerciseTitle - The title of the exercise.
   */
  setSelectedExercise: ({exerciseID, exerciseTitle}: CustomSelectionExerciseType) => void,
  /**
   * Add a section to the selected sections.
   * @param sectionID - The ID of the section to add.
   * @param sectionTitle - The title of the section to add.
   * @param elementID - The ID of the HTML element to add.
   */
  addToSelectedSections: ({sectionID, sectionTitle, elementID}: CustomSelectionSectionAdditionType) => void,
  /**
   * Set multiple sections as selected.
   * @param customSelectionSectionAdditions - Array of sections to set as selected.
   */
  setMultipleSelectedSections: (customSelectionSectionAdditions: CustomSelectionsActiveSectionsType) => void,
  /**
   * Remove a section from the selected sections.
   * @param elementID - The ID of the HTML element to remove.
   */
  removeFromSelectedSections: ({elementID}: CustomSelectionRemoveSectionType) => void
}
