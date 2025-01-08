import scales from "./dates.json";

/**
 * Ovulation Calculator.
 *
 * @param {string} date - First Day of Your Last Period.
 * @param {number} scale - Average Length of Cycles.
 * @returns {string} Ovulation days.
 */
export function ovulation(date: string, scale: number): string {
  if (typeof date !== 'string') {
    throw new Error("Invalid date input type (use 'string')");
  }

  if (typeof scale !== 'number') {
    throw new Error("Invalid scale input type (use 'number')");
  }

  const day = new Date(date);

  const scaleMatch = scales.find(
    (el: { days: number; value1: number }) => el.days === scale,
  );

  if (!scaleMatch) {
    throw new Error('Invalid Scale');
  }

  const ovulationDay1 = new Date(
    day.setDate(day.getDate() + scaleMatch.value1),
  );
  const ovulationDay2 = new Date(day.setDate(day.getDate() + 5));
  const ovulationDay3 = new Date(day.setDate(day.getDate() - 3));

  const formatDate = (date: Date): string =>
    `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;

  return `${formatDate(ovulationDay1)} - ${formatDate(ovulationDay2)}, ${formatDate(ovulationDay3)}`;
}
