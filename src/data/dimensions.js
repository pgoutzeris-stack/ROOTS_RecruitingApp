/**
 * Evaluation dimensions and their display colors.
 *
 * Color logic – each hue maps to the semantic character of the dimension:
 *   ownership    → amber   (energy, drive, initiative)
 *   analytik     → indigo  (intellect, reasoning, structure)
 *   kommunikation→ sky     (openness, expression, presence)
 *   projektmgmt  → emerald (execution, organisation, delivery)
 *   qualitat     → violet  (precision, standards, excellence)
 *   resilienz    → orange  (strength, persistence, adaptability)
 *   marketing    → pink    (creativity, brand, impact)
 *   team         → teal    (collaboration, people, cohesion)
 */

export const DIMENSIONS = {
  ownership:     'Ownership & Drive',
  analytik:      'Analytisches & strukturiertes Denken',
  kommunikation: 'Sicheres Auftreten & Kommunikation',
  projektmgmt:   'Projektmanagement',
  qualitat:      'Qualitätsanspruch',
  resilienz:     'Resilienz',
  marketing:     'Marketingfachwissen',
  team:          'Teamfähigkeit',
};

export const RATING_COLORS = {
  1: '#DC2626',
  2: '#EA580C',
  3: '#D97706',
  4: '#059669',
  5: '#10b981',
};

export const DIMENSION_COLORS = {
  ownership:     '#f59e0b',  // amber
  analytik:      '#6366f1',  // indigo
  kommunikation: '#0ea5e9',  // sky
  projektmgmt:   '#10b981',  // emerald
  qualitat:      '#8b5cf6',  // violet
  resilienz:     '#f97316',  // orange
  marketing:     '#ec4899',  // pink
  team:          '#14b8a6',  // teal
};
