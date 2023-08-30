import {useContext, useEffect, useState} from "preact/hooks";
import {JSXInternal} from "preact/src/jsx";
import {OneCustomSelectionStorageType, SectionSelectionContextType} from "./@types/customSelectionTypes";
import {NotificationContextType} from "./@types/notificationTypes";
import {SettingContextType} from "./@types/settingsTypes";
import {NotificationContext, NotificationType} from "./hooks/notificatonContext";
import {SettingsContext} from "./hooks/settingsContext";
import CustomSelectionSaveDialogue from "./components/Dialogue/CustomSelectionSaveDialogue";
import CustomSelectionsStorageDialogue from "./components/Dialogue/CustomSelectionsStorageDialogue";
import {SectionSelectionContext} from "./hooks/sectionSelectionContext";
import {LANG_NS_MAIN, PERSIST_KEY_LAST_PAGE} from "./constants";
import i18n from "./i18n";
import {isDateToday} from "./util/dateHandling";
import {verifyOnPagePractice, verifyOnPagePracticeEnd} from "./util/locationVerification";
import {getCustomSelectionHash} from "./util/hashHandling";
import {getCustomSelectionFromHash} from "./util/customSelectionHandling";
import {ScriptStorage} from "./imported/pionxzh/util/storage";
import AlertDialogue from "./components/Dialogue/AlertDialogue";
import FirebaseSyncDialogue from "./components/Dialogue/FirebaseSyncDialogue";
import NotificationToast from "./components/NotificationToast";
import SettingsDialogue from "./components/Dialogue/SettingsDialogue";

/**
 * Main component of the user script.
 *
 * @returns JSX element representing the main user script component.
 */
export function MainUserscriptComponent(): JSXInternal.Element {
  const notificationContext: NotificationContextType = useContext(NotificationContext);
  const settingsContext: SettingContextType = useContext(SettingsContext);
  const sectionSelectionContext: SectionSelectionContextType = useContext(SectionSelectionContext);

  const [addedScrollEventOnce, setAddedScrollEventOnce] = useState(false);
  const [updatedStatisticsOnce, setUpdatedStatisticsOnce] = useState(false);

  /**
   * An effect that is triggered when the component mounts or updates.
   * This effect performs several tasks including setting the last visited page, handling scroll behavior, and
   * updating statistics based on user interactions.
   */
  useEffect(() => {
    // Set current page & last page
    const lastPage: string | null = ScriptStorage.get<string>(PERSIST_KEY_LAST_PAGE);
    const currentPage = window.location.pathname;

    // Set last page for next page load
    ScriptStorage.set(PERSIST_KEY_LAST_PAGE, currentPage);

    // Add scroll event once
    if (!addedScrollEventOnce) {
      const curScrollBounds: { maxY: number, minY: number } = {
        maxY: window.scrollY,
        minY: window.scrollY
      };

      setAddedScrollEventOnce(true);
      addEventListener("scroll", () => {

        const topBarContainer: HTMLUListElement | null =
          document.querySelector(".TopBarContainer");

        if (!topBarContainer) {
          return;
        }

        // Set scroll bounds
        if (window.scrollY < curScrollBounds.minY ||
          topBarContainer.classList.contains("ScrollMinimize")) {
          curScrollBounds.minY = window.scrollY;
        }

        if (window.scrollY > curScrollBounds.maxY ||
          !topBarContainer.classList.contains("ScrollMinimize")) {
          curScrollBounds.maxY = window.scrollY;
        }

        // Update class
        if (window.scrollY > curScrollBounds.minY + 50) {
          // Scrolled down
          topBarContainer.classList.add('ScrollMinimize');
        } else if (window.scrollY < curScrollBounds.maxY - 50) {
          // Scrolled up
          topBarContainer.classList.remove('ScrollMinimize');
        }
      });
    }

    // Update statistics
    if (settingsContext.options.enableCustomSelection && !updatedStatisticsOnce) {
      setUpdatedStatisticsOnce(true);

      // If last page was a practice, and current page is an exercise end
      if (verifyOnPagePractice(lastPage ? lastPage : "") && verifyOnPagePracticeEnd(currentPage)) {
        // Match exercise ID for current page
        const regexpCurExerciseAndSections = /\/practice\/([0-9]+)\/([0-9,]+)\/practice\/end/;
        const matchExercise: RegExpMatchArray | null = window.location.pathname.match(regexpCurExerciseAndSections);

        if (matchExercise) {

          const [, matchExerciseID, matchSectionsIDs] = matchExercise;
          const sectionIDs: string[] = matchSectionsIDs.split(",");

          // Set hash code
          const sectionIDHashCode = getCustomSelectionHash({
            exerciseID: matchExerciseID,
            sectionsKeys: sectionIDs
          });

          const existingCustomSelection: OneCustomSelectionStorageType | null =
            getCustomSelectionFromHash({
              hash: sectionIDHashCode,
              sectionSelectionContext
            });

          // Update statistics
          if (existingCustomSelection) {
            const practicesToday =
              existingCustomSelection.lastPracticed &&
              isDateToday(new Date(existingCustomSelection.lastPracticed)) &&
              existingCustomSelection.practicesToday ? existingCustomSelection.practicesToday + 1 : 1;

            sectionSelectionContext.updateLastPracticedInCustomSelectionsStorage({hash: sectionIDHashCode});

            notificationContext.setOptions({
              title: i18n.t(`${LANG_NS_MAIN}:actionPracticeEndNotificationTitle`),
              text: i18n.t(`${LANG_NS_MAIN}:actionPracticeEndNotificationText`, {
                count: practicesToday,
                exercise: existingCustomSelection.name
              }),
              type: NotificationType.NOTIFICATION
            });
          }
        }
      }
    }
  });

  return (
    <>
      {/* Synchronization */}
      <FirebaseSyncDialogue/>
      {/* Custom Selections */}
      <CustomSelectionsStorageDialogue/>
      {/* Page: Exercise - Custom Selections */}
      <CustomSelectionSaveDialogue/>
      {/* Dialogues */}
      <SettingsDialogue/>
      <AlertDialogue/>
      {/* Notifications */}
      <NotificationToast options={notificationContext.options}/>
    </>
  );
}
