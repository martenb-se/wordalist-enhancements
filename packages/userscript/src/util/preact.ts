/**
 * Waits synchronously for an element with the specified ID to be present in the DOM.
 * The function will continuously check for the element until it is found or the timeout is reached.
 * @param elementToWaitForSelector - The CSS selector of the element to wait for.
 * @param [timeout=1000] - The maximum time to wait for the element, in milliseconds. Defaults to 1000ms.
 * @returns The DOM element that matches the provided ID.
 * @throws {Error} Throws an error if the element is not found within the specified timeout.
 */
export function synchronousWaitForElement(elementToWaitForSelector: string, timeout = 1000): Element {
  let elementToWaitFor: Element | null = document.querySelector(elementToWaitForSelector);
  const start = Date.now();
  while (!elementToWaitFor && Date.now() - start < timeout) {
    elementToWaitFor = document.querySelector(elementToWaitForSelector);
  }

  if (!elementToWaitFor) {
    throw new Error(`synchronousWaitForElement(): Element '${elementToWaitForSelector}' was not found`);
  }

  return elementToWaitFor;
}

/**
 * Removes any duplicated component element (possibly caused by) Preact's createPortal function.
 * This function is used to prevent multiple instances of the component from being added to the DOM
 * when using portals.
 *
 * @param componentElementID - The ID of the component element to check and remove if duplicated.
 * @remarks
 *
 * Using portals according to the documentation may cause components to be duplicated upon rerender, even if following
 * the official documentation provided by Preact (see https://preactjs.com/guide/v10/switching-to-preact/#portals).
 * This function helps to address this issue by checking if the component element already exists in the DOM and
 * removes it if found, preventing duplicates.
 * Note: The root cause of this behavior is not clearly known, but this function serves as a workaround to
 * handle duplicates.
 */
export function removeDuplicatedComponent(componentElementID: string): void {
  const componentElement: Element | null = document.getElementById(componentElementID);
  if (componentElement) {
    componentElement.remove();
  }
}


