import scales from "./dates.json";

/**
 * Conception Calculator.
 *
 * @param {string} date - First Day of Your Last Period.
 * @param {number} scale - Average Length of Cycles.
 * @returns {string} Formatted conception date range.
 */
export function conception(date: string, scale: number): string {
  if (typeof date !== 'string') {
    throw new Error("Invalid date input type (use 'string')");
  }

  if (typeof scale !== 'number') {
    throw new Error("Invalid scale input type (use 'number')");
  }

  const day = new Date(date);

  // Find the matching scale in the scales array from dates.json
  const scaleMatch = scales.find(
    (el: { days: number; value1: number }) => el.days === scale,
  );
  if (!scaleMatch) {
    throw new Error('Invalid Scale');
  }

  // Calculate conception days based on the scale
  const conceptionDay1 = new Date(
    day.setDate(day.getDate() + scaleMatch.value1),
  );
  const conceptionDay2 = new Date(day.setDate(day.getDate() + 5));

  // Format the conception days
  const conceptionDay1Formatted = `${conceptionDay1.getDate().toString().padStart(2, '0')}/${(conceptionDay1.getMonth() + 1).toString().padStart(2, '0')}/${conceptionDay1.getFullYear()}`;
  const conceptionDay2Formatted = `${conceptionDay2.getDate().toString().padStart(2, '0')}/${(conceptionDay2.getMonth() + 1).toString().padStart(2, '0')}/${conceptionDay2.getFullYear()}`;

  return `${conceptionDay1Formatted} - ${conceptionDay2Formatted}`;
}
