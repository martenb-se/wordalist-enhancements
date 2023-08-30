import {useState} from "preact/hooks";
import {useContext} from "preact/compat";
import {NotificationContextType} from "../../../@types/notificationTypes";
import {NotificationContext, NotificationType} from "../../../hooks/notificatonContext";
import {
  ELEM_WL_PAGE_EXERCISE_EXPLORE_SECTION_LINK_FIRST_PAGE_SELECTOR,
  ELEM_WL_PAGE_EXERCISE_EXPLORE_SECTION_LINK_NEXT_PAGE_SELECTOR,
  ELEM_WL_PAGE_EXERCISE_EXPLORE_SECTION_QUESTIONS_TABLE_SELECTOR,
  LANG_NS_MAIN,
  VAL_PAGE_EXERCISE_EXPLORE_SECTION_MAX_ITERATIONS
} from "../../../constants";
import i18n from "../../../i18n";
import * as Toolbar from '@radix-ui/react-toolbar';
import {FilePlusIcon} from '@radix-ui/react-icons';
import '../styles.css';
import './styles.css';

/**
 * Fetches all questions from multiple section pages and displays them.
 *
 * @returns A promise with information about successful loading and the number of loaded pages.
 */
const fetchAllQuestions = async (): Promise<{success: boolean, loadedPages: number} | undefined> => {
  const contentContainer: Element | null = document.querySelector('.wl-search');

  // Reset container contents before adding questions from all pages.
  if (contentContainer) {
    contentContainer.innerHTML = "";
  }

  // Current document is whole document.
  let currentDocument: Document = document;

  // First next link is first page. Everything will work regardless of which page the user is at.
  let currentNextLink: Element | null =
    currentDocument.querySelector(ELEM_WL_PAGE_EXERCISE_EXPLORE_SECTION_LINK_FIRST_PAGE_SELECTOR);

  let successfullyLoadedPages = 0;
  let errorDuringQuestionLoading = false;

  for (let i = 0; currentNextLink && i < VAL_PAGE_EXERCISE_EXPLORE_SECTION_MAX_ITERATIONS; i++) {
    const currentNextHref = (currentNextLink as HTMLAnchorElement).href;

    try {
      const response: Response = await fetch(currentNextHref);
      const html = await response.text();

      const parser: DOMParser = new DOMParser();
      currentDocument = parser.parseFromString(html, 'text/html');

      const questionsTable: Element | null =
        currentDocument.querySelector(ELEM_WL_PAGE_EXERCISE_EXPLORE_SECTION_QUESTIONS_TABLE_SELECTOR);

      if (questionsTable && contentContainer) {
        const titleElement: HTMLHeadingElement = document.createElement("h3");
        titleElement.innerText = i18n.t(`${LANG_NS_MAIN}:page`, {count: i + 1});
        titleElement.classList.add("HeadingPage");
        contentContainer.append(titleElement);
        contentContainer.append(questionsTable);

        successfullyLoadedPages++;

      } else {
        currentNextLink = null;
        errorDuringQuestionLoading = true;
        break;
      }

      // Next
      currentNextLink =
        currentDocument.querySelector(ELEM_WL_PAGE_EXERCISE_EXPLORE_SECTION_LINK_NEXT_PAGE_SELECTOR);

    } catch (err) {
      throw Error(`Failed to load pages. Reason: ${err}`);
    }

  }

  if (errorDuringQuestionLoading) {
    throw Error("Failed to load pages");
  } else if (successfullyLoadedPages >= 0) {
    return {
      success: true,
      loadedPages: successfullyLoadedPages
    }
  }

};

/**
 * Toolbar component for loading all section questions.
 *
 * @returns JSX element representing the toolbar.
 */
const ExploreSectionsToolbar = () => {
  const notificationContext: NotificationContextType = useContext(NotificationContext);
  const [pagesHaveBeenLoaded, setPagesHaveBeenLoaded] = useState(false);

  function onClickShowAllButton(): void {
    fetchAllQuestions().then((result: {success: boolean, loadedPages: number} | undefined): void => {
      const {loadedPages, success} = result ? result : {loadedPages: 0, success: false};

      if (success && loadedPages > 0) {
        notificationContext.setOptions({
          type: NotificationType.NOTIFICATION,
          title: i18n.t(`${LANG_NS_MAIN}:pageExerciseExploreSectionNotificationLoadedPagesOfQuestionsTitle`),
          text: i18n.t(`${LANG_NS_MAIN}:pageExerciseExploreSectionNotificationLoadedPagesOfQuestionsText`,
            {count: loadedPages})
        });
        setPagesHaveBeenLoaded(true);

      } else {
        notificationContext.setOptions({
          type: NotificationType.WARNING,
          title: i18n.t(`${LANG_NS_MAIN}:pageExerciseExploreSectionWarningDuringQuestionLoadTitle`),
          text: i18n.t(`${LANG_NS_MAIN}:pageExerciseExploreSectionWarningDuringQuestionLoadText`)
        });
      }
    }).catch((): void => {
      notificationContext.setOptions({
        type: NotificationType.ERROR,
        title: i18n.t(`${LANG_NS_MAIN}:pageExerciseExploreSectionErrorDuringQuestionLoadTitle`),
        text: i18n.t(`${LANG_NS_MAIN}:pageExerciseExploreSectionErrorDuringQuestionLoadText`)
      });
    });
  }

  return (<Toolbar.Root className="ToolbarRoot ExploreSectionsToolbarRoot" aria-label="Formatting options">
      <Toolbar.Button
        className="ToolbarButton"
        disabled={pagesHaveBeenLoaded}
        onClick={onClickShowAllButton}>
        <FilePlusIcon/>
        <span className="ToolbarButtonText">
          {!pagesHaveBeenLoaded &&
            i18n.t(`${LANG_NS_MAIN}:pageExerciseExploreSectionShowAllQuestionsButton`) ||
            i18n.t(`${LANG_NS_MAIN}:pageExerciseExploreSectionShowAllQuestionsButtonDisabled`)}
        </span>
      </Toolbar.Button>
    </Toolbar.Root>
  )
}

export default ExploreSectionsToolbar;
