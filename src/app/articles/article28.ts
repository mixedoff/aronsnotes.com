export const article28 = {
  id: 28,
  date: '13.10.2025',
  folder: ['development'],
  subFolder: ['git'],
  subSubFolder: [''],
  project: 'general',
  title: 'resetting and redownloading a git repository',
  subtitle: 'if you really messed up your local repository, start fresh by cloning a repository again',
  technologies: ['git', 'terminal'],
  size: null,
  author: null,
  published: null,
  content: `
    <h6>get the repository's url</h6>
    <p class="article">Before deleting your local repository, you'll need to save the remote URL. Here's how:</p>
    
    <p class="article">1. Open your terminal</p>
    <p class="article">2. Navigate to your current repository directory (if you're not already there)</p>
    <p class="article">3. Run this command:</p>
    <code>git remote -v # show remote repository URLs</code>

    <p class="article">This will show you the remote repository URL(s). You'll see something like:</p>
    <code>origin  https://github.com/username/repository.git (fetch)</code>
    <code>origin  https://github.com/username/repository.git (push)</code>

    <p class="article">Or for SSH:</p>
    <code>origin  git@ssh.dev.azure.com:v3/codingmind/ailean/ailean (fetch)</code>
    <code>origin  git@ssh.dev.azure.com:v3/codingmind/ailean/ailean (push)</code>

    <blockquote>
      Save this URL - you'll need it to re-clone the repository!
    </blockquote>

    <h6>reset git</h6>
    <p class="article">Follow these steps to completely reset your local repository:</p>

    <p class="article">1. First, make sure you have saved any important changes you want to keep (if any) somewhere else, as this process will remove all local changes.</p>

    <p class="article">2. Delete the current repository folder:</p>
    <code># If you're in the repository directory, move up one level</code>
    <code>cd ..</code>
    <code># Remove the repository directory</code>
    <code>rm -rf repository-name</code>

    <p class="article">3. Clone the repository fresh:</p>
    <code>git clone &lt;repository-url&gt; repository-name</code>

    <p class="article">4. Navigate into the new directory:</p>
    <code>cd repository-name</code>

    <h6>complete workflow</h6>
    <p class="article">Here's the complete process in order:</p>
    <code>git remote -v # save this URL!</code>
    <code>cd ..</code>
    <code>rm -rf repository-name</code>
    <code>git clone &lt;repository-url&gt; repository-name</code>
    <code>cd repository-name</code>

    <blockquote>
      Warning: This will permanently delete all uncommitted changes and local branches that aren't on the remote!
    </blockquote>

    <br />
  `,
};
