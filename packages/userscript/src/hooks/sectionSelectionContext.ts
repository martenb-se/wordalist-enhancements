import {Context, createContext} from "preact";
import {
  CustomSelectionsSectionStorageSetterType,
  CustomSelectionsStorageSetterType,
  SectionSelectionContextType
} from "../@types/customSelectionTypes";

const placeHolderValue: SectionSelectionContextType = {
  selectedExercise: {exerciseID: "", exerciseTitle: ""},
  selectedSectionIterator: 0,
  selectedSections: [],
  selectionHash: "",
  selectionStorageMatch: null,
  dialogueSaveSelectionsOpen: false,
  dialogueCustomSelectionsStorageOpen: false,
  customSelectionsExercisesStorage: [],
  customSelectionsStorage: [],
  /* Save Selections Dialogue */
  setDialogueSaveSelectionsOpen: () => {
    console.log(
      "SectionSelectionContext.setDialogueSaveSelectionsOpen() placeholder function executed. " +
      "This should be replaced by a new function.");
  },
  setDialogueSaveSelectionsClosed: () => {
    console.log(
      "SectionSelectionContext.setDialogueSaveSelectionsClosed() placeholder function executed. " +
      "This should be replaced by a new function.");
  },
  /* Selections Storage */
  setDialogueCustomSelectionsStorageOpen: () => {
    console.log(
      "SectionSelectionContext.setDialogueCustomSelectionsStorageOpen() placeholder function executed. " +
      "This should be replaced by a new function.");
  },
  setDialogueCustomSelectionsStorageClosed: () => {
    console.log(
      "SectionSelectionContext.setDialogueCustomSelectionsStorageClosed() placeholder function executed. " +
      "This should be replaced by a new function.");
  },
  setInCustomSelectionsExercisesStorage: ({index = null, exerciseID, exerciseTitle}) => {
    console.log(
      "SectionSelectionContext.setInCustomSelectionsExercisesStorage() placeholder function executed. " +
      "This should be replaced by a new function.");
    console.log(` - index: ${index}`);
    console.log(` - exerciseID: ${exerciseID}`);
    console.log(` - exerciseTitle: ${exerciseTitle}`);
  },
  setMultipleInCustomSelectionsExercisesStorage:
    ({
       customSelectionsExercisesStorageSetters,
       resetStorage
    }) => {
    console.log(
      "SectionSelectionContext.setMultipleInCustomSelectionsExercisesStorage() placeholder function executed. " +
      "This should be replaced by a new function.");
    console.log(`resetStorage: ${resetStorage}`);
    customSelectionsExercisesStorageSetters.forEach(
      ({index, exerciseID, exerciseTitle}, forEachIndex) => {
        console.log(`${forEachIndex} - index: ${index}`);
        console.log(`${forEachIndex} - exerciseID: ${exerciseID}`);
        console.log(`${forEachIndex} - exerciseTitle: ${exerciseTitle}`);
      });
  },
  deleteFromCustomSelectionsExercisesStorage: ({exerciseID}) => {
    console.log(
      "SectionSelectionContext.deleteCustomSelectionsExercisesStorage() placeholder function executed. " +
      "This should be replaced by a new function.");
    console.log(` - exerciseID: ${exerciseID}`);
  },
  setInCustomSelectionsStorage:
    ({
       index,
       name,
       exerciseID,
       exerciseTitle,
       sections
    }) => {
    console.log(
      "SectionSelectionContext.setInCustomSelectionsStorage() placeholder function executed. " +
      "This should be replaced by a new function.");
    console.log(` - index: ${index}`);
    console.log(` - name: ${name}`);
    console.log(` - exerciseID: ${exerciseID}`);
    console.log(` - exerciseTitle: ${exerciseTitle}`);
    console.log(` - sections: ${sections}`);
  },
  setMultipleInCustomSelectionsStorage:
    ({
       customSelectionsStorageSetters,
       resetStorage
    }) => {
    console.log(
      "SectionSelectionContext.setMultipleInCustomSelectionsStorage() placeholder function executed. " +
      "This should be replaced by a new function.");
    console.log(`resetStorage: ${resetStorage}`);
    customSelectionsStorageSetters.forEach(
      ({exerciseID, exerciseTitle, sections, name, index}:
         CustomSelectionsStorageSetterType, forEachIndex) => {
        console.log(`${forEachIndex} - index: ${index}`);
        console.log(`${forEachIndex} - name: ${name}`);
        console.log(`${forEachIndex} - exerciseID: ${exerciseID}`);
        console.log(`${forEachIndex} - exerciseTitle: ${exerciseTitle}`);
        console.log(`${forEachIndex} - sections: ${sections}`);
      });
  },
  deleteFromCustomSelectionsStorage: ({hash}) => {
    console.log(
      "SectionSelectionContext.deleteFromCustomSelectionsStorage() placeholder function executed. " +
      "This should be replaced by a new function.");
    console.log(` - hash: ${hash}`);
  },
  setInCustomSelectionSectionsStorage: ({hash, index, sectionID, sectionTitle}) => {
    console.log(
      "SectionSelectionContext.setInCustomSelectionSectionsStorage() placeholder function executed. " +
      "This should be replaced by a new function.");
    console.log(` - hash: ${hash}`);
    console.log(` - index: ${index}`);
    console.log(` - sectionID: ${sectionID}`);
    console.log(` - sectionTitle: ${sectionTitle}`);
  },
  setMultipleInCustomSelectionSectionsStorage: (customSelectionsSectionStorageSetters) => {
    console.log(
      "SectionSelectionContext.setMultipleInCustomSelectionSectionsStorage() placeholder function executed. " +
      "This should be replaced by a new function.");
    customSelectionsSectionStorageSetters.forEach(
      ({hash, index, sectionID, sectionTitle}:
         CustomSelectionsSectionStorageSetterType, forEachIndex) => {
        console.log(`${forEachIndex} - hash: ${hash}`);
        console.log(`${forEachIndex} - index: ${index}`);
        console.log(`${forEachIndex} - sectionID: ${sectionID}`);
        console.log(`${forEachIndex} - sectionTitle: ${sectionTitle}`);
      });
  },
  deleteFromCustomSelectionSectionsStorage: ({hash, sectionID}) => {
    console.log(
      "SectionSelectionContext.deleteFromCustomSelectionSectionsStorage() placeholder function executed. " +
      "This should be replaced by a new function.");
    console.log(` - hash: ${hash}`);
    console.log(` - sectionID: ${sectionID}`);
  },
  updateLastPracticedInCustomSelectionsStorage: ({hash}) => {
    console.log(
      "SectionSelectionContext.updateLastPracticedInCustomSelectionsStorage() placeholder function executed. " +
      "This should be replaced by a new function.");
    console.log(` - index: ${hash}`);
  },
  getCustomSelectionsStatistics: ({hash}) => {
    console.log(
      "SectionSelectionContext.getCustomSelectionsStatistics() placeholder function executed. " +
      "This should be replaced by a new function.");
    console.log(` - index: ${hash}`);
    return {
      lastPracticed: "Placeholder",
      practicesTotal: -1,
      practicesToday: -1
    };
  },
  /* Selections */
  reset: (): void => {
    console.log(
      "SectionSelectionContext.reset() placeholder function executed. " +
      "This should be replaced by a new function.");
  },
  resetAndAddToSelectedSections: ({elementID, sectionID}) => {
    console.log(
      "SectionSelectionContext.resetAndAddToSelectedSections() placeholder function executed. " +
      "This should be replaced by a new function.");
    console.log(` - elementID: ${elementID}`);
    console.log(` - sectionID: ${sectionID}`);
  },
  setSelectedExercise: ({exerciseID, exerciseTitle}) => {
    console.log(
      "SectionSelectionContext.setSelectedExercise() placeholder function executed. " +
      "This should be replaced by a new function.");
    console.log(` - sectionID: ${exerciseID}`);
    console.log(` - sectionID: ${exerciseTitle}`);
  },
  addToSelectedSections: ({elementID, sectionID, sectionTitle}) => {
    console.log(
      "SettingsContext.addToSelectedSections() placeholder function executed. " +
      "This should be replaced by a new function.");
    console.log(` - elementID: ${elementID}`);
    console.log(` - sectionID: ${sectionID}`);
    console.log(` - sectionTitle: ${sectionTitle}`);
  },
  setMultipleSelectedSections: (customSelectionSectionAdditions) => {
    console.log(
      "SettingsContext.addToSelectedSections() placeholder function executed. " +
      "This should be replaced by a new function.");
    customSelectionSectionAdditions.forEach(
      ({elementID, sectionID, sectionTitle}, forEachIndex) => {
        console.log(`${forEachIndex} - elementID: ${elementID}`);
        console.log(`${forEachIndex} - sectionID: ${sectionID}`);
        console.log(`${forEachIndex} - sectionTitle: ${sectionTitle}`);
      });
  },
  removeFromSelectedSections: ({elementID}) => {
    console.log(
      "SettingsContext.removeFromSelectedSections() placeholder function executed. " +
      "This should be replaced by a new function.");
    console.log(` - elementID: ${elementID}`);
  }
};

export const SectionSelectionContext: Context<SectionSelectionContextType> = createContext(placeHolderValue);
