/**
 * Calculates Pregnancy weight gain.
 *
 * @param {number} currentWeight - Current weight of a woman.
 * @param {number} weight - Pre-pregnancy-info weight of a woman.
 * @param {string} weightType - Weight type (Pound or Kgs).
 * @param {number} height - Height of a woman.
 * @param {string} heightType - Height type (Feet, Inches, or Meters).
 * @returns {string[]} Pregnancy weight gain information.
 */
import { WeightType } from './enums/weight-type.enum';
import { HeightType } from './enums/height-type.enum';
import { BodyMassIndexStatus } from './enums/body-mass-index.enum';

export function pregnancyWeightGain(
  currentWeight: number,
  weight: number,
  weightType: WeightType,
  height: number,
  heightType: HeightType,
): string[] {
  try {
    const weightMultiplier = weightType === WeightType.POUND ? 0.453592 : 1;
    const heightMultiplier =
      heightType === HeightType.INCHES
        ? 0.0254
        : heightType === HeightType.FEET
          ? 0.3048
          : 1;

    const weightInKgs = weight * weightMultiplier;
    const currentWeightInKgs = currentWeight * weightMultiplier;
    const heightInMeters = height * heightMultiplier;

    const bmi = weightInKgs / heightInMeters ** 2;
    let bmiStatus: BodyMassIndexStatus;
    if (bmi < 18.5) {
      bmiStatus = BodyMassIndexStatus.UNDERWEIGHT;
    } else if (bmi < 25) {
      bmiStatus = BodyMassIndexStatus.NORMAL_WEIGHT;
    } else if (bmi < 30) {
      bmiStatus = BodyMassIndexStatus.OVERWEIGHT;
    } else {
      bmiStatus = BodyMassIndexStatus.OBESE;
    }

    const futureWeightInKgs1 = weightInKgs + 5.77;
    const futureWeightInKgs2 = weightInKgs + 8.2;
    const futureWeight = `${futureWeightInKgs1.toFixed(1)} kg - ${futureWeightInKgs2.toFixed(1)} kg`;

    return [
      `${bmi.toFixed(2)} (${bmiStatus})`,
      `${currentWeightInKgs.toFixed(2)} kg`,
      futureWeight,
    ];
  } catch (err) {
    throw new Error(`Error: ${err.message}`);
  }
}
