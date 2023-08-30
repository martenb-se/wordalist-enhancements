import {useEffect, useState} from "preact/hooks";
import {useContext} from "preact/compat";
import {
  LANG_NS_MAIN,
  LANG_NS_SYNC,
  VAL_FIREBASE_SYNC_CUSTOM_SELECTIONS_EXERCISES_STORAGE_KEY,
  VAL_FIREBASE_SYNC_CUSTOM_SELECTIONS_STORAGE_KEY,
  VAL_FIREBASE_SYNC_KEY,
  VAL_FIREBASE_SYNC_SETTINGS_KEY,
  VAL_FIREBASE_SYNC_SHARED_KEY
} from "../../../constants";
import {
  CustomSelectionExerciseType,
  CustomSelectionsExercisesStorageType,
  CustomSelectionsStorageSetterType,
  CustomSelectionsStorageType,
  MultipleCustomSelectionsExercisesStorageSetterType,
  MultipleCustomSelectionsStorageSetterType,
  OneCustomSelectionStorageType,
  SectionSelectionContextType
} from "../../../@types/customSelectionTypes";
import {SettingContextType, SettingsOptionsType} from "../../../@types/settingsTypes";
import {AlertContextType} from "../../../@types/alertContextTypes";
import {FirebaseContextType} from "../../../@types/firebaseContextTypes";
import {AlertContext} from "../../../hooks/alertContext";
import {FirebaseContext} from "../../../hooks/firebaseContext";
import {SettingsContext} from "../../../hooks/settingsContext";
import {SectionSelectionContext} from '../../../hooks/sectionSelectionContext';
import i18n, {getLanguageConfByCode} from "../../../i18n";
import {ref, set} from "firebase/database";
import {
  getCustomSelectionFromHash,
  getTitleFromExerciseID,
  propFilterCustomSelectionHash,
  propFilterExerciseID,
  sectionsMapperRestoreElementIDs
} from "../../../util/customSelectionHandling";
import _ from 'lodash';
import * as Dialog from '@radix-ui/react-dialog';
import {
  Cross2Icon,
  DownloadIcon,
  UploadIcon
} from '@radix-ui/react-icons';
import '../styles.css';
import './styles.css';


/**
 * Component for handling Firebase synchronization.
 *
 * @returns JSX element representing the Firebase synchronization dialogue.
 */
