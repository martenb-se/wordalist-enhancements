/**
 * @see https://www.i18next.com/overview/typescript#create-a-declaration-file
 */

import { resources, defaultNS } from "../i18n";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: typeof defaultNS;
    resources: typeof resources["ns1"];
  }
}
