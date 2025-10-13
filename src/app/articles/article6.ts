export const article6 = {
  id: 6,
  date: '05.11.2024',
  folder: ['development'],
  subFolder: ['deployment'],
  subSubFolder: ['domain'],
  project: 'aronsnotes',
  title: 'connect godaddy domain with hetzner cloud',
  subtitle: 'Connect your purchased GoDaddy domain with a Hetzner server',
  technologies: ['godaddy', 'hetzner'],
  size: null,
  author: null,
  published: null,
  content: `
<h6>1. Obtain Your Hetzner Server IP Address</h6>
<p class="article">First, you need the IP address of your Hetzner server. You can find this in the Hetzner Cloud Console under the details of your server.</p>

<h6>2. Log in to Your GoDaddy Account</h6>
<p class="article">Navigate to the <strong>Domains</strong> section and select the domain you want to connect to your Hetzner server.</p>

<h6>3. Access DNS Management</h6>
<p class="article">Click on <strong>Manage DNS</strong> for the selected domain.</p>

<h6>4. Update A Record</h6>
<p class="article">1. Find the <strong>Type A</strong> section. If an A Record already exists, you can edit it; otherwise, you can add a new one.</p>
<p class="article">Set the <strong>Name</strong> field to '@' (this represents the root domain).</p>
<p class="article">Set the <strong>Value</strong> field to the IP address of your Hetzner server.</p>
<p class="article">Set the <strong>TTL</strong> (Time to Live) to your preferred value, or leave it at the default setting.</p>
<p class="article">Save the changes.</p>

<h6>5. Wait for DNS Propagation</h6>
<p class="article">DNS changes can take some time to propagate across the internet. This process can take anywhere from a few minutes to 48 hours.</p>

<h6>6. Verify the Connection</h6>
<p class="article">After waiting for DNS propagation, you can verify that your domain is pointing to your Hetzner server by entering your domain in a web browser. You should see the content hosted on your Hetzner server.
</p>

<br>
<br>
  `,
};
