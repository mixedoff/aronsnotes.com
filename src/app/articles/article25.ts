export const article25 = {
  id: 25,
  date: '12.10.2025',
  folder: ['development'],
  subFolder: ['git'],
  subSubFolder: [''],
  project: 'aronsnotes',
  title: 'git identity setup',
  subtitle: 'Set your name and email for git commits',
  technologies: ['git'],
  size: null,
  author: null,
  published: null,
  content: `

    <code>git config --global user.name "Your Name" # set your name globally</code>
    <code>git config user.name "Your Name" # or locally</code>
    <code>git config --global user.email "your.email@example.com"</code>
    <code>git config user.email "your.email@example.com"</code>
    <code>git config user.name # verify your name</code>
    <code>git config user.email # verify your email</code>
    <code>git config --list # view all your git configuration</code>

    <blockquote>
      Use global settings for your personal identity. Use local settings if you need different credentials for a specific project (like work vs personal).
    </blockquote>
  `,
};

