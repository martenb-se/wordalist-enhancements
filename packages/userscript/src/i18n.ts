import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { PERSIST_KEY_LANGUAGE_SETTING } from "./constants";
import { ScriptStorage } from "./imported/pionxzh/util/storage";
import en_US_main from "./locales/en-US/main.json";
import sv_SE_main from "./locales/sv-SE/main.json";
import en_US_sync from "./locales/en-US/sync.json";
import sv_SE_sync from "./locales/sv-SE/sync.json";

export const AvailableLocales: string[] = [
  "en",
  "en-US",
  "sv",
  "sv-SE"
]

/**
 * Interface representing an internationalization (i18n) configuration. This interface defines the properties of a
 * configuration object that contains information about a specific i18n configuration, such as the supported language,
 * language code, and resources.
 */
interface i18nConfiguration {
  /**
   * The name of the language in a human-readable format.
   * For example, "English", "Spanish", "French", etc.
   */
  name: string;

  /**
   * The i18n key name of the language as it is defined in a resource.
   * For example, in {@link import('./locales/en-US/main.json') ./locales/en-US/main.json}, there is "langNameEnglish",
   * "langNameEnglishUS" or "langNameSwedish", which can be used.
   */
  i18nNameKey: string;

  /**
   * The code representing the language in a standardized format. This code is typically a two-letter or three-letter
   * ISO 639 language code, or an IETF BCP 47 language tag combining ISO 639, ISO 15924 and ISO 3166-1.
   * For example, "en" for English, "es" for Spanish, "fr" for French, or "en-US" for American English,
   * "sv-FI" for Finnish Swedish, "nl-BE" for Belgian Dutch, etc.
   */
  code: string;

  /**
   * An object representing the resource of the language. The resource is a key-value pair where the key is a
   * unique identifier and the value is the translation of the identifier in the specified language. This resource
   * object stores translations for different phrases or messages used in the application for this specific language.
   * For example, { "hello": "Hola", "bye": "Adiós" } for Spanish language.
   */
  resource: Record<"main"|"sync", Record<string, string>>;
}

/**
 * LanguageConf is a lookup table representing different language configurations in an internationalization
 * (i18n) system. It is an object where the keys are language codes and the values are objects representing the
 * i18nConfiguration interface for each language. The LanguageConf table allows easy access to language-specific
 * information such as language names, codes, and language resources.
 */
export const LanguageConf: Record<string, i18nConfiguration> = {
  EN: {
    name: "English",
    i18nNameKey: "langNameEnglish",
    code: "en",
    resource: {main: en_US_main, sync: en_US_sync}
  },
  EN_US: {
    name: "English (US)",
    i18nNameKey: "langNameEnglishUS",
    code: "en-US",
    resource: {main: en_US_main, sync: en_US_sync}
  },
  SV: {
    name: "Swedish",
    i18nNameKey: "langNameSwedish",
    code: "sv",
    resource: {main: sv_SE_main, sync: sv_SE_sync}
  },
  SV_SE: {
    name: "Swedish (Sweden)",
    i18nNameKey: "langNameSwedishSE",
    code: "sv-SE",
    resource: {main: sv_SE_main, sync: sv_SE_sync}
  }
};

/**
 * Retrieve the language configuration object by language code.
 * This function searches the LanguageConf object for the provided language code and returns the corresponding language
 * configuration object. If the code is not found in the LanguageConf object, it returns null.
 *
 * @param code - The language code to search for in the LanguageConf object.
 * @param option - Optional configuration for case-insensitive search.
 * @param [option.case_insensitive] - If `option.case_insensitive` is set to true, the search will be case-insensitive.
 * Default is false, meaning the search is case-sensitive.
 * @returns The language configuration object corresponding to the provided language code,
 * or null if no language code was found.
 */
export function getLanguageConfByCode(code: string, {case_insensitive = false}:{case_insensitive?: boolean} = {}):
  i18nConfiguration | null {
  for (const key in LanguageConf) {
    if (case_insensitive && LanguageConf[key].code.toLowerCase() === code.toLowerCase()) {
      return LanguageConf[key];
    } else if (!case_insensitive && LanguageConf[key].code === code) {
      return LanguageConf[key];
    }
  }
  return null;
}

/**
 * Select the language configuration object based on the browser's preferred language settings.
 *
 * This function retrieves the browser's preferred languages from the `navigator.languages` property (if available),
 * or the `navigator.language` property, and searches for the corresponding language configuration object in the
 * LanguageConf object. If a match is found, it returns the language configuration object.
 *
 * @returns The language configuration object corresponding to the browser's preferred language setting, or null if
 * no match is found.
 */
function selectByBrowserPreferredLanguageConf(): i18nConfiguration | null {
  let preferredLanguages: string[] = [];

  // Check if the navigator object is available (browser environment).
  if (typeof navigator !== 'undefined') {
    // Check if the navigator.languages array is available.
    if (typeof navigator.languages === 'object') {
      preferredLanguages = [...navigator.languages];
    } else if (typeof navigator.language === 'string') {
      // If the navigator.languages array is not available, use the navigator.language string.
      preferredLanguages = [navigator.language];
    }
  }

  // Iterate through the preferred languages array in order of priority.
  for (const preferredLanguage of preferredLanguages) {
    // Attempt to get the language configuration object for the current preferred language.
    const preferredLanguageCode =
      getLanguageConfByCode(preferredLanguage, { case_insensitive: true });

    // If a match is found, return the corresponding language configuration object.
    if (preferredLanguageCode !== null) {
      return preferredLanguageCode;
    }
  }

  // If no match is found for any preferred language, return null.
  return null;
}

/**
 * Retrieve the active language code to be used for i18n.
 * This function checks if a previously saved language preference exists in the ScriptStorage (if available).
 * If a saved language preference exists, it returns the language code corresponding to the saved language.
 * If no saved language preference is found, it retrieves the preferred browser language using the
 * `selectByBrowserPreferredLanguageConf` function.
 *
 * @returns The active language code to be used for i18n.
 * @see {@link selectByBrowserPreferredLanguageConf}
 */
export function getActiveLanguage(): string {
  const savedLanguage = ScriptStorage.get<string>(PERSIST_KEY_LANGUAGE_SETTING);
  if (savedLanguage && getLanguageConfByCode(savedLanguage)) {
    return savedLanguage;
  }

  const preferredLanguageConf = selectByBrowserPreferredLanguageConf();
  if (preferredLanguageConf) {
    return preferredLanguageConf.code;
  }

  return LanguageConf.EN_US.code;
}

export const defaultNS = LanguageConf.EN_US.code;
export const resources: Record<string, {main: Record<string, string>, sync: Record<string, string>}> =
  Object.keys(LanguageConf).reduce<Record<string,
    {
      main: Record<string, string>,
      sync: Record<string, string>
    }>>(
  (acc, key) => {
    acc[LanguageConf[key].code] = {
      main: LanguageConf[key].resource.main,
      sync: LanguageConf[key].resource.sync
    };
    return acc;
  }, {});

// Initialize the i18n library with the provided configuration.
i18n.use(initReactI18next).init({
  fallbackLng: LanguageConf.EN_US.code,
  lng: getActiveLanguage(),
  resources,
  defaultNS,
  interpolation: {
    escapeValue: false,
  },
});

i18n.on('languageChanged', (newLanguage) => {
  ScriptStorage.set(PERSIST_KEY_LANGUAGE_SETTING, newLanguage);
});

export default i18n
