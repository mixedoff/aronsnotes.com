export interface Project {
  id: string;
  name: string;
  description: string;
  link?: string;
  buttonText?: string;
  status: 'active' | 'completed' | 'archived';
  roles: ('founder' | 'developer' | 'designer' | 'writer' | 'manager' | 'solopreneur' | 'researcher')[];
  category: 'design' | 'development' | 'writing';
  startDate?: string;
  endDate?: string;
}

export const PROJECTS: Project[] = [
  {
    id: 'careeverz',
    name: 'CareeVerz',
    description: 'A career matching AI web application that helps career starters make informed career choices through personality assessment and with a massive database of career paths.',
    link: 'https://careeverz.com',
    buttonText: 'visit CareeVerz',
    status: 'active',
    roles: ['founder', 'designer', 'manager'],
    category: 'design',
    startDate: '2023-01-01',
    endDate: '2024-12-31'
  },
  {
    id: 'aronsnotes',
    name: 'aronsnotes',
    description: 'A personal knowledge management system and portfolio website showcasing my stuff as if it would be a retro game.',
    link: 'https://aronsnotes.com',
    buttonText: 'you are here',
    status: 'active',
    roles: ['solopreneur', 'developer', 'designer'],
    category: 'development',
    startDate: '2024-10-01'
  },
  {
    id: 'self-ware',
    name: 'self-ware',
    description: "A book about a carbon based algorithm's manual for building world models.",
    link: 'mailto:aron.peter.kovacs@gmail.com',
    buttonText: 'email to pre-order!',
    status: 'active',
    roles: ['writer', 'researcher'],
    category: 'writing',
    startDate: '2023-01-01'
  }
];
