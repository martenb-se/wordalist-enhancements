import {NotificationType} from "../hooks/notificatonContext";

/**
 * Logs a notification message to the console.
 * @param params - The notification parameters.
 * @param params.title - The title of the notification.
 * @param params.text - The text content of the notification.
 * @param params.type - The type of notification (NotificationType).
 */
export function logNotification({title, text, type} : {title: string, text: string, type: NotificationType}): void {
  let preMessage = "WLE Undefined";
  if (type === NotificationType.NOTIFICATION) {
    preMessage = "WLE Info";
  } else if (type === NotificationType.ERROR) {
    preMessage = "WLE Error";
  } else if (type === NotificationType.WARNING) {
    preMessage = "WLE Warning";
  }
  console.log(`${preMessage} :: (${title}) ${text}`);
}
