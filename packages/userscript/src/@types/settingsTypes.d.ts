export type SettingsOptionsType = {
  /**
   * Indicates which language is used.
   */
  language?: string
  /**
   * Indicates whether custom sections selections is enabled in the settings.
   */
  enableCustomSelection?: boolean
  /**
   * Indicates whether loading of all pages functionality is enabled in the settings.
   */
  enableLoadAllPages?: boolean
  /**
   * Indicates whether Firebase synchronization functionality is enabled in the settings.
   */
  enableFirebaseSync?: boolean
  /**
   * Indicates which Firebase configuration is used.
   */
  firebaseConfig?: string | null
}

export type SettingContextType = {
  /**
   * Indicates whether the settings dialogue is open or closed.
   */
  open: boolean,
  /**
   * Options related to the settings.
   */
  options: SettingsOptionsType,
  /**
   * Sets the settings as open.
   */
  setOpen: () => void,
  /**
   * Sets the settings as closed.
   */
  setClosed: () => void,
  /**
   * Sets the options for the settings.
   * @param options - The options to set for the settings.
   * @param options.language - Indicates which language is used.
   * @param options.enableCustomSelection - Indicates whether custom sections selections are enabled in the settings.
   * @param options.enableLoadAllPages - Indicates whether loading of all pages functionality is enabled in
   * the settings.
   * @param options.enableFirebaseSync - Indicates whether Firebase synchronization functionality is enabled in
   * the settings.
   * @param options.firebaseConfig - Indicates which Firebase configuration is used.
   */
  setOptions: (
    {
      language,
      enableCustomSelection,
      enableLoadAllPages,
      enableFirebaseSync,
      firebaseConfig
    }: SettingsOptionsType) => void
}
