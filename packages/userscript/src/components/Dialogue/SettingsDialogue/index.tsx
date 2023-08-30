import {useEffect, useState} from "preact/hooks";
import {useContext} from "preact/compat";
import i18n, {AvailableLocales, getLanguageConfByCode} from "../../../i18n";
import {
  LANG_NS_MAIN,
  PERSIST_KEY_FIREBASE_CONFIG,
  SETTING_ENABLE_CUSTOM_SELECTIONS_ID,
  SETTING_ENABLE_FIREBASE_SYNC_ID,
  SETTING_ENABLE_LOAD_ALL_PAGES_ID,
  SETTING_FIREBASE_SYNC_CONF_ID,
  SETTING_LANGUAGE_RADIO_BUTTON_BASE_ID,
  SETTING_LANGUAGE_RADIO_BUTTON_CHECKED_SELECTOR
} from "../../../constants";
import {FirebaseContextType} from "../../../@types/firebaseContextTypes";
import {NotificationContextType} from "../../../@types/notificationTypes";
import {SettingsOptionsType, SettingContextType} from "../../../@types/settingsTypes";
import {FirebaseContext} from "../../../hooks/firebaseContext";
import {NotificationContext, NotificationType} from "../../../hooks/notificatonContext";
import {SettingsContext} from "../../../hooks/settingsContext";
import firebase from "firebase/compat";
import {initializeApp, deleteApp, FirebaseOptions, FirebaseApp} from "firebase/app";
import {getDatabase, ref, set, get, Database} from "firebase/database";
import {ScriptStorage} from "../../../imported/pionxzh/util/storage";
import * as Dialog from '@radix-ui/react-dialog';
import * as Switch from '@radix-ui/react-switch';
import * as RadioGroup from '@radix-ui/react-radio-group';
import {Cross2Icon} from '@radix-ui/react-icons';
import '../styles.css';
import './styles.css';

/**
 * Component for the settings dialogue.
 *
 * @returns JSX element representing the settings dialogue.
 */
