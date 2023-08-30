import {render, VNode} from "preact";
import {useEffect, useState} from "preact/hooks";
import {removeDuplicatedComponent, synchronousWaitForElement} from "./util/preact";
import {createPortal} from "preact/compat";
import {
  CustomSelectionExerciseType,
  CustomSelectionRemoveSectionType,
  CustomSelectionsActiveSectionsType,
  CustomSelectionSectionAdditionType,
  CustomSelectionSectionsType,
  CustomSelectionsExercisesStorageSetterType,
  CustomSelectionsExercisesStorageType,
  CustomSelectionsOneActiveSectionType,
  CustomSelectionsOneExerciseStorageType,
  CustomSelectionsSectionStorageSetterType,
  CustomSelectionsStorageSetterType,
  CustomSelectionsStorageType, CustomSelectionStatisticsType,
  CustomSelectionType, MultipleCustomSelectionsExercisesStorageSetterType, MultipleCustomSelectionsStorageSetterType,
  OneCustomSelectionSectionType,
  OneCustomSelectionStorageType,
  SectionSelectionContextType
} from "./@types/customSelectionTypes";
import {
  FirebaseContextType, FirebaseSyncedExercisesStorageType, FirebaseSyncedSelectionsStorageType,
  FirebaseSyncedSettingsType,
  FirebaseSyncedStatisticsType
} from "./@types/firebaseContextTypes";
import {SettingContextType, SettingsOptionsType} from "./@types/settingsTypes";
import {AlertContextOptionsType, AlertContextType} from "./@types/alertContextTypes";
import {AlertContext} from "./hooks/alertContext";
import {FirebaseContext} from "./hooks/firebaseContext";
import {NotificationContext, NotificationType} from "./hooks/notificatonContext";
import {SettingsContext} from "./hooks/settingsContext";
import {SectionSelectionContext} from "./hooks/sectionSelectionContext";
import {
  ELEM_BOTTOM_MENU_ITEM_WLE_SETTINGS_ID,
  ELEM_LOGGED_IN_TOP_BAR_CONTAINER_ID,
  ELEM_LOGGED_IN_TOP_BAR_CONTAINER_ITEM_WLE_SELECTION_ID,
  ELEM_LOGGED_IN_TOP_BAR_CONTAINER_ITEM_WLE_SETTINGS_ID, ELEM_LOGGED_IN_TOP_BAR_CONTAINER_ITEM_WLE_SYNCHRONIZATION_ID,
  ELEM_MAIN_APP_ID,
  ELEM_PAGE_EXERCISE_EXPLORE_SECTIONS_TOOLBAR_CONTAINER_ID,
  ELEM_PAGE_EXERCISE_SECTIONS_TOOLBAR_CONTAINER_ID,
  ELEM_PERSONAL_MENU_ITEM_WLE_SELECTION_ID, ELEM_PERSONAL_MENU_ITEM_WLE_SYNCHRONIZATION_ID,
  ELEM_WL_BOTTOM_MENU_SELECTOR,
  ELEM_WL_LOGGED_IN_TOP_BAR_SELECTOR,
  ELEM_WL_PERSONAL_MENU_SELECTOR, LANG_NS_MAIN,
  PERSIST_KEY_CUSTOM_SELECTIONS_ACTIVE_EXERCISE,
  PERSIST_KEY_CUSTOM_SELECTIONS_ACTIVE_SECTIONS,
  PERSIST_KEY_CUSTOM_SELECTIONS_EXERCISES_STORAGE,
  PERSIST_KEY_CUSTOM_SELECTIONS_STORAGE,
  PERSIST_KEY_ENABLE_CUSTOM_SELECTIONS_SETTING,
  PERSIST_KEY_ENABLE_FIREBASE_SYNC_SETTING,
  PERSIST_KEY_ENABLE_LOAD_ALL_PAGES_SETTING,
  PERSIST_KEY_FIREBASE_CONFIG,
  PERSIST_KEY_FIREBASE_SYNC_CONF_SETTING,
  PERSIST_KEY_FIREBASE_UUID,
  PERSIST_KEY_LANGUAGE_SETTING,
  VAL_FIREBASE_SYNC_CUSTOM_SELECTIONS_EXERCISES_STORAGE_KEY, VAL_FIREBASE_SYNC_CUSTOM_SELECTIONS_STORAGE_KEY,
  VAL_FIREBASE_SYNC_SETTINGS_KEY, VAL_FIREBASE_SYNC_SHARED_KEY,
  VAL_FIREBASE_SYNC_UUID_KEY
} from "./constants";
import i18n, {getActiveLanguage} from "./i18n";
import {
  prepareExerciseExploreSectionPageToolbar,
  prepareExercisePageSections,
  prepareExercisePageToolbar
} from "./util/htmlPreparation";
import {
  verifyOnLoggedInPage,
  verifyOnPageExercise,
  verifyOnPageExerciseExploreSection,
  verifyOnPagePractice
} from "./util/locationVerification";
import {getCustomSelectionHashFromSelectionContext} from "./util/hashHandling";
import {
  filterCustomSelectionExerciseFromID,
  filterCustomSelectionFromExerciseID,
  filterCustomSelectionFromHash,
  getCustomSelectionExerciseFromID,
  getCustomSelectionFromHash,
  getCustomSelectionsFromExerciseID, propFilterCustomSelectionHash, propFilterElementID, propFilterSectionID
} from "./util/customSelectionHandling";
import {logNotification} from "./util/notification";
import {isDateToday} from "./util/dateHandling";
import {WordalistExerciseSectionCheckbox} from "./components/RadixCheckbox/WordalistExerciseSectionCheckbox";
import ExploreSectionsToolbar from "./components/Toolbar/ExporeSectionsToolbar";
import {NotificationContextType, NotificationOptionsType} from "./@types/notificationTypes";
import {FirebaseApp, FirebaseOptions, initializeApp} from "firebase/app";
import {DataSnapshot} from "firebase/database"
import {Database, DatabaseReference, get, getDatabase, ref, set, child, onValue} from "firebase/database"
import {ScriptStorage} from "./imported/pionxzh/util/storage";
import CustomSelectionToolbar from "./components/Toolbar/CustomSelectionsToolbar";
import {MainUserscriptComponent} from "./mainUserscriptComponent";
import {WordalistMenuPortal} from "./components/WordalistMenuPortal";
import {BookmarkIcon, GearIcon, UpdateIcon} from "@radix-ui/react-icons";
import "./index.css";

// Make sure document is ready before continuing
// Synchronously wait for Wordalist's personal menu and the bottom menu to exist in the DOM
// Items on a big screen
let wlPersonalMenuElement: Element | null = null;
let wlBottomMenuElement: Element | null = null;
if (!verifyOnPagePractice()) {
  try {
    wlPersonalMenuElement = synchronousWaitForElement(ELEM_WL_PERSONAL_MENU_SELECTOR);
    wlBottomMenuElement = synchronousWaitForElement(ELEM_WL_BOTTOM_MENU_SELECTOR);
  } catch (e) {
    console.warn(`Could not find element. Message: `, (e as Error).message);
  }
}
// Items on a phone (only modify where it's actually applicable)
let wlTopBarElement: Element | null = null;
if (verifyOnLoggedInPage() && !verifyOnPagePractice()) {
  try {
    wlTopBarElement = synchronousWaitForElement(ELEM_WL_LOGGED_IN_TOP_BAR_SELECTOR);
  } catch (e) {
    console.warn(`Could not find element. Message: `, (e as Error).message);
  }
}

