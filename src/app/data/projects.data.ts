export interface Project {
  id: string;
  name: string;
  description: string;
  link?: string;
  buttonText?: string;
  category: ('design' | 'development' | 'writing')[];
  designRoles?: ('ux/ui designer' | 'ux researcher' | 'brand designer' | 'graphic designer' | 'animator' | 'copywriter' | 'content creator')[];
  developmentRoles?: ('frontend developer' | 'backend developer' | 'full stack developer' | 'co-founder' | 'product manager' | 'market researcher')[];
  writingRoles?: ('writer' | 'copywriter' | 'ux writer' | 'technical writer' | 'non-fiction writer')[];
  otherRoles?: ('co-founder' | 'founder'| 'product manager' | 'market researcher')[];
  startDate?: string;
  endDate?: string;
  status?: 'live' | 'in progress' | 'archived';
  vision?: string;
  mission?: string;
  techStack?: string[];
  collaborators?: string[];
  milestones?: string[];
  isFeatured?: boolean;
  featuredOrder?: number;
  animationGif?: string; // Path to GIF file in assets/gif/ directory (e.g., 'magic_book2.gif')
}

export const PROJECTS: Project[] = [
  {
    id: 'careeverz',
    name: 'CareeVerz.com',
    status: 'live',
    vision: 'Gamifying work.',
    mission: 'To be a compass for career starters in the world of work.',
    techStack: ['Figma', 'Angular', '.NET', 'Azure', 'Docker', 'Harness ML', 'Hetzner', 'Google OAuth', 'Stripe', 'Brevo'],
    collaborators: ['Mark Tumpek', 'Lang Levente', 'Daniel Mery'],
    milestones: ['Recruited and led a multidisciplinary team of 4','Launched a complex AI-driven career matching app', 'Got to 100 users'],
    isFeatured: true,
    featuredOrder: 1,
    description: 'A career matching AI web application that helps career starters make informed career choices through personality assessment and with a massive database of career paths.',
    link: 'https://careeverz.com',
    buttonText: 'visit CareeVerz',
    designRoles: ['ux/ui designer', 'ux researcher'],
    writingRoles: ['ux writer'],
    otherRoles: ['co-founder', 'product manager', 'market researcher'],
    category: ['design'],
    startDate: '2023-01-01',
    endDate: '2024-12-31',
    animationGif: 'sun.gif'
  },
  {
    id: 'aronsnotes',
    name: 'aronsnotes.com',
    status: 'live',
    description: 'A personal knowledge management system and portfolio website showcasing my stuff as if it would be a retro game.',
    link: 'https://aronsnotes.com',
    buttonText: 'you are here',
    developmentRoles: ['full stack developer'],
    designRoles: ['ux/ui designer', 'animator'],
    writingRoles: ['ux writer', 'technical writer', 'copywriter'],
    otherRoles: ['founder'],
    category: ['development', 'design', 'writing'],
    vision: 'Gamifying my character development.',
    mission: 'To help me keep track of my character development and progress.',
    techStack: ['Figma', 'Angular', 'Hetzner Cloud', 'Nginx'],
    milestones: ['Launched a personal knowledge management system and portfolio website showcasing my stuff as if it would be a retro game.', 'Led research & development', 'Recruited and led a multidisciplinary team of 4', 'Designed and executed the UX/UI process', 'Helped to develop the front-end'],
    isFeatured: true,
    featuredOrder: 2,
    startDate: '2024-10-01',
    animationGif: 'frogging.gif'
  },
  {
    id: 'self-ware',
    name: 'self-ware',
    status: 'in progress',
    vision: '',
    mission: 'To rebuild broken identities and world models for carbon based algorithms.',
    techStack: ['good old fashioned pen and paper', 'Angular', 'Hetzner Cloud', 'Nginx'],
    collaborators: [''],
    milestones: ['Acquired an editor', 'Almost done with the first draft'],
    isFeatured: true,
    featuredOrder: 3,
    description: "A carbon based algorithm's manual for (re)building world model and identity.",
    link: 'mailto:aron.peter.kovacs@gmail.com',
    buttonText: 'email to pre-order!',
    writingRoles: ['non-fiction writer', 'technical writer'],
    developmentRoles: ['full stack developer'],
    designRoles: ['graphic designer'],
    otherRoles: ['founder'],
    category: ['writing', 'development', 'design'],
    startDate: '2024-06-01',
    animationGif: 'magic_book2.gif'
  }
];