const SettingsDialogue = () => {
  const firebaseContext: FirebaseContextType = useContext(FirebaseContext);
  const notificationContext: NotificationContextType = useContext(NotificationContext);
  const settingsContext: SettingContextType = useContext(SettingsContext);

  const [initialLanguage, setInitialLanguage] =
    useState<string | undefined>(undefined);

  /**
   * If the language is changed, trigger a page reload to reflect the new language.
   */
  useEffect(() => {
    if (initialLanguage === undefined) {
      // Initial language not set
      setInitialLanguage(settingsContext.options.language)
    } else if (initialLanguage !== settingsContext.options.language) {
      // Language was changed
      location.reload();
    }

  }, [settingsContext.options.language]);

  /**
   * Parses the raw Firebase configuration string.
   * @param rawStringConfig - Raw Firebase configuration string.
   * @returns Parsed Firebase options.
   * @throws Error if parsing or configuration is invalid.
   */
  const firebaseConfigurationParsing = async (rawStringConfig: string): Promise<FirebaseOptions | undefined> => {
    let parsedFirebaseConfig: FirebaseOptions | undefined = undefined;
    try {
      // Extract the content within the curly braces
      const startIndex = rawStringConfig.indexOf('{');
      const endIndex = rawStringConfig.lastIndexOf('}');
      const configString = rawStringConfig.slice(startIndex, endIndex + 1);

      // Remove line breaks and spaces and add quotes around keys
      const compactConfigString = configString.replace(/\s/g, '');
      const quotedConfigString =
        compactConfigString.replace(/([{,])\s*(\w+)\s*:/g, '$1"$2":')

      // Parse the compact JSON string to create a new object
      parsedFirebaseConfig = JSON.parse(quotedConfigString);

      return parsedFirebaseConfig;

    } catch (e) {
      notificationContext.setOptions({
        type: NotificationType.ERROR,
        title: i18n.t(`${LANG_NS_MAIN}:settingFirebaseConfigurationErrorTitle`),
        text: i18n.t(`${LANG_NS_MAIN}:settingFirebaseConfigurationErrorParseText`),
      });
      throw new Error("firebaseConfigurationParsing(): Parser error");
    }
  };

  /**
   * Tests the provided Firebase configuration.
   * @param firebaseConfig - Firebase configuration to test.
   * @returns Promise resolving to initialized { app, db } if successful.
   * @throws Error if testing or configuration is invalid.
   */
  const firebaseConfigurationTest = async (firebaseConfig: FirebaseOptions):
    Promise<{ app: FirebaseApp, db: Database }> => {
    const app: FirebaseApp = initializeApp(firebaseConfig);
    const db: Database = getDatabase(app);

    // Writing access
    try {
      await set(ref(db, 'testingConfig/'), {testKey: "testValue"});
    } catch (error) {
      const firebaseError: firebase.auth.Error = error as firebase.auth.Error;

      if (firebaseError.code === "PERMISSION_DENIED") {
        if (app) {
          await deleteApp(app);
        }
        notificationContext.setOptions({
          type: NotificationType.ERROR,
          title: i18n.t(`${LANG_NS_MAIN}:settingFirebaseConfigurationErrorTitle`),
          text: i18n.t(`${LANG_NS_MAIN}:settingFirebaseConfigurationErrorUsageWriteText`),
        });
        throw new Error("firebaseConfigurationTest(): Write error");
      }
    }

    // Reading access
    try {
      await get(ref(db, 'testingConfig/'));
    } catch (error) {
      const firebaseError: firebase.auth.Error = error as firebase.auth.Error;

      if (firebaseError.message === "Permission denied") {
        if (app) {
          await deleteApp(app);
        }
        notificationContext.setOptions({
          type: NotificationType.ERROR,
          title: i18n.t(`${LANG_NS_MAIN}:settingFirebaseConfigurationErrorTitle`),
          text: i18n.t(`${LANG_NS_MAIN}:settingFirebaseConfigurationErrorUsageReadText`),
        });
        throw new Error("firebaseConfigurationTest(): Read error");
      }
    }

    // Clean up
    try {
      await set(ref(db, 'testingConfig/'), {});
    } catch {
      if (app) {
        await deleteApp(app);
      }
      notificationContext.setOptions({
        type: NotificationType.ERROR,
        title: i18n.t(`${LANG_NS_MAIN}:settingFirebaseConfigurationErrorTitle`),
        text: i18n.t(`${LANG_NS_MAIN}:settingFirebaseConfigurationErrorUsageWriteText`),
      });
      throw new Error("firebaseConfigurationTest(): Write error");
    }

    return {app: app, db: db};

  }

  /**
   * Handles the click event to close the dialogue and save settings.
   * @returns Promise that resolves when settings are saved.
   */
  const onClickCloseDialogueAndSaveSettings = async (): Promise<void> => {
    const selectedLanguageState: string | undefined =
      (document.querySelector(SETTING_LANGUAGE_RADIO_BUTTON_CHECKED_SELECTOR) as HTMLButtonElement)?.value;
    const enableCustomSelectionState: string | undefined =
      document.getElementById(SETTING_ENABLE_CUSTOM_SELECTIONS_ID)?.dataset?.state;
    const enableLoadAllPagesState: string | undefined =
      document.getElementById(SETTING_ENABLE_LOAD_ALL_PAGES_ID)?.dataset?.state;
    const enableFirebaseSyncState: string | undefined =
      document.getElementById(SETTING_ENABLE_FIREBASE_SYNC_ID)?.dataset?.state;
    const enteredFirebaseConfigState: string | undefined =
      (document.getElementById(SETTING_FIREBASE_SYNC_CONF_ID) as HTMLTextAreaElement)?.value;

    // Settings status
    const selectedLanguage: string | undefined =
      selectedLanguageState ? selectedLanguageState : settingsContext.options.language;

    const enableCustomSelections: boolean | undefined =
      enableCustomSelectionState ?
        enableCustomSelectionState === "checked" :
        settingsContext.options.enableCustomSelection;

    const enableLoadAllPages: boolean | undefined =
      enableLoadAllPagesState ?
        enableLoadAllPagesState === "checked" :
        settingsContext.options.enableLoadAllPages;

    const enableFirebaseSync: boolean | undefined =
      enableFirebaseSyncState ?
        enableFirebaseSyncState === "checked" :
        settingsContext.options.enableFirebaseSync;

    const firebaseConfig: string | undefined =
      enteredFirebaseConfigState ? enteredFirebaseConfigState : undefined;

    // Firebase configuration format verification
    if (enableFirebaseSync && (firebaseConfig && firebaseConfig.length === 0 || !firebaseConfig)) {
      notificationContext.setOptions({
        type: NotificationType.ERROR,
        title: i18n.t(`${LANG_NS_MAIN}:settingFirebaseConfigurationErrorTitle`),
        text: i18n.t(`${LANG_NS_MAIN}:settingFirebaseConfigurationErrorParseText`),
      });
      return;
    } else if (enableFirebaseSync && firebaseConfig) {
      try {
        const parsedFirebaseConfig: FirebaseOptions | undefined =
          await firebaseConfigurationParsing(enteredFirebaseConfigState);

        // Firebase configuration test if configuration is updated
        if (parsedFirebaseConfig &&
          JSON.stringify(firebaseContext.config) !== JSON.stringify(parsedFirebaseConfig)) {
          try {
            await firebaseConfigurationTest(parsedFirebaseConfig);

            // Save and initialize firebase config
            firebaseContext.setConfig(parsedFirebaseConfig);

            // Save configuration as it was correctly parsed (at least)
            // It will be cleared in later stages if it fails
            ScriptStorage.set(PERSIST_KEY_FIREBASE_CONFIG, parsedFirebaseConfig);

          } catch {
            return;
          }
        }
      } catch {
        return;
      }
    }

    // Update state
    const newSettings: SettingsOptionsType = {
      ...settingsContext.options,
      language: selectedLanguage,
      enableCustomSelection: enableCustomSelections,
      enableLoadAllPages: enableLoadAllPages,
      enableFirebaseSync: enableFirebaseSync,
      firebaseConfig: firebaseConfig
    }

    notificationContext.setOptions({
      type: NotificationType.NOTIFICATION,
      title: i18n.t(`${LANG_NS_MAIN}:settings`),
      text: i18n.t(`${LANG_NS_MAIN}:settingsSaved`),
      timeout: 2000
    });

    // Save new settings
    settingsContext.setOptions({
      ...newSettings
    });

    settingsContext.setClosed();
  }

  return (
    <Dialog.Root open={settingsContext.open}>
      <Dialog.Portal>
        <Dialog.Overlay className="DialogOverlay"/>
        <Dialog.Content className="DialogContent">
          <Dialog.Title className="DialogTitle">{i18n.t(`${LANG_NS_MAIN}:menuWLESettings`)}</Dialog.Title>
          <div className="DialogContentScroll">
            <Dialog.Description className="DialogDescription">
              {i18n.t(`${LANG_NS_MAIN}:settingGeneralDescription`)}
            </Dialog.Description>
            <fieldset className="Fieldset">
              <label className="Label">
                {i18n.t(`${LANG_NS_MAIN}:settingWLELanguage`)}
              </label>
              <RadioGroup.Root
                className="RadioGroupRoot"
                defaultValue={settingsContext.options.language}
                aria-label="Choose a language">
                {AvailableLocales.map(curLocale => (
                  <div style={{display: 'flex', alignItems: 'center'}}>
                    <RadioGroup.Item className="RadioGroupItem" value={curLocale}
                                     id={`${SETTING_LANGUAGE_RADIO_BUTTON_BASE_ID}-${curLocale}`}>
                      <RadioGroup.Indicator className="RadioGroupIndicator"/>
                    </RadioGroup.Item>
                    <label className="Label" htmlFor={`${SETTING_LANGUAGE_RADIO_BUTTON_BASE_ID}-${curLocale}`}>
                      {i18n.t(`${LANG_NS_MAIN}:${getLanguageConfByCode(curLocale)?.i18nNameKey}`)}
                    </label>
                  </div>
                ))}
              </RadioGroup.Root>

            </fieldset>
            <fieldset className="Fieldset Switch">
              <label className="Label" htmlFor={SETTING_ENABLE_CUSTOM_SELECTIONS_ID}>
                {i18n.t(`${LANG_NS_MAIN}:settingActivateSelection`)}
              </label>
              <Switch.Root
                className="SwitchRoot" id={SETTING_ENABLE_CUSTOM_SELECTIONS_ID}
                defaultChecked={settingsContext.options.enableCustomSelection}>
                <Switch.Thumb className="SwitchThumb"/>
              </Switch.Root>
            </fieldset>
            <fieldset className="Fieldset Switch">
              <label className="Label" htmlFor={SETTING_ENABLE_LOAD_ALL_PAGES_ID}>
                {i18n.t(`${LANG_NS_MAIN}:settingActivateLoadAllPages`)}
              </label>
              <Switch.Root
                className="SwitchRoot" id={SETTING_ENABLE_LOAD_ALL_PAGES_ID}
                defaultChecked={settingsContext.options.enableLoadAllPages}>
                <Switch.Thumb className="SwitchThumb"/>
              </Switch.Root>
            </fieldset>
            <fieldset className="Fieldset Switch">
              <label className="Label" htmlFor={SETTING_ENABLE_FIREBASE_SYNC_ID}>
                {i18n.t(`${LANG_NS_MAIN}:settingActivateFirebaseSync`)}
              </label>
              <Switch.Root
                className="SwitchRoot" id={SETTING_ENABLE_FIREBASE_SYNC_ID}
                defaultChecked={settingsContext.options.enableFirebaseSync}>
                <Switch.Thumb className="SwitchThumb"/>
              </Switch.Root>
            </fieldset>
            <fieldset className="Fieldset">
              <label className="Label" htmlFor={SETTING_FIREBASE_SYNC_CONF_ID}>
                {i18n.t(`${LANG_NS_MAIN}:settingFirebaseConfiguration`)}
              </label>
              <textarea
                className="Textarea TextareaSmall TextareaCode"
                id={SETTING_FIREBASE_SYNC_CONF_ID}
                value={settingsContext.options.firebaseConfig ? settingsContext.options.firebaseConfig : ""}/>
            </fieldset>
          </div>
          <div className="ButtonGroup">
            <button className="Button green" onClick={onClickCloseDialogueAndSaveSettings}>
              {i18n.t(`${LANG_NS_MAIN}:save`)}
            </button>
          </div>
          <button className="IconButton" aria-label="Close" onClick={settingsContext.setClosed}>
            <Cross2Icon/>
          </button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default SettingsDialogue;
