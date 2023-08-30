/**
 * Checks if a given date is today's date.
 * @param dateObject - The date to be checked.
 * @returns True if the provided date is today's date, false otherwise.
 */
export function isDateToday(dateObject: Date) {
  const today: Date = new Date();

  return (
    dateObject.getFullYear() === today.getFullYear() &&
    dateObject.getMonth() === today.getMonth() &&
    dateObject.getDate() === today.getDate()
  );
}
