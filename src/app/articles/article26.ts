export const article26 = {
  id: 26,
  date: '12.10.2025',
  folder: ['development'],
  subFolder: ['deployment'],
  subSubFolder: ['server'],
  project: 'aronsnotes',
  title: 'renew Let\'s Encrypt SSL certificate',
  subtitle: 'Keep your HTTPS certificate valid',
  technologies: ['nginx', 'certbot', 'ssl'],
  size: null,
  author: null,
  published: null,
  content: `
    <h6>1. what is Let's Encrypt?</h6>
    <p class="article">Let's Encrypt is a free, automated certificate authority that provides SSL/TLS certificates. These certificates expire every 90 days and need to be renewed to keep your site secure.</p>

    <h6>2. login to your server</h6>
    <p class="article">First, SSH into your dedicated web server:</p>
    <code>ssh root@your.server.ip.address</code>

    <blockquote>
      Replace "your.server.ip.address" with your actual server IP address. You'll need root access or sudo privileges.
    </blockquote>

    <h6>3. verify certbot is installed</h6>
    <p class="article">Make sure certbot is installed on your system:</p>
    <code>certbot --version # check if certbot is installed</code>

    <p class="article">If not installed, you can install it:</p>
    <code>apt-get install certbot # for Ubuntu/Debian</code>
    <code>yum install certbot # for CentOS/RHEL</code>

    <h6>4. stop nginx</h6>
    <p class="article">Temporarily stop nginx to free up port 80/443 for certificate renewal:</p>
    <code>systemctl stop nginx # stops the nginx service</code>

    <p class="article">This is necessary because certbot needs to bind to port 80 to verify domain ownership.</p>

    <h6>5. renew the certificate</h6>
    <p class="article">Run the renewal command:</p>
    <code>certbot renew # renews all certificates</code>

    <p class="article">For a dry run (test without actually renewing):</p>
    <code>certbot renew --dry-run # test renewal process</code>

    <h6>6. start nginx again</h6>
    <p class="article">Once renewal is complete, restart nginx:</p>
    <code>systemctl start nginx # starts nginx back up</code>

    <p class="article">Verify nginx is running:</p>
    <code>systemctl status nginx # check nginx status</code>

    <h6>7. complete workflow</h6>
    <p class="article">Here's the complete process in order:</p>
    <code>ssh root@your.server.ip.address</code>
    <code>systemctl stop nginx</code>
    <code>certbot renew</code>
    <code>systemctl start nginx</code>

    <br />
  `,
};

