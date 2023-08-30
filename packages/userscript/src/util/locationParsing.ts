/**
 * Retrieves the exercise ID from the current URL path.
 * @returns The exercise ID extracted from the URL path, or null if not found.
 */
export function getExerciseIdFromLocation(): string | null {
  const matchID: RegExpMatchArray | null = window.location.pathname.match(/\/exercise\/([0-9]+)/);
  return matchID ? matchID[1] : null;
}
