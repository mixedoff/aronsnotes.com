export const article7 = {
  id: 7,
  date: '08.11.2024',
  folder: 'code',
  title: 'setting up hetzner cloud on macOS',
  subtitle: 'set up and manage hetzner cloud servers on macOS',
  tags: ['macos', 'cloud', 'hetzner', 'ssh'],
  content: `
    <h6>1. install hcloud CLI</h6>
    <p class="article">Install the Hetzner Cloud CLI tool using Homebrew:</p>
    <code>brew install hcloud</code>

    <h6>2. create API token</h6>
    <p class="article">To interact with the Hetzner Cloud API, follow these steps:</p>
    <ol class="article">
      <li>Go to the Hetzner Cloud Console and log in</li>
      <li>Create a new project or select an existing one</li>
      <li>Navigate to Security → API Tokens</li>
      <li>Create a new token with read & write permissions</li>
    </ol>

    <h6>3. configure hcloud CLI</h6>
    <p class="article">Set up your CLI with the API token:</p>
    <code>hcloud context create aronsnotes</code>
    <p class="article">You will be prompted to enter your API token.</p>

    <h6>4. create SSH key</h6>
    <p class="article">Generate an SSH key pair if you don't have one:</p>
    <code>ssh-keygen -t rsa -b 4096 -C "aron.peter.kovacs@gmail.com"</code>
    
    <p class="article">Add the SSH key to Hetzner Cloud:</p>
    <ol class="article">
      <li>Go to SSH Keys in the Hetzner Cloud Console</li>
      <li>Click Add SSH Key</li>
      <li>Paste the contents of your ~/.ssh/id_rsa.pub file</li>
    </ol>

    <h6>5. create a server</h6>
    <p class="article">Check available server images:</p>
    <code>hcloud image list</code>

    <p class="article">Create a server with your chosen configuration:</p>
    <code>hcloud server create --name aronsnotes --type cx22 --image ubuntu-20.04 --ssh-key my-ssh-key</code>

    <h6>6. access your server</h6>
    <p class="article">Connect to your server via SSH:</p>
    <code>ssh root@49.13.14.212</code>

    <blockquote>
      Note: Always keep your API token secure and never share it publicly. Replace the example values (server IP, SSH key name, etc.) with your actual values.
    </blockquote>

    <br />
  `,
};
