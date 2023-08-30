import {FirebaseOptions, FirebaseApp} from "firebase/app";
import {Database} from "firebase/database"
import {
  CustomSelectionsExercisesStorageType,
  CustomSelectionsStorageType,
  CustomSelectionStatisticsType
} from "./customSelectionTypes";

/**
 * Represents statistics synced with Firebase for custom selections.
 */
export type FirebaseSyncedStatisticsType = Record<string, CustomSelectionStatisticsType>;

/**
 * Represents settings synced with Firebase.
 */
export type FirebaseSyncedSettingsType = {
  /** The language setting, if available. */
  language?: string;
};

/**
 * Represents exercises storage synced with Firebase.
 */
export type FirebaseSyncedExercisesStorageType = CustomSelectionsExercisesStorageType;

/**
 * Represents selections storage synced with Firebase.
 */
export type FirebaseSyncedSelectionsStorageType = CustomSelectionsStorageType;

/**
 * Represents the Firebase context.
 */
export type FirebaseContextType = {
  /** Whether the Firebase sync dialogue is open. */
  dialogueOpen: boolean;
  /** The unique ID associated with the context. */
  uniqueId: string | null;
  /** The Firebase configuration options. */
  config: FirebaseOptions | null;
  /** The Firebase app instance. */
  app: FirebaseApp | null;
  /** The Firebase database instance. */
  db: Database | null;
  /** Synced statistics for custom selections. */
  syncedStatistics: FirebaseSyncedStatisticsType;
  /** Synced settings for WLE. */
  syncedSettings: FirebaseSyncedSettingsType;
  /** Synced exercises storage for WLE. */
  syncedExercisesStorage: FirebaseSyncedExercisesStorageType;
  /** Synced selections storage for WLE. */
  syncedSelectionsStorage: FirebaseSyncedSelectionsStorageType;
  /** Function to open the Firebase sync dialogue. */
  openDialogue: () => void;
  /** Function to close the Firebase sync dialogue. */
  closeDialogue: () => void;
  /** Function to initiate a unique ID for Firebase. */
  initiateUniqueId: () => Promise<void>;
  /**
   * Function to set the Firebase configuration.
   * @param config - The Firebase configuration options.
   */
  setConfig: (config: FirebaseOptions) => void;
};
