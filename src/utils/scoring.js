import { DIMENSIONS } from '../data/dimensions';
import { SECTIONS } from '../data/sections';

/**
 * Merges erst- and zweit-ratings. Zweit-ratings override erst-ratings per question/eval.
 * @param {Object} erstRatings - Ratings from first interview
 * @param {Object} zweitRatings - Ratings from second interview
 * @returns {Object} Merged ratings keyed by question ID
 */
export const mergeRatings = (erstRatings, zweitRatings) => {
  const merged = {};
  for (const [questionId, evals] of Object.entries(erstRatings)) {
    merged[questionId] = { ...evals };
  }
  for (const [questionId, evals] of Object.entries(zweitRatings)) {
    if (!merged[questionId]) merged[questionId] = {};
    for (const [evalIdx, value] of Object.entries(evals)) {
      merged[questionId][evalIdx] = value;
    }
  }
  return merged;
};

/**
 * Calculates per-dimension average scores and an overall average.
 * @param {Object} effectiveRatings - Merged ratings keyed by question ID
 * @returns {{ perDimension: Object, averages: Object, overall: number|null }}
 */
export const calculateDimensionScores = (effectiveRatings) => {
  const perDimension = {};
  for (const key of Object.keys(DIMENSIONS)) {
    perDimension[key] = { sum: 0, count: 0 };
  }

  for (const section of SECTIONS) {
    if (!section.questions) continue;
    for (const question of section.questions) {
      const questionRatings = effectiveRatings[question.id] || {};
      if (!question.evaluations) continue;
      question.evaluations.forEach((evaluation, evalIdx) => {
        const rating = questionRatings[evalIdx];
        if (rating != null) {
          perDimension[evaluation.dimension].sum += rating;
          perDimension[evaluation.dimension].count += 1;
        }
      });
    }
  }

  const averages = {};
  let totalSum = 0;
  let totalCount = 0;
  for (const key of Object.keys(DIMENSIONS)) {
    if (perDimension[key].count > 0) {
      averages[key] = perDimension[key].sum / perDimension[key].count;
      totalSum += averages[key];
      totalCount += 1;
    }
  }

  return {
    perDimension,
    averages,
    overall: totalCount > 0 ? totalSum / totalCount : null,
  };
};

/** Default weights per dimension (all equal = 1) */
export const DEFAULT_WEIGHTS = {
  ownership: 1,
  analytik: 1,
  kommunikation: 1,
  projektmgmt: 1,
  qualitat: 1,
  resilienz: 1,
  marketing: 1,
  team: 1,
};

/**
 * Calculates a weighted overall score.
 * @param {Object} averages - Per-dimension averages
 * @param {Object} weights - Per-dimension weights (e.g. { analytik: 2, marketing: 1 })
 * @returns {number|null}
 */
export const calculateWeightedOverall = (averages, weights = DEFAULT_WEIGHTS) => {
  let weightedSum = 0;
  let totalWeight = 0;
  for (const [dim, avg] of Object.entries(averages)) {
    const w = weights[dim] ?? 1;
    weightedSum += avg * w;
    totalWeight += w;
  }
  return totalWeight > 0 ? weightedSum / totalWeight : null;
};
