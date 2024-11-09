export const article8 = {
  id: 8,
  date: '08.11.2024',
  folder: 'code',
  title: 'deploying angular app with nginx on rocky linux',
  subtitle: 'step by step guide to deploy an Angular application',
  tags: ['angular', 'nginx', 'RockyLinux'],
  content: `
    <h6>1. install nginx</h6>
    <p class="article">Update your system and install Nginx on Rocky Linux:</p>
    <code>sudo dnf update</code>
    <code>sudo dnf install nginx</code>

    <p class="article">Start and enable Nginx service:</p>
    <code>sudo systemctl start nginx</code>
    <code>sudo systemctl enable nginx</code>
    <code>sudo systemctl status nginx</code>

    <p class="article">Configure firewall for HTTP traffic:</p>
    <code>sudo firewall-cmd --permanent --add-service=http</code>
    <code>sudo firewall-cmd --reload</code>

    <h6>2. build angular app</h6>
    <p class="article">On your local development machine, build your Angular app:</p>
    <code>ng build --configuration production</code>

    <h6>3. transfer files</h6>
    <p class="article">Navigate to your build directory and upload files to server:</p>
    <code>cd /path/to/your/project/dist/project-name/browser</code>
    <code>scp -r * root@your-server-ip:/usr/share/nginx/html</code>

    <h6>4. configure nginx</h6>
    <p class="article">Install text editor if needed:</p>
    <code>sudo dnf install nano</code>

    <p class="article">Create and edit Nginx configuration:</p>
    <code>sudo nano /etc/nginx/conf.d/your-site.conf</code>

    <p class="article">Add the following configuration:</p>
    <code>server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    root /usr/share/nginx/html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    }</code>

    <h6>5. set permissions</h6>
    <p class="article">Configure proper permissions and SELinux:</p>
    <code>sudo chown -R nginx:nginx /usr/share/nginx/html</code>
    <code>sudo chmod -R 755 /usr/share/nginx/html</code>
    <code>sudo setsebool -P httpd_can_network_connect 1</code>

    <h6>6. setup ssl (optional)</h6>
    <p class="article">Install and configure Certbot for SSL:</p>
    <code>sudo dnf install epel-release</code>
    <code>sudo dnf update</code>
    <code>sudo dnf install certbot python3-certbot-nginx</code>
    <code>sudo certbot --nginx -d your-domain.com</code>

    <h6>7. verify deployment</h6>
    <p class="article">Test Nginx configuration and restart:</p>
    <code>sudo nginx -t</code>
    <code>sudo systemctl restart nginx</code>

    <p class="article">Monitor Nginx logs if needed:</p>
    <code>tail -f /var/log/nginx/error.log</code>

    <blockquote>
      Note: Replace placeholder values (your-domain.com, your-server-ip) with your actual values. Always ensure your server's security by properly configuring firewalls and keeping software updated.
    </blockquote>

    <br />
  `,
};
