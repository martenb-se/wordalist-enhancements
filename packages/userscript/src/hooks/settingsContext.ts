import {Context, createContext} from "preact";
import {SettingsOptionsType, SettingContextType} from "../@types/settingsTypes";
import {getActiveLanguage} from "../i18n";

const placeHolderValue: SettingContextType = {
  open: false,
  options: {
    language: getActiveLanguage(),
    enableCustomSelection: false,
    enableLoadAllPages: false,
    enableFirebaseSync: false,
    firebaseConfig: null
  },
  setOpen: (): void => {
    console.log(`SettingsContext.setOpen() placeholder function executed. This should be replaced by a new function.`);
  },
  setClosed: (): void => {
    console.log(`SettingsContext.setClosed() placeholder function executed. This should be replaced by a new function.`);
  },
  setOptions: (
    {
      language,
      enableCustomSelection,
      enableLoadAllPages,
      enableFirebaseSync,
      firebaseConfig
    }: SettingsOptionsType): void => {
    console.log(`SettingsContext.setOptions() placeholder function executed. This should be replaced by a new function.`);
    console.log(` - language: ${language}`);
    console.log(` - enableCustomSelection: ${enableCustomSelection}`);
    console.log(` - enableLoadAllPages: ${enableLoadAllPages}`);
    console.log(` - enableFirebaseSync: ${enableFirebaseSync}`);
    console.log(` - firebaseConfig: ${firebaseConfig}`);
  },
};


export const SettingsContext: Context<SettingContextType> = createContext(placeHolderValue);