// If there's a rerender, remove any duplicated portal components
removeDuplicatedComponent(ELEM_MAIN_APP_ID);
removeDuplicatedComponent(ELEM_PERSONAL_MENU_ITEM_WLE_SELECTION_ID);
removeDuplicatedComponent(ELEM_PERSONAL_MENU_ITEM_WLE_SYNCHRONIZATION_ID);
removeDuplicatedComponent(ELEM_BOTTOM_MENU_ITEM_WLE_SETTINGS_ID);
removeDuplicatedComponent(ELEM_LOGGED_IN_TOP_BAR_CONTAINER_ID);
// Page: Exercise
removeDuplicatedComponent(ELEM_PAGE_EXERCISE_SECTIONS_TOOLBAR_CONTAINER_ID);

// Prepare top bar container
if (verifyOnLoggedInPage() && !verifyOnPagePractice() && wlTopBarElement) {
  const topBarElement: HTMLDivElement = document.createElement("div");
  topBarElement.id = ELEM_LOGGED_IN_TOP_BAR_CONTAINER_ID;
  wlTopBarElement.append(topBarElement);
}

// Page specific preparations
// Page: Exercise
let wlPageExerciseToolbarContainerElement: Element;
let wlPageExerciseSectionsAddedIDs: CustomSelectionType[] = [];
const wlPageExerciseSectionsAddedPortals: VNode<unknown>[] = [];
if (verifyOnPageExercise()) {
  prepareExercisePageToolbar();
  wlPageExerciseToolbarContainerElement =
    synchronousWaitForElement(`#${ELEM_PAGE_EXERCISE_SECTIONS_TOOLBAR_CONTAINER_ID}`);

  wlPageExerciseSectionsAddedIDs = prepareExercisePageSections();
  wlPageExerciseSectionsAddedIDs.forEach(
    ({elementID, exerciseID, sectionID, exerciseTitle, sectionTitle}) => {
      const addedElement = synchronousWaitForElement(`#${elementID}`);
      wlPageExerciseSectionsAddedPortals.push(createPortal(
        <WordalistExerciseSectionCheckbox
          id={`${elementID}-checkbox`}
          exerciseID={exerciseID}
          sectionID={sectionID}
          exerciseTitle={exerciseTitle}
          sectionTitle={sectionTitle}
        />
        , addedElement));
    });
}
// Page: Exercise Explore Section
let wlPageExerciseExploreSectionToolbarContainerElement: Element;
if (verifyOnPageExerciseExploreSection()) {
  prepareExerciseExploreSectionPageToolbar();
  wlPageExerciseExploreSectionToolbarContainerElement =
    synchronousWaitForElement(`#${ELEM_PAGE_EXERCISE_EXPLORE_SECTIONS_TOOLBAR_CONTAINER_ID}`);
}

