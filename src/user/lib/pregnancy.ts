// import scales from "./dates.json";
//
// /**
//  * Pregnancy Calculator.
//  *
//  * @param {string} date - First Day of Your Last Period.
//  * @param {number} scale - Average Length of Cycles.
//  * @returns {Object} Pregnancy Data.
//  */
// function formatDate(date: Date): string {
//   return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
// }
//
// function getMilestone(week: number): string {
//   switch (week) {
//     case 3:
//       return 'Baby conceived';
//     case 4:
//       return 'Pregnancy test positive';
//     case 6:
//     case 7:
//       return 'Heartbeat detectable by ultrasound';
//     case 13:
//       return 'Miscarriage risk decreases';
//     case 18:
//     case 19:
//     case 20:
//     case 21:
//       return 'Baby begins making noticeable movements, can hear sounds, and gender can be found out.';
//     case 23:
//       return 'Premature baby may survive';
//     case 28:
//       return 'Baby can breathe';
//     case 38:
//     case 39:
//     case 40:
//     case 41:
//     case 42:
//       return 'Full Term';
//     default:
//       return 'No milestone reached';
//   }
// }
//
// export function pregnancy(
//   date: string,
//   scale: number,
// ): {
//   currentWeek: string;
//   currentDate: string;
//   conceivedBaby: string;
//   pregnancyPercentage: string;
//   trimester: string;
//   milestone: string;
// } {
//   if (typeof date !== 'string') {
//     throw new Error("Invalid date input type (use 'string')");
//   }
//
//   if (typeof scale !== 'number') {
//     throw new Error("Invalid scale input type (use 'number')");
//   }
//
//   const scaleMatch = scales.find((el: { days: number }) => el.days === scale);
//   if (!scaleMatch) {
//     throw new Error('Invalid Scale');
//   }
//
//   const currentDay = new Date();
//   const currentDateFormatted = formatDate(currentDay);
//   const lmp = new Date(date);
//
//   const currentWeek = new Date(
//     currentDay.setDate(currentDay.getDate() - scaleMatch['value2']),
//   );
//   const week = currentWeek.getWeek();
//   const diffInMs = Math.abs(currentDay.getTime() - lmp.getTime());
//   const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
//   const conceivedDay = new Date(
//     lmp.setDate(lmp.getDate() + scaleMatch['value1'] + 2),
//   );
//   const conceived = formatDate(conceivedDay);
//
//   if (isNaN(week)) {
//     throw new Error('Invalid Week Day');
//   }
//
//   const percentagePregnancy = Math.round((diffInDays / 280) * 100);
//
//   const trimester =
//     week <= 12
//       ? 'First Trimester'
//       : week <= 27
//         ? 'Second Trimester'
//         : week <= 42
//           ? 'Third Trimester'
//           : 'Invalid Week Day';
//
//   const milestone = getMilestone(week);
//
//   return {
//     currentWeek: `${week}`,
//     currentDate: currentDateFormatted,
//     conceivedBaby: conceived,
//     pregnancyPercentage: `${percentagePregnancy}`,
//     trimester,
//     milestone,
//   };
// }
