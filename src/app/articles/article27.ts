export const article27 = {
  id: 27,
  date: '13.10.2025',
  folder: ['development'],
  subFolder: ['deployment'],
  subSubFolder: ['server'],
  project: 'aronsnotes',
  title: 'automate Let\'s Encrypt SSL certificate renewal',
  subtitle: 'Keep your HTTPS certificate valid',
  technologies: ['nginx', 'certbot', 'ssl', 'cron'],
  size: null,
  author: null,
  published: null,
  content: `
<h6>check certificate expiration</h6>
<p class="article">View when your certificates expire:</p>
<code>certbot certificates # list all certificates and expiration dates</code>

<h6>automate renewal</h6>
<p class="article">Let's Encrypt certificates expire every 90 days. To set up automatic renewal, edit your crontab:</p>
<code>crontab -e # edit crontab</code>

<p class="article">Add this line to check for renewal twice daily:</p>
<code>0 0,12 * * * certbot renew --quiet --pre-hook "systemctl stop nginx" --post-hook "systemctl start nginx"</code>
<code># 0 0,12 * * * - Runs at 00:00 and 12:00 every day.</code>
<code># certbot renew --quiet - Attempts renewal quietly; only renews if necessary.</code>
<code># --pre-hook "systemctl stop nginx" - Stops Nginx before renewal (only if renewal happens).</code>
<code># --post-hook "systemctl start nginx" - Starts Nginx again after successful renewal.</code>

<h6>verify automation</h6>
<p class="article">View your crontab to ensure the renewal is set up:</p>
<code>crontab -l # list all cron jobs</code>

    <br />
  `,
};


