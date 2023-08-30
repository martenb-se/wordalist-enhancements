import { useEffect, useRef, useState } from "preact/hooks";
import {NotificationOptionsType} from "../../@types/notificationTypes";
import {NotificationType} from "../../hooks/notificatonContext";
import {LANG_NS_MAIN} from "../../constants";
import i18n from "../../i18n";
import * as Toast from "@radix-ui/react-toast";
import "./styles.css";

/**
 * Component for displaying notification toasts.
 *
 * @param props - The properties for the notification toast.
 * @returns JSX element representing the notification toast.
 */
const NotificationToast = (
  props: { options: NotificationOptionsType }) => {
  const [open, setOpen] = useState(false);
  const timerRef = useRef(0);

  /**
   * Reacts to changes in notification options and displays a toast.
   */
  useEffect(() => {
    if (props.options.title.length > 0 && props.options.text.length > 0) {
      setOpen(true);
      return () => clearTimeout(timerRef.current);
    }
  }, [props.options]);

  return (
    <Toast.Provider swipeDirection="right">
      <Toast.Root className={
        `ToastRoot
        ${props.options.type === NotificationType.WARNING ? " NotificationWarn" : ""}
            ${props.options.type === NotificationType.ERROR ? " NotificationErr" : ""}`
      } open={open} onOpenChange={setOpen} duration={props.options.timeout}>
        <Toast.Title className={
          `ToastTitle
          ${props.options.type === NotificationType.WARNING ? " NotificationWarn" : ""}
            ${props.options.type === NotificationType.ERROR ? " NotificationErr" : ""}`
        }>{i18n.t(`${LANG_NS_MAIN}:shortTitle`)}: {props.options.title}</Toast.Title>
        <Toast.Description asChild>
          <div className={
            `ToastDescription
            ${props.options.type === NotificationType.WARNING ? " NotificationWarn" : ""}
            ${props.options.type === NotificationType.ERROR ? " NotificationErr" : ""}`
          }>
            {props.options.text}
          </div>
        </Toast.Description>
        {props.options.showClose && <Toast.Action className="ToastAction" asChild altText="Close">
          <button className={
            `Button
            ${props.options.type === NotificationType.NOTIFICATION ? " green" : ""}
            ${props.options.type === NotificationType.WARNING ||
              props.options.type === NotificationType.ERROR ? " violet" : ""}`
          }>OK</button>
        </Toast.Action>}
      </Toast.Root>
      <Toast.Viewport className="ToastViewport" />
    </Toast.Provider>
  );
};

export default NotificationToast;
