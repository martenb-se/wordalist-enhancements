import { GM_deleteValue, GM_getValue, GM_setValue } from 'vite-plugin-monkey/dist/client'

/**
 * Greasemonkey storage API wrapper.
 * This class provides a unified interface to interact with Greasemonkey storage (GMStorage).
 * It allows storing, retrieving, and deleting data from Greasemonkey storage using GM_setValue, GM_getValue,
 * and GM_deleteValue methods.
 * @see https://www.tampermonkey.net/documentation.php#api:GM_setValue
 * @see https://www.tampermonkey.net/documentation.php#api:GM_setValue
 */
export class GMStorage {
  /**
   * A boolean value indicating whether Greasemonkey storage (GMStorage) is supported in the current environment.
   * It checks whether GM_getValue, GM_setValue, and GM_deleteValue are available as functions.
   */
  static supported = typeof GM_getValue === 'function' && typeof GM_setValue === 'function' &&
    typeof GM_deleteValue === 'function';

  /**
   * Retrieve the stored data associated with the given key from Greasemonkey storage (GMStorage).
   *
   * @param key - The key to retrieve data from Greasemonkey storage.
   * @returns The data associated with the provided key if available, or null if the key is not found in
   * Greasemonkey storage.
   */
  static get<T>(key: string): T | null {
    const item = GM_getValue<string>(key, '');
    if (item) {
      try {
        return JSON.parse(item);
      } catch {
        return null;
      }
    }
    return null;
  }

  /**
   * Store the provided data associated with the given key in Greasemonkey storage (GMStorage).
   *
   * @param key - The key under which to store the data in Greasemonkey storage.
   * @param value - The data to be stored.
   */
  static set<T>(key: string, value: T): void {
    const item = JSON.stringify(value);
    GM_setValue(key, item);
  }

  /**
   * Delete the data associated with the given key from Greasemonkey storage (GMStorage).
   *
   * @param key - The key for which to delete data from Greasemonkey storage.
   */
  static delete(key: string): void {
    GM_deleteValue(key);
  }
}

/**
 * LocalStorage wrapper.
 * This class provides a unified interface to interact with Web Storage (LocalStorage).
 * It allows storing, retrieving, and deleting data from LocalStorage using localStorage.setItem, localStorage.getItem,
 * and localStorage.removeItem methods.
 */
export class LocalStorage {
  /**
   * A boolean value indicating whether Web Storage (LocalStorage) is supported in the current environment.
   * It checks whether localStorage is available as an object.
   */
  static supported = typeof localStorage === 'object';

  /**
   * Retrieve the stored data associated with the given key from Web Storage (LocalStorage).
   *
   * @param key - The key to retrieve data from Web Storage.
   * @returns The data associated with the provided key if available, or null if the key is not found in Web Storage.
   */
  static get<T>(key: string): T | null {
    const item = localStorage.getItem(key);
    if (item) {
      try {
        return JSON.parse(item);
      } catch {
        return null;
      }
    }
    return null;
  }

  /**
   * Store the provided data associated with the given key in Web Storage (LocalStorage).
   *
   * @param key - The key under which to store the data in Web Storage.
   * @param value - The data to be stored.
   */
  static set<T>(key: string, value: T): void {
    const item = JSON.stringify(value);
    localStorage.setItem(key, item);
  }

  /**
   * Delete the data associated with the given key from Web Storage (LocalStorage).
   *
   * @param {string} key - The key for which to delete data from Web Storage.
   */
  static delete(key: string): void {
    localStorage.removeItem(key);
  }
}

/**
 * MemoryStorage wrapper.
 * This class provides an in-memory storage option for storing data as key-value pairs.
 * It is intended for scenarios where data needs to be temporarily stored within the application's memory.
 * The data is stored in a Map object within the class and will be accessible within the current session.
 * Note: Since MemoryStorage is an in-memory storage solution, the data will be lost when the session ends or the
 * application is refreshed.
 */
export class MemoryStorage {
  // The Map used to store the data as key-value pairs.
  private static map = new Map<string, unknown>();

  // A property indicating that MemoryStorage is always supported as it doesn't rely on external mechanisms.
  static supported = true;

  /**
   * Retrieve the data associated with the provided key from MemoryStorage.
   *
   * @param key - The key for which to retrieve the data from MemoryStorage.
   * @returns The data associated with the provided key, or null if the key is not found in MemoryStorage.
   */
  static get<T>(key: string): T | null {
    const item = this.map.get(key);
    return item !== undefined ? item as T : null;
  }

