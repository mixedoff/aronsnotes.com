/**
 * How note folders appear as skills: on the skills page tree and as chips on the quests page.
 */

// marketing is the root of the tree; the main folders branch out of it
export const ROOT_FOLDER = 'marketing';
export const MAIN_FOLDERS = ['growth', 'engineering', 'product', 'content'];
export const FOLDER_COLORS: { [folder: string]: string } = {
  'marketing': '#8AB8FF',
  'growth': '#ffe415',
  'engineering': '#6ffa1e',
  'product': '#3A94DE',
  'content': '#4ECDC4'
};

// What folders are called on the skills page
export const FOLDER_LABELS: { [folder: string]: string } = {
  'marketing': 'founder marketer',
  'growth': 'growth marketer',
  'engineering': 'engineer',
  'product': 'product designer',
  'content': 'content marketer',
  'automation': 'automations',
  'analytics': 'data analyst',
  'front-end': 'creative dev',
  'ux-design': 'ux designer',
  'ux-research': 'ux researcher',
  'ui-design': 'ui designer',
  'copywriting': 'copywriter',
  'creative-writing': 'creative writer',
  'essays': 'non-fiction writer'
};

// Folders left off the skills page for now; their notes stay in the notes list.
// Saved for an easter egg later.
export const HIDDEN_FOLDERS = new Set(['reading', 'presentation']);

// Chip style for each main folder (chip classes live in styles.css)
export const FOLDER_CHIP_CLASSES: { [folder: string]: string } = {
  'marketing': 'light-blue-chip',
  'growth': 'yellow-chip',
  'engineering': 'green-chip',
  'product': 'blue-chip',
  'content': 'cyan-chip'
};

/** A folder's skill name, e.g. 'front-end' -> 'creative dev' */
export function skillLabel(folder: string): string {
  return FOLDER_LABELS[folder] ?? folder.replace(/-/g, ' ');
}