const UserscriptApp = () => {
  // Check storage
  const savedSettingLanguage: string | null =
    ScriptStorage.get<string>(PERSIST_KEY_LANGUAGE_SETTING);
  const savedSettingEnableCustomSelections: boolean | null =
    ScriptStorage.get<boolean>(PERSIST_KEY_ENABLE_CUSTOM_SELECTIONS_SETTING);
  const savedSettingEnableLoadAllPages: boolean | null =
    ScriptStorage.get<boolean>(PERSIST_KEY_ENABLE_LOAD_ALL_PAGES_SETTING);
  const savedSettingEnableFirebaseSync: boolean | null =
    ScriptStorage.get<boolean>(PERSIST_KEY_ENABLE_FIREBASE_SYNC_SETTING);
  const savedSettingFirebaseConf: string | null =
    ScriptStorage.get<string>(PERSIST_KEY_FIREBASE_SYNC_CONF_SETTING);

  // Check storage - Custom Sections Selection
  const savedCustomSelectionsActiveExercise: CustomSelectionExerciseType | null =
    ScriptStorage.get<CustomSelectionExerciseType>(PERSIST_KEY_CUSTOM_SELECTIONS_ACTIVE_EXERCISE);
  const savedCustomSelectionsActiveSections: CustomSelectionsActiveSectionsType | null =
    ScriptStorage.get<CustomSelectionsActiveSectionsType>(PERSIST_KEY_CUSTOM_SELECTIONS_ACTIVE_SECTIONS);

  // Check storage - Custom Selection Storage
  const savedCustomSelectionsExercisesStorage: CustomSelectionsExercisesStorageType | null =
    ScriptStorage.get<CustomSelectionsExercisesStorageType>(PERSIST_KEY_CUSTOM_SELECTIONS_EXERCISES_STORAGE);
  const savedCustomSelectionsStorage: CustomSelectionsStorageType | null =
    ScriptStorage.get<CustomSelectionsStorageType>(PERSIST_KEY_CUSTOM_SELECTIONS_STORAGE);

  // Check storage - Firebase Storage
  const savedFirebaseUUID: string | null =
    ScriptStorage.get<string>(PERSIST_KEY_FIREBASE_UUID);

  // Firebase
  const firebaseMakeUniqueId = async ({db}: { db: Database, app: FirebaseApp }):
    Promise<`${string}-${string}-${string}-${string}-${string}`> => {
    let uuid: `${string}-${string}-${string}-${string}-${string}` = crypto.randomUUID();
    let snapshot: DataSnapshot | undefined;

    const dbRef: DatabaseReference = ref(getDatabase());

    // See if UUID exists
    try {
      snapshot = await get(child(dbRef, `${VAL_FIREBASE_SYNC_UUID_KEY}/${uuid}`));
      while (snapshot.exists()) {
        uuid = crypto.randomUUID();
        snapshot = await get(child(dbRef, `${VAL_FIREBASE_SYNC_UUID_KEY}/${uuid}`));
      }
    } catch (error) {
      throw new Error("firebaseMakeUniqueId(): Could not check database");
    }

    // Save UUID
    try {
      await set(ref(db, `${VAL_FIREBASE_SYNC_UUID_KEY}/${uuid}`), {
        initiated: (new Date()).toISOString(),
        userAgent: window.navigator.userAgent // To differentiate UUIDs
      });
    } catch (error) {
      throw new Error("firebaseMakeUniqueId(): Could not write to database");
    }

    return uuid;
  };

  const [firebaseDialogueOpen, setFirebaseDialogueOpen]
    = useState<boolean>(false);
  const [firebaseUniqueId, setFirebaseUniqueId]
    = useState<string | null>(savedFirebaseUUID);
  const [firebaseConfig, setFirebaseConfig]
    = useState<FirebaseOptions | null>(null);
  const [firebaseApp, setFirebaseApp]
    = useState<FirebaseApp | null>(null);
  const [firebaseDb, setFirebaseDb]
    = useState<Database | null>(null);
  const [firebaseSyncedStatistics, setFirebaseSyncedStatistics] =
    useState<FirebaseSyncedStatisticsType>({});
  const [firebaseSyncedSettings, setFirebaseSyncedSettings] =
    useState<FirebaseSyncedSettingsType>({});
  const [firebaseSyncedExercisesStorage, setFirebaseSyncedExercisesStorage] =
    useState<FirebaseSyncedExercisesStorageType>([]);
  const [firebaseSyncedSelectionsStorage, setFirebaseSyncedSelectionsStorage] =
    useState<FirebaseSyncedSelectionsStorageType>([]);

  const firebaseState: FirebaseContextType = {
    dialogueOpen: firebaseDialogueOpen,
    uniqueId: firebaseUniqueId,
    config: firebaseConfig,
    app: firebaseApp,
    db: firebaseDb,
    syncedStatistics: firebaseSyncedStatistics,
    syncedSettings: firebaseSyncedSettings,
    syncedExercisesStorage: firebaseSyncedExercisesStorage,
    syncedSelectionsStorage: firebaseSyncedSelectionsStorage,
    openDialogue: () => {
      setFirebaseDialogueOpen(true);
    },
    closeDialogue: () => {
      setFirebaseDialogueOpen(false);
    },
    initiateUniqueId: async () => {
      if (!firebaseUniqueId) {
        if (!firebaseApp) {
          throw new Error("initiateUniqueId(): FirebaseContextType.app must be set!");
        }

        if (!firebaseDb) {
          throw new Error("initiateUniqueId(): FirebaseContextType.db must be set!");
        }

        try {
          const uuid: `${string}-${string}-${string}-${string}-${string}` =
            await firebaseMakeUniqueId({app: firebaseApp, db: firebaseDb});
          setFirebaseUniqueId(uuid);
        } catch (e) {
          // Reset Firebase settings, some error occurred
          setFirebaseConfig(null);
          setFirebaseApp(null);
          setFirebaseDb(null);

          // Clear storage
          ScriptStorage.delete(PERSIST_KEY_ENABLE_FIREBASE_SYNC_SETTING);
          ScriptStorage.delete(PERSIST_KEY_FIREBASE_SYNC_CONF_SETTING);
          ScriptStorage.delete(PERSIST_KEY_FIREBASE_CONFIG);
          ScriptStorage.delete(PERSIST_KEY_FIREBASE_UUID);
        }
      }
    },
    setConfig: (config: FirebaseOptions) => {
      const firebaseApp = initializeApp(config);
      const db = getDatabase(firebaseApp);
      setFirebaseConfig(config);
      setFirebaseApp(firebaseApp);
      setFirebaseDb(db);
    }
  };

  // Shared settings control
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsOptions, setSettingsOptions] =
    useState<SettingsOptionsType>({
      language: savedSettingLanguage ? savedSettingLanguage : getActiveLanguage(),
      enableCustomSelection: savedSettingEnableCustomSelections ? savedSettingEnableCustomSelections : false,
      enableLoadAllPages: savedSettingEnableLoadAllPages ? savedSettingEnableLoadAllPages : false,
      enableFirebaseSync: savedSettingEnableFirebaseSync ? savedSettingEnableFirebaseSync : false,
      firebaseConfig: savedSettingFirebaseConf ? savedSettingFirebaseConf : null
    });

  const optionsState: SettingContextType = {
    open: settingsOpen,
    options: settingsOptions,
    setOpen: () => {
      setSettingsOpen(true);
    },
    setClosed: () => {
      setSettingsOpen(false);
    },
    setOptions: (
      {
        language = getActiveLanguage(),
        enableCustomSelection = false,
        enableLoadAllPages = false,
        enableFirebaseSync = false,
        firebaseConfig = null
      }: SettingsOptionsType): void => {
      setSettingsOptions(
        {language, enableCustomSelection, enableLoadAllPages, enableFirebaseSync, firebaseConfig});
    }
  };

  // Shared notifications control
  const [notificationOptions, setNotificationOptions] =
    useState({
      title: "",
      text: "",
      type: NotificationType.NOTIFICATION,
      timeout: 5000,
      showClose: false
    });

  const notificationState: NotificationContextType = {
    options: notificationOptions,
    setOptions: (
      {
        title,
        text,
        type,
        timeout = 5000,
        showClose = false
      }: NotificationOptionsType) => {
      logNotification({title, text, type});
      setNotificationOptions({title, text, type, timeout, showClose});
    }
  };

  // Alert
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertOptions, setAlertOptions] =
    useState<AlertContextOptionsType>({
      title: "",
      text: "",
      okButtonText: "",
      cancelButtonText: "",
      okCallback: () => {
        return;
      },
      cancelCallback: () => {
        return;
      }
    });

  const alertState: AlertContextType = {
    open: alertOpen,
    options: alertOptions,
    setOpen: () => {
      setAlertOpen(true);
    },
    setClosed: () => {
      setAlertOpen(false);
    },
    setOptions: (alertOptions: AlertContextOptionsType): void => {
      setAlertOptions(alertOptions);
    }
  };

  // Custom Sections Selection
  const [customSectionsSelectedExercise,
    setCustomSectionsSelectedExercise] =
    useState<CustomSelectionExerciseType>(
      savedCustomSelectionsActiveExercise ?
        savedCustomSelectionsActiveExercise : {exerciseID: "", exerciseTitle: ""});

  const [customSectionsSelectedSectionIterator,
    setCustomSectionsSelectedSectionIterator] =
    useState(0);

  const [customSectionsSelectedSections,
    setCustomSectionsSelectedSections] =
    useState<CustomSelectionsActiveSectionsType>(
      savedCustomSelectionsActiveSections ?
        savedCustomSelectionsActiveSections : []);

  const [customSectionsSelectionHash,
    setCustomSectionsSelectionHash] =
    useState("");

  const [customSectionsSelectionStorageMatch,
    setCustomSectionsSelectionStorageMatch] =
    useState<OneCustomSelectionStorageType | null>(null);

  // Save Selections Dialogue
  const [customSectionsDialogueSaveSelectionsOpen,
    setCustomSectionsDialogueSaveSelectionsOpen] =
    useState(false);

  // Custom Selections Storage
  const [customSelectionsStorageDialogueOpen,
    setCustomSelectionsStorageDialogueOpen] =
    useState(false);

  const [customSelectionsExercisesStorage,
    setCustomSelectionsExercisesStorage] =
    useState<CustomSelectionsExercisesStorageType>(
      savedCustomSelectionsExercisesStorage ? savedCustomSelectionsExercisesStorage : []);

  const [customSelectionsStorage,
    setCustomSelectionsStorage] =
    useState<CustomSelectionsStorageType>(
      savedCustomSelectionsStorage ? savedCustomSelectionsStorage : []);

  const customSectionsState: SectionSelectionContextType = {
    selectedExercise: customSectionsSelectedExercise,
    selectedSectionIterator: customSectionsSelectedSectionIterator,
    selectedSections: customSectionsSelectedSections,
    selectionHash: customSectionsSelectionHash,
    selectionStorageMatch: customSectionsSelectionStorageMatch,
    dialogueSaveSelectionsOpen: customSectionsDialogueSaveSelectionsOpen,
    dialogueCustomSelectionsStorageOpen: customSelectionsStorageDialogueOpen,
    customSelectionsExercisesStorage: customSelectionsExercisesStorage,
    customSelectionsStorage: customSelectionsStorage,
    /* Save Selections Dialogue */
    setDialogueSaveSelectionsOpen: (): void => {
      setCustomSectionsDialogueSaveSelectionsOpen(true);
    },
    setDialogueSaveSelectionsClosed: (): void => {
      setCustomSectionsDialogueSaveSelectionsOpen(false);
    },
    /* Selections Storage */
    setDialogueCustomSelectionsStorageOpen: (): void => {
      setCustomSelectionsStorageDialogueOpen(true);
    },
    setDialogueCustomSelectionsStorageClosed: (): void => {
      setCustomSelectionsStorageDialogueOpen(false);
    },
    setInCustomSelectionsExercisesStorage: (
      {index = null, exerciseID, exerciseTitle}: CustomSelectionsExercisesStorageSetterType): void => {

      const currentIndex =
        index !== null && index !== undefined ? index : customSelectionsExercisesStorage.length;

      const existingCustomSelectionExercise =
        getCustomSelectionExerciseFromID({
          exerciseID: exerciseID,
          sectionSelectionContext: customSectionsState
        })

      let updatedExercisesStorage: CustomSelectionsExercisesStorageType;
      // How to update state
      if (!existingCustomSelectionExercise) {
        // First time appending exercise
        updatedExercisesStorage = [
          ...customSelectionsExercisesStorage,
          {index: currentIndex, exerciseID, exerciseTitle}
        ]
      } else {
        // Updating existing exercise
        updatedExercisesStorage = [
          ...filterCustomSelectionExerciseFromID({
            exerciseID,
            sectionSelectionContext: customSectionsState
          }),
          {index: currentIndex, exerciseID, exerciseTitle}
        ]
      }

      // Sort custom selection exercises storage by index
      updatedExercisesStorage.sort(
        function (a: CustomSelectionsOneExerciseStorageType, b: CustomSelectionsOneExerciseStorageType) {
          return a.index - b.index;
        });

      // Recount indices
      updatedExercisesStorage =
        updatedExercisesStorage.map(
          (oneCustomSelectionsExercise: CustomSelectionsOneExerciseStorageType, index: number):
          CustomSelectionsOneExerciseStorageType => {
            return {...oneCustomSelectionsExercise, index}
          });

      // Update state
      setCustomSelectionsExercisesStorage(updatedExercisesStorage);

    },
    setMultipleInCustomSelectionsExercisesStorage:
      ({customSelectionsExercisesStorageSetters, resetStorage}:
         MultipleCustomSelectionsExercisesStorageSetterType): void => {

        const appendedToStorage: CustomSelectionsExercisesStorageType = [];
        let filteredFromExistingCustomSelectionsExercises: CustomSelectionsExercisesStorageType =
          customSectionsState.customSelectionsExercisesStorage;

        customSelectionsExercisesStorageSetters.forEach(
          ({index, exerciseID, exerciseTitle}) => {

            const currentIndex = index !== null && index !== undefined ?
              index : customSelectionsExercisesStorage.length;
            const existingCustomSelectionExercise =
              getCustomSelectionExerciseFromID({
                exerciseID: exerciseID,
                sectionSelectionContext: customSectionsState
              })

            // Add
            appendedToStorage.push({index: currentIndex, exerciseID, exerciseTitle});
            if (!resetStorage && existingCustomSelectionExercise) {
              // Update filter
              filteredFromExistingCustomSelectionsExercises = filterCustomSelectionExerciseFromID({
                exerciseID,
                sectionSelectionContext: {
                  customSelectionsExercisesStorage: filteredFromExistingCustomSelectionsExercises
                }
              });
            }

          });

        let updatedExercisesStorage: CustomSelectionsExercisesStorageType;

        if (resetStorage) {
          updatedExercisesStorage = [
            ...appendedToStorage
          ];
        } else {
          updatedExercisesStorage = [
            ...filteredFromExistingCustomSelectionsExercises,
            ...appendedToStorage
          ];
        }

        // Sort custom selection exercises storage by index
        updatedExercisesStorage.sort(
          function (a: CustomSelectionsOneExerciseStorageType, b: CustomSelectionsOneExerciseStorageType) {
            return a.index - b.index;
          });

        // Recount indices
        updatedExercisesStorage =
          updatedExercisesStorage.map(
            (oneCustomSelectionsExercise: CustomSelectionsOneExerciseStorageType, index: number):
            CustomSelectionsOneExerciseStorageType => {
              return {...oneCustomSelectionsExercise, index}
            });

        // Update state
        setCustomSelectionsExercisesStorage(updatedExercisesStorage);

      },
    deleteFromCustomSelectionsExercisesStorage: ({exerciseID}) => {
      // Update Exercises
      setCustomSelectionsExercisesStorage(
        filterCustomSelectionExerciseFromID({
          exerciseID,
          sectionSelectionContext: customSectionsState
        }));

      // Update Sections
      setCustomSelectionsStorage(
        filterCustomSelectionFromExerciseID({
          exerciseID,
          sectionSelectionContext: customSectionsState
        }));

    },
    setInCustomSelectionsStorage: (
      {index = null, name, exerciseID, sections, practicesTotal, practicesToday, lastPracticed}:
        CustomSelectionsStorageSetterType): void => {
      const currentIndex = index !== null && index !== undefined ? index : customSelectionsStorage.length;
      const customSelectionHash = getCustomSelectionHashFromSelectionContext({
        selectedExercise: {exerciseID},
        selectedSections: sections
      });

      const existingCustomSelection: OneCustomSelectionStorageType | null =
        getCustomSelectionFromHash({
          hash: customSelectionHash,
          sectionSelectionContext: customSectionsState
        })

      // Sort new/updated sections
      sections.sort(function (
        a: CustomSelectionsOneActiveSectionType, b: CustomSelectionsOneActiveSectionType) {
        return a.index - b.index;
      });

      // Recount indices
      sections =
        sections.map(
          (oneCustomSelectionsActiveSection: CustomSelectionsOneActiveSectionType, index: number):
          CustomSelectionsOneActiveSectionType => {
            return {...oneCustomSelectionsActiveSection, index}
          });

      let updatedStorage: CustomSelectionsStorageType;
      // How to update state
      if (!existingCustomSelection) {
        // First time appending selection
        updatedStorage = [
          ...customSelectionsStorage,
          {
            index: currentIndex,
            hash: customSelectionHash,
            name,
            exerciseID,
            sections,
            practicesTotal,
            practicesToday,
            lastPracticed
          }
        ]
      } else {
        // Updating existing selection
        updatedStorage = [
          ...filterCustomSelectionFromHash({
            hash: customSelectionHash,
            sectionSelectionContext: customSectionsState
          }),
          {
            index: currentIndex,
            hash: customSelectionHash,
            name,
            exerciseID,
            sections,
            practicesTotal,
            practicesToday,
            lastPracticed
          }
        ]
      }

      // Sort custom selection storage by index
      updatedStorage.sort(function (a: OneCustomSelectionStorageType, b: OneCustomSelectionStorageType) {
        return a.index - b.index;
      });

      // Recount indices
      updatedStorage =
        updatedStorage.map(
          (oneCustomSelectionStorage: OneCustomSelectionStorageType, index: number):
          OneCustomSelectionStorageType => {
            return {...oneCustomSelectionStorage, index}
          });

      // Update state
      setCustomSelectionsStorage(updatedStorage);

    },
    setMultipleInCustomSelectionsStorage:
      ({customSelectionsStorageSetters, resetStorage}:
         MultipleCustomSelectionsStorageSetterType) => {
        const appendedToStorage: CustomSelectionsStorageType = [];
        let filteredFromExistingCustomSelections: CustomSelectionsStorageType =
          customSectionsState.customSelectionsStorage;

        customSelectionsStorageSetters.forEach(
          ({exerciseID, sections, name, index, practicesTotal, practicesToday, lastPracticed}:
             CustomSelectionsStorageSetterType, forEachIndex) => {
            const currentIndex = index !== null && index !== undefined ?
              index : customSelectionsStorage.length + forEachIndex;
            const customSelectionHash = getCustomSelectionHashFromSelectionContext({
              selectedExercise: {exerciseID},
              selectedSections: sections
            });

            const existingCustomSelection =
              getCustomSelectionFromHash({
                hash: customSelectionHash,
                sectionSelectionContext: customSectionsState
              })

            // Sort new/updated sections
            sections.sort(function (
              a: CustomSelectionsOneActiveSectionType, b: CustomSelectionsOneActiveSectionType) {
              return a.index - b.index;
            });

            // Recount indices
            sections =
              sections.map(
                (oneCustomSelectionsActiveSection: CustomSelectionsOneActiveSectionType, index: number):
                CustomSelectionsOneActiveSectionType => {
                  return {...oneCustomSelectionsActiveSection, index}
                });

            // Add
            const entryToAppend: OneCustomSelectionStorageType = {
              index: currentIndex,
              hash: customSelectionHash,
              name,
              exerciseID,
              sections
            };

            if (practicesTotal) {
              entryToAppend.practicesTotal = practicesTotal;
            }

            if (practicesToday) {
              entryToAppend.practicesToday = practicesToday;
            }

            if (lastPracticed) {
              entryToAppend.lastPracticed = lastPracticed;
            }

            appendedToStorage.push(entryToAppend);
            if (!resetStorage && existingCustomSelection) {
              // Update filter
              filteredFromExistingCustomSelections = filterCustomSelectionFromHash({
                hash: customSelectionHash,
                sectionSelectionContext: {customSelectionsStorage: filteredFromExistingCustomSelections}
              });
            }

          });

        let updatedStorage: CustomSelectionsStorageType;

        if (resetStorage) {
          updatedStorage = [
            ...appendedToStorage
          ];
        } else {
          updatedStorage = [
            ...filteredFromExistingCustomSelections,
            ...appendedToStorage
          ];
        }

        // Sort custom selection storage by index
        updatedStorage.sort(function (a: OneCustomSelectionStorageType, b: OneCustomSelectionStorageType) {
          return a.index - b.index;
        });

        // Recount indices
        updatedStorage =
          updatedStorage.map(
            (oneCustomSelectionStorage: OneCustomSelectionStorageType, index: number):
            OneCustomSelectionStorageType => {
              return {...oneCustomSelectionStorage, index}
            });

        // Update state
        setCustomSelectionsStorage(updatedStorage);

      },
    deleteFromCustomSelectionsStorage: ({hash}) => {

      // Just one section left (that will be removed)
      // Then also delete exercise
      const exerciseID = getCustomSelectionFromHash({
        hash,
        sectionSelectionContext: customSectionsState
      })?.exerciseID
      if (exerciseID && getCustomSelectionsFromExerciseID({
        exerciseID,
        sectionSelectionContext: customSectionsState
      }).length === 1) {
        // Update Exercises
        setCustomSelectionsExercisesStorage(
          filterCustomSelectionExerciseFromID({
            exerciseID,
            sectionSelectionContext: customSectionsState
          }));
      }

      // Update Sections
      setCustomSelectionsStorage(
        filterCustomSelectionFromHash({
          hash,
          sectionSelectionContext: customSectionsState
        }));
    },
    setInCustomSelectionSectionsStorage: (
      {hash, index, sectionID, sectionTitle}) => {
      const customSelection =
        getCustomSelectionFromHash({hash, sectionSelectionContext: customSectionsState});

      if (customSelection) {
        const currentIndex = index !== null && index !== undefined ? index : customSelection.sections.length;

        const existingCustomSelectionSection =
          customSelection?.sections.filter(propFilterSectionID(sectionID));

        let updatedSectionsStorage: CustomSelectionSectionsType;
        if (!existingCustomSelectionSection || existingCustomSelectionSection.length === 0) {
          // First time appending selection
          updatedSectionsStorage = [
            ...customSelection.sections,
            {
              index: currentIndex,
              sectionID,
              sectionTitle
            }
          ]
        } else {
          // Updating existing selection
          updatedSectionsStorage = [
            ...customSelection.sections.filter(propFilterSectionID(sectionID)),
            {
              index: currentIndex,
              sectionID,
              sectionTitle
            }
          ]
        }

        // Sort new/updated sections
        updatedSectionsStorage.sort(function (
          a: OneCustomSelectionSectionType, b: OneCustomSelectionSectionType) {
          return a.index - b.index;
        });

        // Recount indices
        updatedSectionsStorage =
          updatedSectionsStorage.map(
            (oneCustomSelectionSection: OneCustomSelectionSectionType, index: number):
            OneCustomSelectionSectionType => {
              return {...oneCustomSelectionSection, index}
            });

        // Update custom selection and its hash
        const updatedCustomSelectionHash = getCustomSelectionHashFromSelectionContext({
          selectedExercise: {exerciseID: customSelection.exerciseID},
          selectedSections: updatedSectionsStorage
        });

        let updatedCustomSelectionsStorage: CustomSelectionsStorageType = [
          ...filterCustomSelectionFromHash({
            hash: hash,
            sectionSelectionContext: customSectionsState
          }),
          {
            ...customSelection,
            sections: updatedSectionsStorage,
            hash: updatedCustomSelectionHash
          }
        ]

        // Sort custom selection storage by index
        updatedCustomSelectionsStorage.sort(
          function (a: OneCustomSelectionStorageType, b: OneCustomSelectionStorageType) {
            return a.index - b.index;
          });

        // Recount indices
        updatedCustomSelectionsStorage =
          updatedCustomSelectionsStorage.map(
            (oneCustomSelectionStorage: OneCustomSelectionStorageType, index: number):
            OneCustomSelectionStorageType => {
              return {...oneCustomSelectionStorage, index}
            });

        // Update state
        setCustomSelectionsStorage(updatedCustomSelectionsStorage);

      }

    },
    setMultipleInCustomSelectionSectionsStorage: (customSelectionsSectionStorageSetters) => {
      // Get custom selections to update
      const uniqueHashes: string[] =
        customSelectionsSectionStorageSetters
          .map(
            ({hash}: { hash: string }) => hash)
          .filter(
            (hash: string, index: number, array: string[]) => array.indexOf(hash) === index);

      const customSelectionsToUpdate: CustomSelectionsStorageType = [];

      uniqueHashes.forEach((hash: string) => {
        const customSelection =
          getCustomSelectionFromHash({hash, sectionSelectionContext: customSectionsState});
        if (customSelection) {
          customSelectionsToUpdate.push(customSelection);
        }
      })

      const appendedToStorage: CustomSelectionsStorageType = [];
      let filteredFromExistingCustomSelections: CustomSelectionsStorageType =
        customSectionsState.customSelectionsStorage;

      // Go through all custom selections
      customSelectionsToUpdate.forEach((customSelection) => {

        // Get all sections to update for custom selection
        const customSelectionSectionsToUpdate: CustomSelectionsSectionStorageSetterType[] =
          customSelectionsSectionStorageSetters.filter(propFilterCustomSelectionHash(customSelection.hash))

        const appendedToSections: CustomSelectionSectionsType = [];
        let filteredFromExistingSections: CustomSelectionSectionsType = customSelection.sections;

        // Go through all sections to update
        customSelectionSectionsToUpdate.forEach(
          ({index, sectionID, sectionTitle}) => {
            const currentIndex =
              index !== null && index !== undefined ? index : customSelection.sections.length;

            const existingCustomSelectionSection =
              customSelection?.sections.filter(propFilterSectionID(sectionID));

            // Add section
            appendedToSections.push({
              index: currentIndex,
              sectionID,
              sectionTitle
            });

            // Filter if already existing
            if (existingCustomSelectionSection) {
              // Update filter
              filteredFromExistingSections = filteredFromExistingSections.filter(propFilterSectionID(sectionID));
            }

          });

        let updatedSectionsStorage: CustomSelectionSectionsType = [
          ...filteredFromExistingSections,
          ...appendedToSections
        ]

        // Sort new/updated sections
        updatedSectionsStorage.sort(function (
          a: OneCustomSelectionSectionType, b: OneCustomSelectionSectionType) {
          return a.index - b.index;
        });

        // Recount indices
        updatedSectionsStorage =
          updatedSectionsStorage.map(
            (oneCustomSelectionSection: OneCustomSelectionSectionType, index: number):
            OneCustomSelectionSectionType => {
              return {...oneCustomSelectionSection, index}
            });

        // Update custom selections and their hashes
        const updatedCustomSelectionHash = getCustomSelectionHashFromSelectionContext({
          selectedExercise: {exerciseID: customSelection.exerciseID},
          selectedSections: updatedSectionsStorage
        });

        const existingCustomSelection =
          getCustomSelectionFromHash({
            hash: customSelection.hash,
            sectionSelectionContext: customSectionsState
          })

        // Add
        appendedToStorage.push({
          ...customSelection,
          hash: updatedCustomSelectionHash,
          sections: updatedSectionsStorage
        });
        if (existingCustomSelection) {
          // Update filter
          filteredFromExistingCustomSelections = filterCustomSelectionFromHash({
            hash: customSelection.hash,
            sectionSelectionContext: {customSelectionsStorage: filteredFromExistingCustomSelections}
          });
        }
      })

      let updatedStorage: CustomSelectionsStorageType = [
        ...filteredFromExistingCustomSelections,
        ...appendedToStorage
      ]

      // Sort custom selection storage by index
      updatedStorage.sort(function (a: OneCustomSelectionStorageType, b: OneCustomSelectionStorageType) {
        return a.index - b.index;
      });

      // Recount indices
      updatedStorage =
        updatedStorage.map(
          (oneCustomSelectionStorage: OneCustomSelectionStorageType, index: number):
          OneCustomSelectionStorageType => {
            return {...oneCustomSelectionStorage, index}
          });

      // Update state
      setCustomSelectionsStorage(updatedStorage);

    },
    deleteFromCustomSelectionSectionsStorage: ({hash, sectionID}) => {
      const customSelection =
        getCustomSelectionFromHash({hash, sectionSelectionContext: customSectionsState});

      if (customSelection) {
        const updatedSections =
          customSelection.sections.filter(propFilterSectionID(sectionID))

        // Something was removed
        if (customSelection.sections.length !== updatedSections.length) {

          // Fix custom selection so it includes necessary info

          const customSelectionFixedSections: OneCustomSelectionStorageType = {
            ...customSelection,
            sections: updatedSections
          };

          // Sort new/updated sections
          customSelectionFixedSections.sections.sort(function (
            a: OneCustomSelectionSectionType, b: OneCustomSelectionSectionType) {
            return a.index - b.index;
          });

          // Recount indices
          customSelectionFixedSections.sections =
            customSelectionFixedSections.sections.map(
              (oneCustomSelectionSection: OneCustomSelectionSectionType, index: number):
              OneCustomSelectionSectionType => {
                return {...oneCustomSelectionSection, index}
              });

          // Update custom selection and its hash
          const updatedCustomSelectionHash = getCustomSelectionHashFromSelectionContext({
            selectedExercise: {exerciseID: customSelectionFixedSections.exerciseID},
            selectedSections: customSelectionFixedSections.sections
          });

          let updatedStorage: CustomSelectionsStorageType = [
            ...filterCustomSelectionFromHash({
              hash: hash,
              sectionSelectionContext: customSectionsState
            }),
            {
              ...customSelectionFixedSections,
              hash: updatedCustomSelectionHash
            }
          ]

          // Sort custom selection storage by index
          updatedStorage.sort(function (a: OneCustomSelectionStorageType, b: OneCustomSelectionStorageType) {
            return a.index - b.index;
          });

          // Recount indices
          updatedStorage =
            updatedStorage.map(
              (oneCustomSelectionStorage: OneCustomSelectionStorageType, index: number):
              OneCustomSelectionStorageType => {
                return {...oneCustomSelectionStorage, index}
              });

          // Update state
          setCustomSelectionsStorage(updatedStorage);

        }

      }

    },
    updateLastPracticedInCustomSelectionsStorage: ({hash}) => {
      const existingCustomSelection =
        getCustomSelectionFromHash({
          hash: hash,
          sectionSelectionContext: customSectionsState
        });

      if (existingCustomSelection) {
        const currentTimestamp = (new Date()).toISOString();

        // Update timestamp and number of practices
        existingCustomSelection.practicesTotal =
          existingCustomSelection.practicesTotal ? existingCustomSelection.practicesTotal + 1 : 1;

        if (!existingCustomSelection.lastPracticed || !existingCustomSelection.practicesToday) {
          existingCustomSelection.practicesToday = 1;
        } else {
          if (!isDateToday(new Date(existingCustomSelection.lastPracticed))) {
            existingCustomSelection.practicesToday = 1;
          } else {
            existingCustomSelection.practicesToday += 1;
          }
        }

        existingCustomSelection.lastPracticed = currentTimestamp;

        // Updating existing selection
        const updatedStorage = [
          ...filterCustomSelectionFromHash({
            hash: hash,
            sectionSelectionContext: customSectionsState
          }),
          existingCustomSelection
        ]

        // Sort custom selection storage by index
        updatedStorage.sort(function (a: OneCustomSelectionStorageType, b: OneCustomSelectionStorageType) {
          return a.index - b.index;
        });

        // Update state
        setCustomSelectionsStorage(updatedStorage);

      }

    },
    getCustomSelectionsStatistics: ({hash}) => {
      const existingCustomSelection =
        getCustomSelectionFromHash({
          hash: hash,
          sectionSelectionContext: customSectionsState
        });

      if (existingCustomSelection) {
        return {
          lastPracticed: existingCustomSelection.lastPracticed ? existingCustomSelection.lastPracticed : null,
          practicesToday: existingCustomSelection.practicesToday ? existingCustomSelection.practicesToday : 0,
          practicesTotal: existingCustomSelection.practicesTotal ? existingCustomSelection.practicesTotal : 0
        }
      }
      return {
        lastPracticed: null,
        practicesToday: 0,
        practicesTotal: 0
      };
    },
    /* Selections */
    reset: () => {
      setCustomSectionsSelectedExercise({exerciseID: "", exerciseTitle: ""});
      setCustomSectionsSelectedSectionIterator(0);
      setCustomSectionsSelectedSections([]);
    },
    resetAndAddToSelectedSections: ({elementID, sectionID, sectionTitle}: CustomSelectionSectionAdditionType) => {
      setCustomSectionsSelectedSections([{index: 0, elementID, sectionID, sectionTitle}]);
      setCustomSectionsSelectedSectionIterator(1);
    },
    setSelectedExercise: (props: CustomSelectionExerciseType) => {
      setCustomSectionsSelectedExercise(props);
    },
    addToSelectedSections: ({elementID, sectionID, sectionTitle}: CustomSelectionSectionAdditionType) => {
      const updatedCustomSectionsSelectedSections = [
        ...customSectionsSelectedSections,
        {index: customSectionsSelectedSectionIterator, elementID, sectionID, sectionTitle}
      ];
      setCustomSectionsSelectedSections(updatedCustomSectionsSelectedSections);
      setCustomSectionsSelectedSectionIterator(customSectionsSelectedSectionIterator + 1);
    },
    setMultipleSelectedSections: (customSelectionSectionAdditions) => {
      setCustomSectionsSelectedSections(customSelectionSectionAdditions);
      setCustomSectionsSelectedSectionIterator(customSelectionSectionAdditions.length);
    },
    removeFromSelectedSections: ({elementID}: CustomSelectionRemoveSectionType) => {
      const updatedCustomSectionsSelectedSections =
        customSectionsSelectedSections.filter(propFilterElementID(elementID));
      setCustomSectionsSelectedSections(updatedCustomSectionsSelectedSections);
    }
  };

  /* Settings */
  useEffect(() => {
    // Update storage
    if (settingsOptions.language) {
      ScriptStorage.set(PERSIST_KEY_LANGUAGE_SETTING, settingsOptions.language);
    } else {
      ScriptStorage.delete(PERSIST_KEY_LANGUAGE_SETTING);
    }

    if (settingsOptions.enableCustomSelection) {
      ScriptStorage.set(PERSIST_KEY_ENABLE_CUSTOM_SELECTIONS_SETTING, settingsOptions.enableCustomSelection);
    } else {
      ScriptStorage.delete(PERSIST_KEY_ENABLE_CUSTOM_SELECTIONS_SETTING);
    }

    if (settingsOptions.enableLoadAllPages) {
      ScriptStorage.set(PERSIST_KEY_ENABLE_LOAD_ALL_PAGES_SETTING, settingsOptions.enableLoadAllPages);
    } else {
      ScriptStorage.delete(PERSIST_KEY_ENABLE_LOAD_ALL_PAGES_SETTING);
    }

    if (settingsOptions.enableFirebaseSync) {
      ScriptStorage.set(PERSIST_KEY_ENABLE_FIREBASE_SYNC_SETTING, settingsOptions.enableFirebaseSync);
    } else {
      ScriptStorage.delete(PERSIST_KEY_ENABLE_FIREBASE_SYNC_SETTING);
    }

    if (settingsOptions.firebaseConfig) {
      ScriptStorage.set(PERSIST_KEY_FIREBASE_SYNC_CONF_SETTING, settingsOptions.firebaseConfig);
    } else {
      ScriptStorage.delete(PERSIST_KEY_FIREBASE_SYNC_CONF_SETTING);
    }

  }, [settingsOptions]);

  /* Hash generation */
  useEffect(() => {
    const hash = getCustomSelectionHashFromSelectionContext({
      selectedExercise: customSectionsSelectedExercise,
      selectedSections: customSectionsSelectedSections
    });

    const existingCustomSelection: OneCustomSelectionStorageType | null =
      getCustomSelectionFromHash({
        hash,
        sectionSelectionContext: {customSelectionsStorage: customSelectionsStorage}
      });

    if (existingCustomSelection) {
      setCustomSectionsSelectionStorageMatch(existingCustomSelection);
    } else {
      setCustomSectionsSelectionStorageMatch(null);
    }

    setCustomSectionsSelectionHash(hash);
  }, [customSectionsSelectedExercise, customSectionsSelectedSections, customSelectionsStorage]);

  /* Selections Storage */
  useEffect(() => {
    // Update storage
    if (customSelectionsExercisesStorage.length === 0) {
      ScriptStorage.delete(PERSIST_KEY_CUSTOM_SELECTIONS_EXERCISES_STORAGE);
    } else {
      ScriptStorage.set(PERSIST_KEY_CUSTOM_SELECTIONS_EXERCISES_STORAGE, customSelectionsExercisesStorage);
    }
  }, [customSelectionsExercisesStorage]);

  useEffect(() => {
    // Update storage
    if (customSelectionsStorage.length === 0) {
      ScriptStorage.delete(PERSIST_KEY_CUSTOM_SELECTIONS_STORAGE);
    } else {
      ScriptStorage.set(PERSIST_KEY_CUSTOM_SELECTIONS_STORAGE, customSelectionsStorage);
    }
  }, [customSelectionsStorage]);

  /* Selections */
  useEffect(() => {
    // Update storage
    if (customSectionsSelectedSections.length === 0) {
      ScriptStorage.delete(PERSIST_KEY_CUSTOM_SELECTIONS_ACTIVE_SECTIONS);
    } else {
      ScriptStorage.set(PERSIST_KEY_CUSTOM_SELECTIONS_ACTIVE_SECTIONS, customSectionsSelectedSections);
    }
  }, [customSectionsSelectedSections]);

  useEffect(() => {
    // Update storage
    if (customSectionsSelectedExercise.exerciseID.length === 0) {
      ScriptStorage.delete(PERSIST_KEY_CUSTOM_SELECTIONS_ACTIVE_EXERCISE);
    } else {
      ScriptStorage.set(PERSIST_KEY_CUSTOM_SELECTIONS_ACTIVE_EXERCISE, customSectionsSelectedExercise);
    }

  }, [customSectionsSelectedExercise]);

  /* Firebase */
  // - Initiate saved firebase config
  useEffect(() => {
    // Initiate config if it is saved
    const savedFirebaseConf: FirebaseOptions | null = ScriptStorage.get<FirebaseOptions>(PERSIST_KEY_FIREBASE_CONFIG);
    if (!firebaseApp && !firebaseDb) {
      if (savedFirebaseConf) {
        firebaseState.setConfig(savedFirebaseConf);
      }
    }

  }, []);

  // - Make new UUID for firebase connectivity
  useEffect(() => {
    if (firebaseConfig && firebaseApp && firebaseDb && firebaseUniqueId) {
      const sharedSettingsRef: DatabaseReference
        = ref(firebaseDb, `${VAL_FIREBASE_SYNC_SETTINGS_KEY}/${VAL_FIREBASE_SYNC_SHARED_KEY}`);
      onValue(sharedSettingsRef, (snapshot) => {
        const data: FirebaseSyncedSettingsType = snapshot.val();
        if (data) {
          setFirebaseSyncedSettings(data);
        }
      });

      const sharedCustomSelectionsExercisesRef: DatabaseReference
        = ref(firebaseDb, `${VAL_FIREBASE_SYNC_CUSTOM_SELECTIONS_EXERCISES_STORAGE_KEY}/${VAL_FIREBASE_SYNC_SHARED_KEY}`);
      onValue(sharedCustomSelectionsExercisesRef, (snapshot) => {
        const data: FirebaseSyncedExercisesStorageType = snapshot.val();
        if (data) {
          setFirebaseSyncedExercisesStorage(data);
        }
      });

      const sharedCustomSelectionsRef: DatabaseReference
        = ref(firebaseDb, `${VAL_FIREBASE_SYNC_CUSTOM_SELECTIONS_STORAGE_KEY}/${VAL_FIREBASE_SYNC_SHARED_KEY}`);
      onValue(sharedCustomSelectionsRef, (snapshot) => {
        const data: FirebaseSyncedSelectionsStorageType = snapshot.val();
        if (data) {
          setFirebaseSyncedSelectionsStorage(data);
        }
      });

      // Custom Selections Storage Sync
      const customSelectionsStorageRef
        = ref(firebaseDb, `${VAL_FIREBASE_SYNC_CUSTOM_SELECTIONS_STORAGE_KEY}`);
      onValue(customSelectionsStorageRef, (snapshot) => {
        const data: Record<string, CustomSelectionsStorageType> = snapshot.val();

        if (data) {
          // Sync Statistics
          const syncedStatistics: FirebaseSyncedStatisticsType = {};
          Object.keys(data).filter((key) =>
            ![firebaseUniqueId, VAL_FIREBASE_SYNC_SHARED_KEY].includes(key)).forEach(
            (uuid) => {
              data[uuid].forEach((
                {
                  hash,
                  lastPracticed,
                  practicesToday,
                  practicesTotal
                }) => {

                const curStatistics: CustomSelectionStatisticsType =
                  hash in syncedStatistics ? syncedStatistics[hash] : {
                    lastPracticed: null,
                    practicesToday: 0,
                    practicesTotal: 0
                  }

                // Update lastPracticed
                if (!curStatistics.lastPracticed && lastPracticed ||
                  curStatistics.lastPracticed && lastPracticed &&
                  (new Date(lastPracticed)).getDate() > (new Date(curStatistics.lastPracticed)).getDate()) {
                  curStatistics.lastPracticed = lastPracticed
                }

                // Last practice is today, update practicesToday
                if (lastPracticed && isDateToday(new Date(lastPracticed)) && practicesToday) {
                  curStatistics.practicesToday += practicesToday;
                }

                // Update practicesTotal
                if (practicesTotal) {
                  curStatistics.practicesTotal += practicesTotal;
                }

                // Add/Set synced statistics
                syncedStatistics[hash] = curStatistics;
              });
            });
          // Set synced statistic
          setFirebaseSyncedStatistics(syncedStatistics);
        }
      });

    } else if (firebaseConfig && firebaseApp && firebaseDb) {
      // Set UUID
      firebaseState.initiateUniqueId();
    }

  }, [firebaseConfig, firebaseApp, firebaseDb, firebaseUniqueId]);

  // - Save new UUID
  useEffect(() => {
    // Update storage
    if (!firebaseUniqueId || firebaseUniqueId.length === 0) {
      ScriptStorage.delete(PERSIST_KEY_FIREBASE_UUID);
    } else {
      ScriptStorage.set(PERSIST_KEY_FIREBASE_UUID, firebaseUniqueId);
    }

  }, [firebaseUniqueId]);

  // - Settings Saver
  useEffect(() => {
    if (firebaseDb && firebaseUniqueId) {
      const dataToSave: SettingsOptionsType = {
        language: settingsOptions.language
      };
      set(ref(firebaseDb, `${VAL_FIREBASE_SYNC_SETTINGS_KEY}/${firebaseUniqueId}`), dataToSave);
    }

  }, [settingsOptions.language]);

  // - Custom Selections Exercises Storage Saver
  useEffect(() => {
    if (firebaseDb && firebaseUniqueId) {
      set(ref(firebaseDb, `${VAL_FIREBASE_SYNC_CUSTOM_SELECTIONS_EXERCISES_STORAGE_KEY}/${firebaseUniqueId}`),
        customSelectionsExercisesStorage);
    }

  }, [customSelectionsExercisesStorage]);

  // - Custom Selections Storage Saver
  useEffect(() => {
    if (firebaseDb && firebaseUniqueId) {
      set(ref(firebaseDb, `${VAL_FIREBASE_SYNC_CUSTOM_SELECTIONS_STORAGE_KEY}/${firebaseUniqueId}`),
        customSelectionsStorage);
    }

  }, [customSelectionsStorage]);

  return (
    <FirebaseContext.Provider value={firebaseState}>
      <NotificationContext.Provider value={notificationState}>
        <AlertContext.Provider value={alertState}>
          <SettingsContext.Provider value={optionsState}>
            <SectionSelectionContext.Provider value={customSectionsState}>
              <MainUserscriptComponent/>
              {wlTopBarElement && verifyOnLoggedInPage() && !verifyOnPagePractice() && createPortal(
                <ul className="TopBarContainer">
                  <SettingsContext.Consumer>
                    {(settingsContext) => (
                      <WordalistMenuPortal
                        id={ELEM_LOGGED_IN_TOP_BAR_CONTAINER_ITEM_WLE_SETTINGS_ID}
                        onClickCallback={() => {
                          settingsContext.setOpen();
                        }}>
                        <GearIcon/>
                      </WordalistMenuPortal>
                    )}
                  </SettingsContext.Consumer>
                  {settingsOptions.enableCustomSelection && (
                    <SectionSelectionContext.Consumer>
                      {(sectionSelectionContext) => (
                        <WordalistMenuPortal
                          id={ELEM_LOGGED_IN_TOP_BAR_CONTAINER_ITEM_WLE_SELECTION_ID}
                          onClickCallback={() => {
                            sectionSelectionContext.setDialogueCustomSelectionsStorageOpen();
                          }}>
                          <BookmarkIcon/>
                        </WordalistMenuPortal>
                      )}
                    </SectionSelectionContext.Consumer>
                  )}
                  {settingsOptions.enableFirebaseSync && (
                    <FirebaseContext.Consumer>
                      {(firebaseContext) => (
                        <WordalistMenuPortal
                          id={ELEM_LOGGED_IN_TOP_BAR_CONTAINER_ITEM_WLE_SYNCHRONIZATION_ID}
                          onClickCallback={() => {
                            firebaseContext.openDialogue();
                          }}>
                          <UpdateIcon/>
                        </WordalistMenuPortal>
                      )}
                    </FirebaseContext.Consumer>
                  )}
                </ul>, wlTopBarElement)}
              {settingsOptions.enableCustomSelection && !verifyOnPagePractice() && wlPersonalMenuElement && createPortal(
                <SectionSelectionContext.Consumer>
                  {(sectionSelectionContext) => (
                    <WordalistMenuPortal
                      id={ELEM_PERSONAL_MENU_ITEM_WLE_SELECTION_ID}
                      onClickCallback={sectionSelectionContext.setDialogueCustomSelectionsStorageOpen}>
                      {i18n.t(`${LANG_NS_MAIN}:menuWLESelection`)}
                    </WordalistMenuPortal>
                  )}
                </SectionSelectionContext.Consumer>, wlPersonalMenuElement)}
              {settingsOptions.enableFirebaseSync && !verifyOnPagePractice() && wlPersonalMenuElement && createPortal(
                <FirebaseContext.Consumer>
                  {(firebaseContext) => (
                    <WordalistMenuPortal
                      id={ELEM_PERSONAL_MENU_ITEM_WLE_SYNCHRONIZATION_ID}
                      onClickCallback={() => {
                        firebaseContext.openDialogue();
                      }}>
                      {i18n.t(`${LANG_NS_MAIN}:menuWLESynchronization`)}
                    </WordalistMenuPortal>
                  )}
                </FirebaseContext.Consumer>, wlPersonalMenuElement)}
              {!verifyOnPagePractice() && wlBottomMenuElement && createPortal(
                <SettingsContext.Consumer>
                  {(settingsContext) => (
                    <WordalistMenuPortal
                      id={ELEM_BOTTOM_MENU_ITEM_WLE_SETTINGS_ID}
                      onClickCallback={settingsContext.setOpen}>
                      {i18n.t(`${LANG_NS_MAIN}:menuWLESettings`)}
                    </WordalistMenuPortal>
                  )}
                </SettingsContext.Consumer>, wlBottomMenuElement)}
              {settingsOptions.enableCustomSelection && verifyOnPageExercise() &&
                createPortal(<CustomSelectionToolbar/>, wlPageExerciseToolbarContainerElement)}
              {settingsOptions.enableCustomSelection && verifyOnPageExercise() &&
                wlPageExerciseSectionsAddedPortals}
              {settingsOptions.enableLoadAllPages && verifyOnPageExerciseExploreSection() &&
                createPortal(<ExploreSectionsToolbar/>, wlPageExerciseExploreSectionToolbarContainerElement)}
            </SectionSelectionContext.Provider>
          </SettingsContext.Provider>
        </AlertContext.Provider>
      </NotificationContext.Provider>
    </FirebaseContext.Provider>
  );
};

render(
  <UserscriptApp/>,
  (() => {
    const mainApp: HTMLDivElement = document.createElement("div");
    mainApp.id = ELEM_MAIN_APP_ID;
    document.body.append(mainApp);
    return mainApp;
  })()
);
