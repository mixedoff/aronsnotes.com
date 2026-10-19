export interface Quest {
  id: string;
  name: string;
  /** One line about the quest, shown at the bottom of the card's back */
  subtitle: string;
  description: string;
  link?: string;
  buttonText?: string;
  /** In-site page the button opens instead of the external link, e.g. '/character#connect' */
  buttonRoute?: string;
  /** My role in the quest, shown as a white chip on the quests page */
  questMasterRole?: string;
  startDate?: string;
  endDate?: string;
  status?: 'live' | 'in progress' | 'archived';
  vision?: string;
  milestones?: string[];
  isFeatured?: boolean;
  featuredOrder?: number;
  animationGif?: string; // Path to GIF file in assets/gif/ directory (e.g., 'magic_book2.gif')
}

export const QUESTS: Quest[] = [
  {
    id: 'careeverz',
    name: 'CareeVerz',
    subtitle: 'A career matching AI web app.',
    questMasterRole: 'co-founder',
    status: 'live',
    vision: 'Gamifying work.',
    milestones: ['Recruited and led a multidisciplinary team of 4','Launched a complex AI-driven career matching app', 'Got to 1000 users'],
    isFeatured: true,
    featuredOrder: 1,
    description: 'CareeVerz is an AI web app that matches career starters and career changers with the right career, based on a personality assessment and a large database of career paths.',
    link: 'https://careeverz.com',
    buttonText: 'visit CareeVerz',
    startDate: '2023-01-01',
    endDate: '',
    animationGif: 'sun.gif'
  },
  {
    id: 'aronsnotes',
    name: 'aronsnotes',
    subtitle: 'A retro portfolio/blog',
    questMasterRole: 'founder',
    status: 'live',
    description: 'aronsnotes is a portfolio/blog website of Aron Kovacs showcasing his work as if he would be a character in a retro game',
    link: 'https://aronsnotes.com',
    buttonText: "let's connect",
    buttonRoute: '/character#connect',
    vision: 'Gamifying my character development.',
    milestones: ['Launched a personal knowledge management system and portfolio website showcasing my stuff as if it would be a retro game.', 'Led research & development', 'Recruited and led a multidisciplinary team of 4', 'Designed and executed the UX/UI process', 'Helped to develop the front-end'],
    isFeatured: true,
    featuredOrder: 2,
    startDate: '2024-10-01',
    animationGif: 'frogging.gif'
  },
  {
    id: 'self-ware',
    name: 'DEEP-SHIT',
    subtitle: 'A dark self-help memoir.',
    status: 'in progress',
    vision: '',
    milestones: ['Acquired an editor', 'Almost done with the first draft'],
    isFeatured: true,
    featuredOrder: 3,
    description: "DEEP-SHIT is a darkly funny, brutally honest self-help memoir that treats people as running on inherited “code,” and shows how to find the broken parts and integrate them instead of letting them slowly destroy you.",
    link: 'mailto:aron.peter.kovacs@gmail.com',
    buttonText: 'email to pre-order!',
    startDate: '2024-06-01',
    animationGif: 'magic_book2.gif'
  }
];
