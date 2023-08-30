import {Context, createContext} from "preact";
import {NotificationOptionsType, NotificationContextType} from "../@types/notificationTypes";

/**
 * Represents the types of notifications.
 */
export enum NotificationType {
  /**
   * A general notification.
   */
  NOTIFICATION,
  /**
   * A warning notification.
   */
  WARNING,
  /**
   * An error notification.
   */
  ERROR
}

const placeHolderValue: NotificationContextType = {
  options: {
    title: "NotificationContext placeholder title",
    text: "NotificationContext placeholder text",
    type: NotificationType.NOTIFICATION,
    timeout: 5000,
    showClose: false
  },
  setOptions: (
    {title, text, type, timeout, showClose}: NotificationOptionsType) => {
    console.log(`NotificationContext placeholder function executed. This should be replaced by a new function.`);
    console.log(` - title: ${title}`);
    console.log(` - text: ${text}`);
    console.log(` - type: ${type}`);
    console.log(` - timeout: ${timeout}`);
    console.log(` - showClose: ${showClose}`);
  }
};

/**
 * The NotificationContext created using the placeholder value.
 */
export const NotificationContext: Context<NotificationContextType> = createContext(placeHolderValue);
