/**
 * Title and meta description for each page, set by SeoService on every navigation
 * (notes take theirs from the note itself). Also read by scripts/generate.ts for the sitemap.
 */

export const SITE_URL = 'https://aronsnotes.com';
export const SITE_NAME = 'aronsnotes';

export interface Page {
  path: string;
  title: string;
  description: string;
  /** Listed in sitemap.xml; leave out the in-between screens and easter eggs */
  inSitemap: boolean;
}

const HOME: Omit<Page, 'path'> = {
  title: 'aronsnotes · Aron Kovacs, founder marketer',
  description:
    'The retro game portfolio and notes of Aron Kovacs, a founder marketer of the tank class: quests, a skill tree and notes on product design, growth, engineering and writing.',
  inSitemap: true,
};

export const PAGES: Page[] = [
  { path: '/', ...HOME },
  { path: '/loading', ...HOME, inSitemap: false },
  {
    path: '/welcome',
    title: 'Start the game · aronsnotes',
    description: 'Press to start the game and meet Aron Kovacs, a founder marketer of the tank class.',
    inSitemap: false,
  },
  {
    path: '/character',
    title: 'Aron Kovacs, founder marketer · aronsnotes',
    description:
      'Meet Aron Kovacs, a founder marketer of the tank class: product designer, growth marketer, creative dev and writer. See his skills, his quests and how to connect.',
    inSitemap: true,
  },
  {
    path: '/quests',
    title: 'Quests: CareeVerz, aronsnotes, DEEP-SHIT · aronsnotes',
    description:
      'The quests of Aron Kovacs: CareeVerz, an AI web app that matches people with the right career; aronsnotes.com, this retro portfolio; and DEEP-SHIT, a dark self-help memoir.',
    inSitemap: true,
  },
  {
    path: '/skills',
    title: 'Skill tree · aronsnotes',
    description:
      'The skill tree of Aron Kovacs: every note filed under the skill it levelled up, from founder marketer to product designer, growth marketer, engineer and content marketer.',
    inSitemap: true,
  },
  {
    path: '/notes',
    title: 'Notes on product, growth and code · aronsnotes',
    description:
      'All notes by Aron Kovacs on UX research, UI and brand design, growth marketing, Angular, devops and writing, newest first.',
    inSitemap: true,
  },
  {
    path: '/creative',
    title: 'Creative writing · aronsnotes',
    description: 'Essays and creative writing by Aron Kovacs.',
    inSitemap: false,
  },
  {
    path: '/main-menu',
    title: 'Main menu · aronsnotes',
    description: HOME.description,
    inSitemap: false,
  },
  {
    path: '/quit',
    title: 'Quit? · aronsnotes',
    description: HOME.description,
    inSitemap: false,
  },
  {
    path: '/hidden',
    title: 'You found a secret · aronsnotes',
    description: HOME.description,
    inSitemap: false,
  },
  {
    path: '/404',
    title: 'Page not found · aronsnotes',
    description: 'This page does not exist (anymore). The notes, quests and skill tree are still here.',
    inSitemap: false,
  },
];

export const DEFAULT_PAGE: Page = { path: '/', ...HOME };
