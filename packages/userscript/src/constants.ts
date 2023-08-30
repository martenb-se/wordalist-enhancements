// Languages
export const LANG_NS_MAIN = "main"
export const LANG_NS_SYNC = "sync"

// Persist
export const PERSIST_KEY_LANGUAGE_SETTING = "wle:language"
export const PERSIST_KEY_ENABLE_CUSTOM_SELECTIONS_SETTING = "wle:enable-custom-selections"
export const PERSIST_KEY_ENABLE_LOAD_ALL_PAGES_SETTING = "wle:enable-load-all-pages"
export const PERSIST_KEY_ENABLE_FIREBASE_SYNC_SETTING = "wle:enable-firebase-sync"
export const PERSIST_KEY_FIREBASE_SYNC_CONF_SETTING = "wle:firebase-sync-conf"

// Persist: Page check
export const PERSIST_KEY_LAST_PAGE = "wle:last-page"

// Persist: Custom Sections Selection
export const PERSIST_KEY_CUSTOM_SELECTIONS_ACTIVE_EXERCISE = "wle:custom-selections-active-exercise"
export const PERSIST_KEY_CUSTOM_SELECTIONS_ACTIVE_SECTIONS = "wle:custom-selections-active-sections"

// Persist: Custom Selection Storage
export const PERSIST_KEY_CUSTOM_SELECTIONS_EXERCISES_STORAGE = "wle:custom-selections-exercises-storage"
export const PERSIST_KEY_CUSTOM_SELECTIONS_STORAGE = "wle:custom-selections-storage"

// Persist: Firebase Configuration
export const PERSIST_KEY_FIREBASE_UUID = "wle:firebase-uuid"
export const PERSIST_KEY_FIREBASE_CONFIG = "wle:firebase-config"

// Custom Modules
// - Settings
export const SETTING_LANGUAGE_RADIO_BUTTON_BASE_ID = "wle-setting-language-radio-button"
export const SETTING_LANGUAGE_RADIO_BUTTON_CHECKED_SELECTOR = "[id^='wle-setting-language-radio-button'][data-state='checked']"
export const SETTING_ENABLE_CUSTOM_SELECTIONS_ID = "wle-setting-enable-custom-selections"
export const SETTING_ENABLE_LOAD_ALL_PAGES_ID = "wle-setting-enable-load-all-pages"
export const SETTING_ENABLE_FIREBASE_SYNC_ID = "wle-setting-enable-firebase-sync"
export const SETTING_FIREBASE_SYNC_CONF_ID = "wle-setting-firebase-conf"

// - Custom Selection Save Dialogue

export const DIALOGUE_SAVE_CUSTOM_SELECTION_NAME_ID = "wle-dialogue-save-custom-selection-name"

// - Custom Storage Import Dialogue
// TODO: Remove
//export const DIALOGUE_CUSTOM_SELECTIONS_STORAGE_IMPORT_TEXTAREA_ID =
//  "wle-dialogue-custom-selections-storage-import-textarea"

// Element Identifiers
export const ELEM_MAIN_APP_ID = "wle-main-app"
export const ELEM_PERSONAL_MENU_ITEM_WLE_SELECTION_ID = "wle-personal-menu-selection-item"
export const ELEM_PERSONAL_MENU_ITEM_WLE_SYNCHRONIZATION_ID = "wle-personal-menu-synchronization-item"
export const ELEM_BOTTOM_MENU_ITEM_WLE_SETTINGS_ID = "wle-bottom-menu-settings-item"
export const ELEM_LOGGED_IN_TOP_BAR_CONTAINER_ID = "wle-top-bar-container"
export const ELEM_LOGGED_IN_TOP_BAR_CONTAINER_ITEM_WLE_SELECTION_ID = "wle-top-bar-container-selection-item"
export const ELEM_LOGGED_IN_TOP_BAR_CONTAINER_ITEM_WLE_SYNCHRONIZATION_ID = "wle-top-bar-container-synchronization-item"
export const ELEM_LOGGED_IN_TOP_BAR_CONTAINER_ITEM_WLE_SETTINGS_ID = "wle-top-bar-container-settings-item"

