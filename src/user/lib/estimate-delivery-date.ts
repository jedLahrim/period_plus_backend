// import * as scales from "./dates.json";
// import { PregnancyMilestones } from "./enums/pregnancy-milstones.enum";
// import { ConflictException } from "@nestjs/common";
// import { PregnancyTrimester } from "../../posts/enum/week-type.enum";
// import { clamp, round } from "lodash";
// import { PregnancyData } from "../entities/pregnancy-data.entity";
//
// /**
//  * Estimate Delivery Date Calculator.
//  *
//  * @param {string} date - First Day of Your Last Period.
//  * @param {number} scale - Average Length of Cycles.
//  * @returns {object} Estimate Delivery Date Details.
//  * @throws {Error} Throws error if invalid inputs are provided.
//  */
// declare global {
//   interface Date {
//     getWeek(): number;
//   }
// }
//
// Date.prototype.getWeek = function (): number {
//   const firstDayOfYear = new Date(this.getFullYear(), 0, 1);
//   const daysSinceFirstDay = Math.floor(
//     (this.getTime() - firstDayOfYear.getTime()) / 86400000,
//   );
//   const weekNumber = Math.floor(daysSinceFirstDay / 7) + 1;
//   return weekNumber;
// };
//
// function formatDate(date: Date): string {
//   return `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear()}`;
// }
//
// function getMilestone(week: number) {
//   switch (week) {
//     case 3:
//       return PregnancyMilestones.BABY_CONCEIVED;
//     case 4:
//       return PregnancyMilestones.PREGNANCY_TEST_POSITIVE;
//     case 6:
//     case 7:
//       return PregnancyMilestones.HEARTBEAT_DETECTABLE;
//     case 13:
//       return PregnancyMilestones.MISCARRIAGE_RISK_DECREASES;
//     case 18:
//     case 19:
//     case 20:
//     case 21:
//       return PregnancyMilestones.BABY_MOVEMENTS_DETECTED;
//     case 23:
//       return PregnancyMilestones.PREMATURE_SURVIVAL;
//     case 28:
//       return PregnancyMilestones.BABY_CAN_BREATHE;
//     case 38:
//     case 39:
//     case 40:
//     case 41:
//     case 42:
//       return PregnancyMilestones.FULL_TERM;
//     default:
//       return PregnancyMilestones.DEFAULT;
//   }
// }
//
// export function estimateDate(
//   date: string,
//   cycleDuration: number,
// ): PregnancyData {
//   const scaleMatch = scales.find(
//     (el: { days: number }) => el.days === cycleDuration,
//   );
//   if (!scaleMatch) {
//     throw new ConflictException('Invalid Scale');
//   }
//
//   const lmp = new Date(date);
//   if (isNaN(lmp.getTime())) {
//     throw new ConflictException('Invalid Date');
//   }
//
//   const estimateDeliveryAt = new Date(
//     new Date(date).setDate(lmp.getDate() + 280 + scaleMatch.value2 - 1),
//   );
//   const currentDay = new Date();
//
//   const weekNumberSinceLMP = Math.floor(
//     (currentDay.getTime() - lmp.getTime()) / (1000 * 60 * 60 * 24 * 7),
//   );
//   const estimatedConceptionAt = new Date(
//     new Date(date).setDate(lmp.getDate() + scaleMatch.value1 + 2),
//   );
//
//   const diffInMs = Math.abs(currentDay.getTime() - lmp.getTime());
//   const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
//   const pregnancyPercentage = clamp(round((diffInDays / 280) * 100, 2), 0, 100);
//
//   // Calculate the obstetric term (weeks and days)
//   const obstetricWeeks = Math.floor(diffInDays / 7);
//   const obstetricDays = diffInDays % 7;
//
//   // Get milestone based on the weekNumberSinceLMP
//   const milestone = getMilestone(weekNumberSinceLMP);
//
//   const trimester =
//     weekNumberSinceLMP <= 12
//       ? PregnancyTrimester.TRIMESTER1
//       : weekNumberSinceLMP <= 27
//         ? PregnancyTrimester.TRIMESTER2
//         : weekNumberSinceLMP <= 42
//           ? PregnancyTrimester.TRIMESTER3
//           : PregnancyTrimester.INVALID_WEEK;
//
//   return new PregnancyData({
//     estimateDeliveryAt,
//     estimatedConceptionAt,
//     pregnancyPercentage,
//     trimester,
//     milestone,
//     cycleDuration,
//     estimatedLMPAt: lmp,
//     obstetricTerm: {
//       weeks: obstetricWeeks,
//       days: obstetricDays,
//     },
//   });
// }
