import {CustomSelectionType} from "../@types/customSelectionTypes";
import {
  ELEM_PAGE_EXERCISE_EXPLORE_SECTIONS_TOOLBAR_CONTAINER_ID,
  ELEM_PAGE_EXERCISE_SECTIONS_ADDITION_BASE_ID,
  ELEM_PAGE_EXERCISE_SECTIONS_TOOLBAR_CONTAINER_ID, ELEM_WL_PAGE_EXERCISE_EXPLORE_SECTION_CONTAINER_SELECTOR,
  ELEM_WL_PAGE_EXERCISE_SECTION_ROW_ANCHOR_SELECTOR,
  ELEM_WL_PAGE_EXERCISE_SECTION_ROW_PRACTICE_ANCHOR_SELECTOR,
  ELEM_WL_PAGE_EXERCISE_SECTION_ROWS_SELECTOR,
  ELEM_WL_PAGE_EXERCISE_SECTIONS_CONTAINER_SELECTOR,
  ELEM_WL_PAGE_EXERCISE_TITLE_SELECTOR,
  RE_PAGE_EXERCISE_PRACTICE_LINK
} from "../constants";

/**
 * Prepares the toolbar container for the exercise page.
 */
export function prepareExercisePageToolbar(): void {
  const exerciseSectionsContainer: Element | null =
    document.querySelector(ELEM_WL_PAGE_EXERCISE_SECTIONS_CONTAINER_SELECTOR);
  const exerciseSectionsContainerParent: ParentNode | null | undefined = exerciseSectionsContainer?.parentNode;

  // Create toolbar container element
  const additionsElem: HTMLDivElement = document.createElement("div");
  additionsElem.id = ELEM_PAGE_EXERCISE_SECTIONS_TOOLBAR_CONTAINER_ID;

  // Insert toolbar container before sections container
  exerciseSectionsContainerParent?.insertBefore(additionsElem, exerciseSectionsContainer);

}

/**
 * Prepares the toolbar container for the exercise explore section page.
 */
export function prepareExerciseExploreSectionPageToolbar(): void {
  const exerciseSectionsContainer: Element | null =
      document.querySelector(ELEM_WL_PAGE_EXERCISE_EXPLORE_SECTION_CONTAINER_SELECTOR);
  const exerciseSectionsContainerParent: ParentNode | null | undefined = exerciseSectionsContainer?.parentNode;

  // Create toolbar container element
  const additionsElem: HTMLDivElement = document.createElement("div");
  additionsElem.id = ELEM_PAGE_EXERCISE_EXPLORE_SECTIONS_TOOLBAR_CONTAINER_ID;

  // Insert toolbar container before sections container
  exerciseSectionsContainerParent?.insertBefore(additionsElem, exerciseSectionsContainer);

}

/**
 * Prepares the exercise page sections and returns information about the added elements.
 * @returns An array of CustomSelectionType objects containing information about the added elements.
 */
export function prepareExercisePageSections(): CustomSelectionType[] {
  // Find title
  const exerciseTitleElement: HTMLAnchorElement | null = document.querySelector(ELEM_WL_PAGE_EXERCISE_TITLE_SELECTOR);

  const exerciseTitle = exerciseTitleElement ? exerciseTitleElement.innerText : "Unknown exercise";

  // Select all rows
  const exerciseSectionRows: NodeListOf<HTMLTableRowElement> =
    document.querySelectorAll(ELEM_WL_PAGE_EXERCISE_SECTION_ROWS_SELECTOR);
  const addedElementsInfo: CustomSelectionType[] = [];

  // Go through all sections rows
  exerciseSectionRows.forEach((curSectionRowElem: HTMLTableRowElement): void => {
    // Select the "Practice" button element
    const practiceBtnElem: HTMLAnchorElement | null =
      curSectionRowElem.querySelector(ELEM_WL_PAGE_EXERCISE_SECTION_ROW_PRACTICE_ANCHOR_SELECTOR);

    // Select parent to "Practice" button element
    const practiceBtnElemParent: ParentNode | null | undefined = practiceBtnElem?.parentNode;

    // Select the section link element
    const sectionNameElem: HTMLAnchorElement | null | undefined =
      practiceBtnElemParent?.querySelector(ELEM_WL_PAGE_EXERCISE_SECTION_ROW_ANCHOR_SELECTOR);

    // Match exercise ID and section ID in the singular section practice address
    const matchIDs: RegExpMatchArray | null | undefined = practiceBtnElem?.href.match(RE_PAGE_EXERCISE_PRACTICE_LINK);

    // Before taking any actions, make sure variables are set
    if (!practiceBtnElem || !practiceBtnElemParent || !sectionNameElem || !matchIDs) {
      return;
    }

    // Create addition element
    const additionsElem: HTMLDivElement = document.createElement("div");
    additionsElem.id = `${ELEM_PAGE_EXERCISE_SECTIONS_ADDITION_BASE_ID}-${matchIDs[1]}-${matchIDs[2]}`;

    // Insert addition element after "Practice" button so that "float: right" puts it to the left of the
    // "Practice" button.
    practiceBtnElemParent.insertBefore(additionsElem, practiceBtnElem.nextSibling);

    // Append to added IDs
    addedElementsInfo.push({
      elementID: additionsElem.id,
      exerciseID: matchIDs[1],
      sectionID: matchIDs[2],
      exerciseTitle,
      sectionTitle: sectionNameElem.innerText
    });

  });
  return addedElementsInfo;
}
