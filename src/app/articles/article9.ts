export const article9 = {
  id: 9,
  date: '08.11.2024',
  folder: ['development'],
  subFolder: ['deployment'],
  subSubFolder: ['server'],
  project: 'aronsnotes',
  title: 'updating angular app on nginx server',
  subtitle: 'Quick guide to deploy updates to your Angular application',
  technologies: ['angular', 'nginx'],
  size: null,
  author: null,
  published: null,
  content: `
    <h6>1. build your app</h6>
    <p class="article">Navigate to your Angular project directory:</p>
    <code>cd /path/to/your/angular/project</code>

    <p class="article">Build the project with production configuration:</p>
    <code>ng build --configuration production</code>

    <h6>2. upload to server</h6>
    <p class="article">Navigate to the build output directory:</p>
    <code>cd dist/your-project-name/browser</code>

    <p class="article">Upload files to your nginx server:</p>
    <code>scp -r * root@your-server-ip:/usr/share/nginx/html</code>

    <h6>3. restart nginx</h6>
    <p class="article">SSH into your server:</p>
    <code>ssh root@your-server-ip</code>

    <p class="article">Restart the Nginx service:</p>
    <code>systemctl restart nginx</code>

    <blockquote>
      Note: Replace 'your-project-name' and 'your-server-ip' with your actual project name and server IP address. Make sure you have SSH access to your server before attempting the update.
    </blockquote>

    <br />
  `,
};
