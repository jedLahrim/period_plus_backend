import * as scales from './dates.json';

interface PeriodResult {
  period: string;
  mostProbableOvulationDays: string;
}

interface PeriodInput {
  avgCycleLength: number;
  startDateOfLastPeriod: string;
  durationOfLastPeriod: number;
  upComingMonth: number;
}

export function calculatePeriodDates(input: PeriodInput): PeriodResult[] {
  const {
    avgCycleLength,
    startDateOfLastPeriod,
    durationOfLastPeriod,
    upComingMonth,
  } = input;

  // Input validation
  if (!startDateOfLastPeriod || !isValidDate(startDateOfLastPeriod)) {
    throw new Error('Invalid startDate');
  }

  if (!Number.isInteger(durationOfLastPeriod) || durationOfLastPeriod <= 0) {
    throw new Error('Invalid period duration');
  }

  if (
    !Number.isInteger(avgCycleLength) ||
    avgCycleLength < 22 ||
    avgCycleLength > 44
  ) {
    throw new Error('Invalid cycle length');
  }

  const scaleMatch = scales.find((scale) => scale.days === avgCycleLength);
  if (!scaleMatch) {
    throw new Error(`No ovulation data for cycle length: ${avgCycleLength}`);
  }

  const results: PeriodResult[] = [];
  let currentPeriodStart = new Date(startDateOfLastPeriod);

  for (let i = 0; i < upComingMonth; i++) {
    // Calculate period end date
    const periodEnd = new Date(currentPeriodStart);
    periodEnd.setDate(periodEnd.getDate() + durationOfLastPeriod - 1);

    // Calculate ovulation window
    const ovulationStart = new Date(currentPeriodStart);
    ovulationStart.setDate(ovulationStart.getDate() + scaleMatch.value1);

    const ovulationEnd = new Date(currentPeriodStart);
    ovulationEnd.setDate(
      ovulationEnd.getDate() + scaleMatch.value1 + scaleMatch.value2,
    );

    results.push({
      period: `${formatDate(currentPeriodStart)} - ${formatDate(periodEnd)}`,
      mostProbableOvulationDays: `${formatDate(ovulationStart)} - ${formatDate(ovulationEnd)}`,
    });

    // Move to next cycle
    currentPeriodStart = new Date(currentPeriodStart);
    currentPeriodStart.setDate(currentPeriodStart.getDate() + avgCycleLength);
  }

  return results;
}

function isValidDate(dateStr: string): boolean {
  const date = new Date(dateStr);
  return date instanceof Date && !isNaN(date.getTime());
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  });
}
