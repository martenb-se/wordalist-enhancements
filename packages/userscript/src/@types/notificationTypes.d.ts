import {NotificationType} from "../hooks/notificatonContext";

/**
 * Represents the options for a notification.
 */
export type NotificationOptionsType = {
  /**
   * The title of the notification.
   */
  title: string,
  /**
   * The main text content of the notification.
   */
  text: string,
  /**
   * The type of the notification.
   */
  type: NotificationType,
  /**
   * The timeout duration for the notification (in milliseconds).
   */
  timeout?: number,
  /**
   * Indicates whether a close button should be displayed for the notification.
   */
  showClose?: boolean
}

/**
 * Represents the state of a notification.
 */
export type NotificationContextType = {
  options: {
    /**
     * The title of the notification.
     */
    title: string,
    /**
     * The main text content of the notification.
     */
    text: string,
    /**
     * The type of the notification.
     */
    type: NotificationType,
    /**
     * The timeout duration for the notification (in milliseconds).
     */
    timeout: number,
    /**
     * Indicates whether a close button should be displayed for the notification.
     */
    showClose: boolean
  },
  /**
   * Sets the options for the notification context.
   * @param options - The options to set for the notification context.
   * @param options.title - The title of the notification.
   * @param options.text - The main text content of the notification.
   * @param options.type - The type of the notification.
   * @param [options.timeout] - The timeout duration for the notification (in milliseconds).
   * @param [options.showClose] - Indicates whether a close button should be displayed for the notification.
   */
  setOptions: (
    {
      title,
      text,
      type,
      timeout,
      showClose
    }: NotificationOptionsType) => void
}
