/**
 * Options for configuring an alert in the AlertContext.
 */
export type AlertContextOptionsType = {
  /** The title of the alert. */
  title: string,
  /** The text content of the alert. */
  text: string,
  /** The label text for the OK button. */
  okButtonText: string,
  /** The label text for the Cancel button. */
  cancelButtonText: string,
  /** The callback function to be executed when the OK button is clicked. */
  okCallback: () => void,
  /** The callback function to be executed when the Cancel button is clicked. */
  cancelCallback: () => void
}

/**
 * The type representing the alert context.
 */
export type AlertContextType = {
  /** Whether the alert is currently open. */
  open: boolean,
  /** The options for the alert. */
  options: AlertContextOptionsType,
  /** Function to set the alert as open. */
  setOpen: () => void,
  /** Function to set the alert as closed. */
  setClosed: () => void,
  /**
   * Function to update the options for the alert.
   * @param {AlertContextOptionsType} options - The new options for the alert.
   */
  setOptions: (options: AlertContextOptionsType) => void
}
