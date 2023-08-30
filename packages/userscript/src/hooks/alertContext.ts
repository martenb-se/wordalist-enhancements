import {Context, createContext} from "preact";
import {AlertContextType} from "../@types/alertContextTypes";

const placeHolderValue: AlertContextType = {
  open: false,
  options: {
    title: "AlertContext placeholder title",
    text: "AlertContext placeholder text",
    okButtonText: "AlertContext placeholder OK",
    cancelButtonText: "AlertContext placeholder CANCEL",
    okCallback: () => {
      console.log("AlertContext.options.okCallback() placeholder function executed. " +
        "This should be replaced by a new function.");
    },
    cancelCallback: () => {
      console.log("AlertContext.options.okCallback() placeholder function executed. " +
        "This should be replaced by a new function.");
    }
  },
  setOpen: (): void => {
    console.log("AlertContext.setOpen() placeholder function executed. " +
      "This should be replaced by a new function.");
  },
  setClosed: (): void => {
    console.log("AlertContext.setClosed() placeholder function executed. " +
      "This should be replaced by a new function.");
  },
  setOptions: ({ title, text }): void => {
    console.log("AlertContext.setOptions() placeholder function executed. This should be replaced by a new function.");
    console.log(` - language: ${title}`);
    console.log(` - enableCustomSelection: ${text}`);
  },
};

export const AlertContext: Context<AlertContextType> = createContext(placeHolderValue);