// - Element Identifiers for Exercise Page
export const ELEM_PAGE_EXERCISE_SECTIONS_TOOLBAR_CONTAINER_ID = "wle-page-exercise-sections-toolbar-container"
export const ELEM_PAGE_EXERCISE_SECTIONS_ADDITION_BASE_ID = "wle-page-exercise-sections-addition"

// - Element Identifiers for Exercise Explore Section Page
export const ELEM_PAGE_EXERCISE_EXPLORE_SECTIONS_TOOLBAR_CONTAINER_ID = "wle-page-exercise-explore-sections-toolbar-container"

// Element Selectors
export const ELEM_WL_PERSONAL_MENU_SELECTOR = "nav:not(.public).nav-default.ink-navigation > #menu"
export const ELEM_WL_BOTTOM_MENU_SELECTOR = ".public.nav-default.ink-navigation > #menu"
export const ELEM_WL_LOGGED_IN_TOP_BAR_SELECTOR = "body:not(.anyone) > #page > #topBar"

// - Element Selectors for Exercise Page
export const ELEM_WL_PAGE_EXERCISE_TITLE_SELECTOR = "h1 > a"
export const ELEM_WL_PAGE_EXERCISE_SECTIONS_CONTAINER_SELECTOR = "#content .all-100:nth-child(4)"
export const ELEM_WL_PAGE_EXERCISE_SECTION_ROWS_SELECTOR = "#content .ink-table > tbody > tr"
export const ELEM_WL_PAGE_EXERCISE_SECTION_ROW_PRACTICE_ANCHOR_SELECTOR = "[href^='/practice/'][href$='/start']"
export const ELEM_WL_PAGE_EXERCISE_SECTION_ROW_ANCHOR_SELECTOR = "h4 > a"

// - Element Selectors for Exercise Explore Section Page
export const ELEM_WL_PAGE_EXERCISE_EXPLORE_SECTION_CONTAINER_SELECTOR = "div.all-100:nth-child(2) > hr:nth-child(2)"
export const ELEM_WL_PAGE_EXERCISE_EXPLORE_SECTION_LINK_FIRST_PAGE_SELECTOR = "a[href$='page=1']"
export const ELEM_WL_PAGE_EXERCISE_EXPLORE_SECTION_LINK_NEXT_PAGE_SELECTOR = ".next > a"
export const ELEM_WL_PAGE_EXERCISE_EXPLORE_SECTION_QUESTIONS_TABLE_SELECTOR = ".ink-table"

// Regular Expressions
// - Regular Expressions for Exercise Page
export const RE_PAGE_EXERCISE_PRACTICE_LINK = /\/practice\/([0-9]+)\/([0-9]+)\/start/

// Values
// Exercise Explore Section Page
export const VAL_PAGE_EXERCISE_EXPLORE_SECTION_MAX_ITERATIONS = 10;

// Custom Modules
// - Firebase Sync
export const VAL_FIREBASE_SYNC_UUID_KEY = "sync/uuid";
export const VAL_FIREBASE_SYNC_SETTINGS_KEY = "sync/settings";
export const VAL_FIREBASE_SYNC_CUSTOM_SELECTIONS_EXERCISES_STORAGE_KEY = "sync/customSelectionsExercisesStorage";
export const VAL_FIREBASE_SYNC_CUSTOM_SELECTIONS_STORAGE_KEY = "sync/customSelectionsStorage";
export const VAL_FIREBASE_SYNC_SHARED_KEY = "shared";

// - Firebase Sync Keys
export type VAL_FIREBASE_SYNC_KEY =
  "sync/uuid" |
  "sync/settings" |
  "sync/customSelectionsExercisesStorage" |
  "sync/customSelectionsStorage";
