import {Context, createContext} from "preact";
import {FirebaseContextType} from "../@types/firebaseContextTypes";
import {FirebaseOptions} from "firebase/app";

const placeHolderValue: FirebaseContextType = {
  dialogueOpen: false,
  uniqueId: null,
  config: null,
  app: null,
  db: null,
  syncedStatistics: {},
  syncedSettings: {},
  syncedExercisesStorage: [],
  syncedSelectionsStorage: [],
  openDialogue: () => {
    console.log("FirebaseContext.openDialogue() placeholder function executed. " +
      "This should be replaced by a new function.");
  },
  closeDialogue: () => {
    console.log("FirebaseContext.closeDialogue() placeholder function executed. " +
      "This should be replaced by a new function.");
  },
  initiateUniqueId: () => {
    console.log("FirebaseContext.initiateUniqueId() placeholder function executed. " +
      "This should be replaced by a new function.");
    return new Promise<void>((r) => {r()});
  },
  setConfig: (config: FirebaseOptions) => {
    console.log("FirebaseContext.setConfig() placeholder function executed. " +
      "This should be replaced by a new function.");
    console.log(` - config: ${config}`);
  }
};

export const FirebaseContext: Context<FirebaseContextType> = createContext(placeHolderValue);