  /**
   * Store the provided data with the given key in MemoryStorage.
   *
   * @param key - The key under which to store the data in MemoryStorage.
   * @param value - The data to be stored.
   */
  static set<T>(key: string, value: T): void {
    this.map.set(key, value);
  }

  /**
   * Delete the data associated with the given key from MemoryStorage.
   *
   * @param key - The key for which to delete the data from MemoryStorage.
   */
  static delete(key: string): void {
    this.map.delete(key);
  }
}

/**
 * ScriptStorage utility class.
 * This class provides a unified interface to interact with different storage options, such as Greasemonkey storage
 * (GMStorage), Web Storage (LocalStorage), and MemoryStorage. It supports fallback behavior, attempting to use
 * Greasemonkey storage first, then falling back to Web Storage if available, and finally using MemoryStorage as the
 * last fallback option.
 */
export class ScriptStorage {
  /**
   * Retrieve the stored data associated with the given key from the supported storage options, with fallback support.
   * It first attempts to retrieve data from Greasemonkey storage (GMStorage), then falls back to Web Storage
   * (LocalStorage) if available, and finally, if neither is supported or an error occurs in both cases, it retrieves
   * data from MemoryStorage.
   *
   * @param key - The key to retrieve data from the supported storage options.
   * @returns The data associated with the provided key if available, or null if the key is not found in any of the
   * supported storage options.
   */
  static get<T>(key: string): T | null {
    // Attempt to get data from Greasemonkey storage (GMStorage) if it is supported.
    if (GMStorage.supported) {
      try {
        return GMStorage.get<T>(key);
      } catch {
        // If an error occurs during retrieval, ignore and fallback to the next storage option.
      }
    }

    // If Greasemonkey storage is not supported or an error occurred, attempt to get data from Web Storage
    // (LocalStorage) if available.
    if (LocalStorage.supported) {
      try {
        return LocalStorage.get<T>(key);
      } catch {
        // If an error occurs during retrieval, ignore and fallback to the next storage option.
      }
    }

    // If both Greasemonkey storage and Web Storage are not supported or an error occurred in both cases,
    // retrieve data from MemoryStorage as the last fallback option.
    return MemoryStorage.get<T>(key);
  }

  /**
   * Store the provided data associated with the given key in the supported storage options, with fallback support.
   * It first attempts to store data in Greasemonkey storage (GMStorage), then falls back to Web Storage
   * (LocalStorage) if available, and finally, if neither is supported or an error occurs in both cases,
   * it stores data in MemoryStorage.
   *
   * @param key - The key under which to store data in the supported storage options.
   * @param value - The data to be stored.
   */
  static set<T>(key: string, value: T): void {
    // Attempt to store data in Greasemonkey storage (GMStorage) if it is supported.
    if (GMStorage.supported) {
      try {
        return GMStorage.set<T>(key, value);
      } catch {
        // If an error occurs during storage, ignore and fallback to the next storage option.
      }
    }

    // If Greasemonkey storage is not supported or an error occurred, attempt to store data in Web Storage
    // (LocalStorage) if available.
    if (LocalStorage.supported) {
      try {
        return LocalStorage.set<T>(key, value);
      } catch {
        // If an error occurs during storage, ignore and fallback to the next storage option.
      }
    }

    // If both Greasemonkey storage and Web Storage are not supported or an error occurred in both cases,
    // store data in MemoryStorage as the last fallback option.
    return MemoryStorage.set<T>(key, value);
  }

  /**
   * Delete the data associated with the given key from the supported storage options, with fallback support.
   * It first attempts to delete data from Greasemonkey storage (GMStorage), then falls back to Web Storage
   * (LocalStorage) if available, and finally, if neither is supported or an error occurs in both cases,
   * it deletes data from MemoryStorage.
   *
   * @param key - The key for which to delete data from the supported storage options.
   */
  static delete(key: string): void {
    // Attempt to delete data from Greasemonkey storage (GMStorage) if it is supported.
    if (GMStorage.supported) {
      try {
        return GMStorage.delete(key);
      } catch {
        // If an error occurs during deletion, ignore and fallback to the next storage option.
      }
    }

    // If Greasemonkey storage is not supported or an error occurred, attempt to delete data from Web Storage
    // (LocalStorage) if available.
    if (LocalStorage.supported) {
      try {
        return LocalStorage.delete(key);
      } catch {
        // If an error occurs during deletion, ignore and fallback to the next storage option.
      }
    }

    // If both Greasemonkey storage and Web Storage are not supported or an error occurred in both cases,
    // delete data from MemoryStorage as the last fallback option.
    return MemoryStorage.delete(key);
  }
}