const FirebaseSyncDialogue = () => {
  const alertContext: AlertContextType = useContext(AlertContext);
  const firebaseContext: FirebaseContextType = useContext(FirebaseContext);
  const settingsContext: SettingContextType = useContext(SettingsContext);
  const sectionSelectionContext: SectionSelectionContextType = useContext(SectionSelectionContext);

  /**
   * Display an alert dialog for uploading data to Firebase.
   *
   * @param options - Upload options.
   * @param options.value - The value to display in the alert text.
   * @param options.data - The data to be uploaded.
   * @param options.syncKey - The synchronization key.
   */
  function promptUpload({value, data, syncKey}: {
    value: string,
    data: unknown,
    syncKey: VAL_FIREBASE_SYNC_KEY
  }): void {
    alertContext.setOptions({
      title: i18n.t(`${LANG_NS_SYNC}:alertUploadTitle`),
      text: i18n.t(`${LANG_NS_SYNC}:alertUploadText`, {value: value}),
      okButtonText: i18n.t(`${LANG_NS_MAIN}:yes`),
      cancelButtonText: i18n.t(`${LANG_NS_MAIN}:no`),
      okCallback: () => {
        if (firebaseContext.db) {
          set(ref(firebaseContext.db, `${syncKey}/${VAL_FIREBASE_SYNC_SHARED_KEY}`), data);
        }
      },
      cancelCallback: () => {
        return;
      }
    });
    alertContext.setOpen();
  }

  /**
   * Display an alert dialog for downloading data from Firebase.
   *
   * @param options - Download options.
   * @param options.value - The value to display in the alert text.
   * @param options.data - The data to be downloaded.
   * @param options.contextSetter - A function to set the downloaded data locally.
   * @template T - The type of data being downloaded.
   */
  function promptDownload<T>({value, data, contextSetter}: {
    value: string,
    data: T,
    contextSetter: (newData: T) => void
  }) {
    alertContext.setOptions({
      title: i18n.t(`${LANG_NS_SYNC}:alertDownloadTitle`),
      text: i18n.t(`${LANG_NS_SYNC}:alertDownloadText`, {value: value}),
      okButtonText: i18n.t(`${LANG_NS_MAIN}:yes`),
      cancelButtonText: i18n.t(`${LANG_NS_MAIN}:no`),
      okCallback: () => {
        contextSetter(data);
      },
      cancelCallback: () => {
        return;
      }
    });
    alertContext.setOpen();
  }

  const [localExercisesInformation, setLocalExercisesInformation] =
    useState<CustomSelectionExerciseType[]>([]);

  const [syncedExercisesInformation, setSyncedExercisesInformation] =
    useState<CustomSelectionExerciseType[]>([]);

  /**
   * Updates and sorts the local exercises information when there are changes in custom selection storage and
   * exercises storage. The information is used for display purposes.
   */
  useEffect(() => {
    const updatedIds: CustomSelectionExerciseType[] =
      sectionSelectionContext.customSelectionsStorage
        .map(({exerciseID}) => exerciseID)
        .filter((exerciseID, index, array) => index === array.indexOf(exerciseID))
        .map((exerciseID): CustomSelectionExerciseType => {
          return {exerciseID, exerciseTitle: getTitleFromExerciseID({exerciseID: exerciseID, sectionSelectionContext})}
        });

    updatedIds.sort((a, b) =>
      parseInt(a.exerciseID) - parseInt(b.exerciseID));

    setLocalExercisesInformation(updatedIds);
  }, [sectionSelectionContext.customSelectionsStorage, sectionSelectionContext.customSelectionsExercisesStorage]);

  /**
   * Updates and sorts the synced exercises information when there are changes in synced exercises and selections
   * storage. The information is used for display purposes.
   */
  useEffect(() => {
    const updatedIds: CustomSelectionExerciseType[] =
      firebaseContext.syncedSelectionsStorage
        .map(({exerciseID}) => exerciseID)
        .filter((exerciseID, index, array) => index === array.indexOf(exerciseID))
        .map((exerciseID): CustomSelectionExerciseType => {
          return {exerciseID, exerciseTitle: getTitleFromExerciseID({exerciseID: exerciseID, sectionSelectionContext})}
        });

    updatedIds.sort((a, b) =>
      parseInt(a.exerciseID) - parseInt(b.exerciseID));

    setSyncedExercisesInformation(updatedIds);
  }, [firebaseContext.syncedExercisesStorage, firebaseContext.syncedSelectionsStorage]);

  const [sortedLocalExerciseStorage, setSortedLocalExerciseStorage] =
    useState<CustomSelectionsExercisesStorageType>([]);
  const [sortedSyncedExerciseStorage, setSortedSyncedExerciseStorage] =
    useState<CustomSelectionsExercisesStorageType>([]);

  /**
   * Updates the sorted local exercise storage based on changes in custom selections exercises storage.
   */
  useEffect(() => {
    const sortedLocalExerciseStorage = sectionSelectionContext.customSelectionsExercisesStorage;
    sortedLocalExerciseStorage.sort((a, b) =>
      parseInt(a.exerciseID) - parseInt(b.exerciseID));
    setSortedLocalExerciseStorage(sortedLocalExerciseStorage);
  }, [sectionSelectionContext.customSelectionsExercisesStorage]);

  /**
   * Updates the sorted synced exercise storage based on changes in synced exercises storage.
   */
  useEffect(() => {
    const sortedSyncedExerciseStorage = firebaseContext.syncedExercisesStorage;
    sortedSyncedExerciseStorage.sort((a, b) =>
      parseInt(a.exerciseID) - parseInt(b.exerciseID));
    setSortedSyncedExerciseStorage(sortedSyncedExerciseStorage);
  }, [firebaseContext.syncedExercisesStorage]);

  const [noStatisticsLocalCustomSelections, setNoStatisticsLocalCustomSelections] =
    useState<CustomSelectionsStorageType>([]);
  const [noStatisticsSyncedCustomSelections, setNoStatisticsSyncedCustomSelections] =
    useState<CustomSelectionsStorageType>([]);

  /**
   * Remove statistics-related properties from a custom selection storage item.
   *
   * @param props - The custom selection storage item to modify.
   * @returns A copy of the item with statistics-related properties removed.
   */
  const mapRemoveCustomSelectionStatistics = (props: OneCustomSelectionStorageType): OneCustomSelectionStorageType => {
    const newProps = JSON.parse(JSON.stringify(props));
    delete newProps.lastPracticed;
    delete newProps.practicesToday;
    delete newProps.practicesTotal;
    return newProps;
  }

  /**
   * Updates the local custom selections storage without statistics properties.
   */
  useEffect(() => {
    setNoStatisticsLocalCustomSelections(
      sectionSelectionContext.customSelectionsStorage.map(mapRemoveCustomSelectionStatistics));
  }, [sectionSelectionContext.customSelectionsStorage]);

  /**
   * Updates the synced custom selections storage without statistics properties.
   */
  useEffect(() => {
    setNoStatisticsSyncedCustomSelections(
      firebaseContext.syncedSelectionsStorage.map(mapRemoveCustomSelectionStatistics));
  }, [firebaseContext.syncedSelectionsStorage]);

  /**
   * Get the display name of a language based on its language code.
   *
   * @param languageCode - The language code to retrieve the display name for.
   * @returns The display name of the language, or "-" if the language code is undefined.
   */
  const getLanguageName = (languageCode: string | undefined) =>
    (languageCode ? i18n.t(`${LANG_NS_MAIN}:${getLanguageConfByCode(languageCode)?.i18nNameKey}`) : "-");

  /**
   * Handle the click event for the settings sync upload button.
   */
  function onClickSettingsUploadButton() {
    if (settingsContext.options.language &&
      firebaseContext.syncedSettings.language !== settingsContext.options.language) {
      promptUpload({
        syncKey: VAL_FIREBASE_SYNC_SETTINGS_KEY,
        data: {language: settingsContext.options.language},
        value: i18n.t(`${LANG_NS_MAIN}:${getLanguageConfByCode(settingsContext.options.language)?.i18nNameKey}`)
      });
    }
  }

  /**
   * Handle the click event for the settings sync download button.
   */
  function onClickSettingDownloadButton() {
    if (firebaseContext.syncedSettings.language &&
      firebaseContext.syncedSettings.language !== settingsContext.options.language) {
      promptDownload<SettingsOptionsType>({
        contextSetter: settingsContext.setOptions,
        data: {...settingsContext.options, language: firebaseContext.syncedSettings.language},
        value: i18n.t(
          `${LANG_NS_MAIN}:${getLanguageConfByCode(firebaseContext.syncedSettings.language)?.i18nNameKey}`)
      })
    }
  }

  /**
   * Handle the click event for the exercises sync upload button.
   */
  function onClickExercisesUploadButton() {
    promptUpload({
      syncKey: VAL_FIREBASE_SYNC_CUSTOM_SELECTIONS_EXERCISES_STORAGE_KEY,
      data: sectionSelectionContext.customSelectionsExercisesStorage,
      value: i18n.t(`${LANG_NS_MAIN}:wordalistExerciseInfo`,
        {count: sectionSelectionContext.customSelectionsExercisesStorage.length})
    });
  }

  /**
   * Handle the click event for the exercises sync download button.
   */
  function onClickExercisesDownloadButton() {
    promptDownload<MultipleCustomSelectionsExercisesStorageSetterType>({
      contextSetter: sectionSelectionContext.setMultipleInCustomSelectionsExercisesStorage,
      data: {customSelectionsExercisesStorageSetters: firebaseContext.syncedExercisesStorage, resetStorage: true},
      value: i18n.t(`${LANG_NS_MAIN}:wordalistExerciseInfo`,
        {count: firebaseContext.syncedSelectionsStorage.length})
    })
  }

  /**
   * Handle the click event for the custom selections sync upload button.
   */
  function onClickCustomSelectionsUploadButton() {
    if (sectionSelectionContext.customSelectionsStorage.length > 0 &&
      !_.isEqual(noStatisticsLocalCustomSelections, noStatisticsSyncedCustomSelections)) {
      promptUpload({
        syncKey: VAL_FIREBASE_SYNC_CUSTOM_SELECTIONS_STORAGE_KEY,
        data: noStatisticsLocalCustomSelections,
        value: i18n.t(`${LANG_NS_MAIN}:wordalistCustomSelection`,
          {count: sectionSelectionContext.customSelectionsStorage.length})
      });
    }
  }

  /**
   * Handle the click event for the custom selections sync download button.
   */
  function onClickCustomSelectionsDownloadButton() {
    // Insert local statistics
    const updatedLocalStorage: CustomSelectionsStorageSetterType[] =
      firebaseContext.syncedSelectionsStorage.map((props: OneCustomSelectionStorageType):
      CustomSelectionsStorageSetterType => {
        const localCustomSelection: OneCustomSelectionStorageType | null =
          getCustomSelectionFromHash({
            hash: props.hash,
            sectionSelectionContext
          });

        const localStatistics: {
          lastPracticed?: string,
          practicesTotal?: number,
          practicesToday?: number
        } = {};
        if (localCustomSelection) {
          localStatistics.lastPracticed = localCustomSelection.lastPracticed;
          localStatistics.practicesToday = localCustomSelection.practicesToday;
          localStatistics.practicesTotal = localCustomSelection.practicesTotal;
        }

        return {
          ...props,
          ...localStatistics,
          exerciseTitle: getTitleFromExerciseID({
            exerciseID: props.exerciseID,
            sectionSelectionContext
          }),
          sections: props.sections.map(sectionsMapperRestoreElementIDs(props.exerciseID))
        };
      });

    promptDownload<MultipleCustomSelectionsStorageSetterType>({
      contextSetter: sectionSelectionContext.setMultipleInCustomSelectionsStorage,
      data: {
        customSelectionsStorageSetters: updatedLocalStorage,
        resetStorage: true
      },
      value: i18n.t(
        `${LANG_NS_MAIN}:wordalistCustomSelection`,
        {count: firebaseContext.syncedSelectionsStorage.length})
    })
  }

  return (
    <Dialog.Root open={firebaseContext.dialogueOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="DialogOverlay"/>
        <Dialog.Content className="DialogContent">
          <Dialog.Title className="DialogTitle">{i18n.t(`${LANG_NS_MAIN}:menuWLESynchronization`)}</Dialog.Title>
          <div className="DialogContentScroll">
            <Dialog.Description className="DialogDescription">
              {i18n.t('sync:dialogueGeneralDescription')}
            </Dialog.Description>
            <div className="MultiFieldset">
              <div className="FieldsetTitle">
                {i18n.t(`${LANG_NS_SYNC}:dialogueSectionSettingsLanguageTitle`)}
              </div>
              <fieldset className="Fieldset">
                <label className="Label">
                  {i18n.t(`${LANG_NS_SYNC}:dialogueSectionSettingsLanguageLocal`)}
                </label>
                <input
                  className="Input"
                  readOnly={true}
                  value={getLanguageName(settingsContext.options.language)}/>
                <button
                  className="Button green"
                  disabled={firebaseContext.syncedSettings.language === settingsContext.options.language}
                  onClick={onClickSettingsUploadButton}><UploadIcon/>
                </button>
              </fieldset>
              <fieldset className="Fieldset">
                <label className="Label">
                  {i18n.t(`${LANG_NS_SYNC}:dialogueSectionSettingsLanguageSync`)}
                </label>
                <input
                  className="Input"
                  readOnly={true}
                  value={getLanguageName(firebaseContext.syncedSettings.language)}/>
                <button
                  className="Button blue"
                  disabled={firebaseContext.syncedSettings.language === settingsContext.options.language}
                  onClick={onClickSettingDownloadButton}><DownloadIcon/>
                </button>
              </fieldset>
            </div>

            <div className="MultiFieldset">
              <div className="FieldsetTitle">
                {i18n.t(`${LANG_NS_SYNC}:dialogueSectionSelectionsExercisesTitle`)}
              </div>
              <fieldset className="Fieldset">
                <label className="Label">
                  {i18n.t(`${LANG_NS_SYNC}:dialogueSectionSelectionsExercisesLocal`)}
                </label>
                <ul className="SyncExercisesList">
                  {sortedLocalExerciseStorage.length > 0 && sortedLocalExerciseStorage.map(
                    ({exerciseID, exerciseTitle}) =>
                      <li style={{textAlign: "left"}}>
                        {i18n.t(`${LANG_NS_MAIN}:wordalistExercise`, {id: exerciseID})}
                        : <span className={`SyncExerciseName ${
                        exerciseTitle !== firebaseContext.syncedExercisesStorage
                          .filter(propFilterExerciseID(exerciseID))?.[0]?.exerciseTitle ?
                          ' SyncExerciseNameDiffer' :
                          ''}`}>
                        {exerciseTitle}
                      </span>
                      </li>) || <li> - </li>}
                </ul>
                <button
                  className="Button green"
                  disabled={sortedLocalExerciseStorage.length === 0 ||
                    _.isEqual(sortedSyncedExerciseStorage, sortedLocalExerciseStorage)}
                  onClick={onClickExercisesUploadButton}><UploadIcon/>
                </button>
              </fieldset>
              <fieldset className="Fieldset">
                <label className="Label">
                  {i18n.t(`${LANG_NS_SYNC}:dialogueSectionSelectionsExercisesSync`)}
                </label>
                <ul className="SyncExercisesList">
                  {firebaseContext.syncedExercisesStorage.length > 0 && sortedSyncedExerciseStorage.map(
                    ({exerciseID, exerciseTitle}) =>
                      <li style={{textAlign: "left"}}>
                        {i18n.t(`${LANG_NS_MAIN}:wordalistExercise`, {id: exerciseID})}
                        : <span
                        className=
                          {`SyncExerciseName ${
                            exerciseTitle !== sectionSelectionContext.customSelectionsExercisesStorage
                              .filter(propFilterExerciseID(exerciseID))?.[0]?.exerciseTitle ?
                              ' SyncExerciseNameDiffer' :
                              ''}`}>
                        {exerciseTitle}
                      </span>
                      </li>) || <li>-</li>}
                </ul>
                <button
                  className="Button blue"
                  disabled={firebaseContext.syncedExercisesStorage.length === 0 ||
                    _.isEqual(sortedSyncedExerciseStorage, sortedLocalExerciseStorage)}
                  onClick={onClickExercisesDownloadButton}><DownloadIcon/>
                </button>
              </fieldset>
            </div>

            <div className="MultiFieldset">
              <div className="FieldsetTitle">
                {i18n.t(`${LANG_NS_SYNC}:dialogueSectionSelectionsCustomSelectionsTitle`)}
              </div>
              <fieldset className="Fieldset">
                <label className="Label">
                  {i18n.t(`${LANG_NS_SYNC}:dialogueSectionSelectionsCustomSelectionsLocal`)}
                </label>
                <ul className="SyncExercisesList">
                  {localExercisesInformation.map(
                    ({exerciseID, exerciseTitle}) => {
                      return (<li>
                        <span className={exerciseTitle !== firebaseContext.syncedExercisesStorage
                          .filter(propFilterExerciseID(exerciseID))?.[0]?.exerciseTitle ?
                          'SyncExerciseNameDiffer' : ''}>{exerciseTitle} ({exerciseID})</span>
                        <ul className="SyncSectionsList">
                          {sectionSelectionContext.customSelectionsStorage
                            .filter(propFilterExerciseID(exerciseID))
                            .map(({name, hash, sections}: OneCustomSelectionStorageType) =>
                              <li>
                                <span className={hash !== firebaseContext.syncedSelectionsStorage
                                  .filter(propFilterCustomSelectionHash(hash))?.[0]?.hash ?
                                  'SyncExerciseNameDiffer' : ''}>
                                  {name} ({i18n.t(`${LANG_NS_MAIN}:wordalistSection`, {count: sections.length})})
                                </span>
                              </li>)}
                        </ul>
                      </li>);
                    })}
                </ul>
                <button
                  className="Button green"
                  disabled={sectionSelectionContext.customSelectionsStorage.length === 0 ||
                    _.isEqual(noStatisticsLocalCustomSelections, noStatisticsSyncedCustomSelections)}
                  onClick={onClickCustomSelectionsUploadButton}><UploadIcon/>
                </button>
              </fieldset>
              <fieldset className="Fieldset">
                <label className="Label">
                  {i18n.t(`${LANG_NS_SYNC}:dialogueSectionSelectionsCustomSelectionsSync`)}
                </label>
                <ul className="SyncExercisesList">
                  {syncedExercisesInformation.length > 0 && syncedExercisesInformation.map(
                    ({exerciseID, exerciseTitle}) => {
                      return (<li>
                        <span className={exerciseTitle !== sectionSelectionContext.customSelectionsExercisesStorage
                          .filter(propFilterExerciseID(exerciseID))?.[0]?.exerciseTitle ?
                          'SyncExerciseNameDiffer' : ''}>{exerciseTitle} ({exerciseID})</span>
                        <ul className="SyncSectionsList">
                          {firebaseContext.syncedSelectionsStorage
                            .filter(propFilterExerciseID(exerciseID))
                            .map(({name, hash, sections}: OneCustomSelectionStorageType) =>
                              <li>
                                <span className={hash !== sectionSelectionContext.customSelectionsStorage
                                  .filter(propFilterCustomSelectionHash(hash))?.[0]?.hash ?
                                  'SyncExerciseNameDiffer' : ''}>
                                  {name} ({i18n.t(`${LANG_NS_MAIN}:wordalistSection`, {count: sections.length})})
                                </span>
                              </li>)}
                        </ul>
                      </li>);
                    }) || <li>-</li>}
                </ul>
                <button
                  className="Button blue"
                  disabled={firebaseContext.syncedSelectionsStorage.length === 0 ||
                    _.isEqual(noStatisticsLocalCustomSelections, noStatisticsSyncedCustomSelections)}
                  onClick={onClickCustomSelectionsDownloadButton}><DownloadIcon/>
                </button>
              </fieldset>
            </div>
          </div>
          <button className="IconButton" aria-label="Close" onClick={firebaseContext.closeDialogue}>
            <Cross2Icon/>
          </button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default FirebaseSyncDialogue;
