export const article5 = {
  id: 5,
  date: '29.10.2024',
  folder: 'code',
  title: 'Set up GitHub repo',
  subtitle:
    'Setting up a Git repository to track and push changes from your Command Line Interface',
  tags: ['bash', 'github'],
  content: `
    <h6>1. add a remote repository</h6>
    <p class="article">Link your local project to GitHub with:</p>
    <pre><code>git remote add origin https://github.com/yourusername/yourrepository.git</code></pre>
    <p class="article">This sets up "origin" as the alias for your remote repository.</p>

    <h6>2. rename branch to main</h6>
    <p class="article">Rename the current branch to main (Git's default primary branch):</p>
    <pre><code>git branch -M main</code></pre>

    <h6>3. push to remote</h6>
    <p class="article">Upload your local commits to the remote main branch:</p>
    <pre><code>git push -u origin main</code></pre>

    <h6>4. commit & push your changes</h6>
    <p class="article">After making changes, use these commands to update your GitHub repository:</p>
    <pre><code>git add .  # Stage all changes
git commit -m 'your-message'  # Commit with a message
git push  # Push to GitHub</code></pre>

    <blockquote>
      Note: Regularly push changes with clear commit messages for easier tracking and reverting (if needed)
    </blockquote>

    <br />
  `,
};
