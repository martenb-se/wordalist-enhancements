/**
 * Verifies if the current page is an exercise page.
 * @param address - Optional URL address to perform verification on.
 * @returns True if the current page is an exercise page, false otherwise.
 */
export function verifyOnPageExercise(address?: string): boolean {
  if (address) {
    return /\/exercise\/\d+$/.test(address);
  } else {
    return /\/exercise\/\d+$/.test(window.location.pathname);
  }
}

/**
 * Verifies if the current page is an explore exercise section page.
 * @param address - Optional URL address to perform verification on.
 * @returns True if the current page is an explore exercise section page, false otherwise.
 */
export function verifyOnPageExerciseExploreSection(address?: string): boolean {
  if (address) {
    return /\/exercise\/\d+\/section\/\d+/.test(address);
  } else {
    return /\/exercise\/\d+\/section\/\d+/.test(window.location.pathname);
  }
}

/**
 * Verifies if the current page is a practice question page.
 * @param address - Optional URL address to perform verification on.
 * @returns True if the current page is a practice question page, false otherwise.
 */
export function verifyOnPagePractice(address?: string): boolean {
  if (address) {
    return /\/practice\/\d+\/[\d,]+\/question\/\d+/.test(address);
  } else {
    return /\/practice\/\d+\/[\d,]+\/question\/\d+/.test(window.location.pathname);
  }
}

/**
 * Verifies if the current page is the end of a practice session.
 * @param address - Optional URL address to perform verification on.
 * @returns True if the current page is the end of a practice session, false otherwise.
 */
export function verifyOnPagePracticeEnd(address?: string): boolean {
  if (address) {
    return /\/practice\/\d+\/[\d,]+\/practice\/end/.test(address);
  } else {
    return /\/practice\/\d+\/[\d,]+\/practice\/end/.test(window.location.pathname);
  }

}

/**
 * Verifies if the current page is a logged-in user page.
 * @param address - Optional URL address to perform verification on.
 * @returns True if the current page is a logged-in user page, false otherwise.
 */
export function verifyOnLoggedInPage(address?: string): boolean {
  if (address) {
    return /^\/(user\/(profile|edit)|(exercise|practice)\/\d+|public\/(exercise|charts|user|reviews))/.test(address);
  } else {
    return /^\/(user\/(profile|edit)|(exercise|practice)\/\d+|public\/(exercise|charts|user|reviews))/
      .test(window.location.pathname);
  }
}
