export const note10 = {
  id: 10,
  date: '13.11.2024',
  folder: ['engineering'],
  subFolder: ['devops'],
  subSubFolder: ['version-control'],
  paths: [['engineering', 'devops', 'version-control', 'recovery']],
  quest: 'aronsnotes',
  title: 'git reset',
  subtitle: 'Different types of git reset and when to use them',
  technologies: ['git'],
  size: null,
  author: null,
  published: null,
  content: `
    <h6>1. what is git reset?</h6>
    <p class="note">Git reset is a command that moves the HEAD and branch refs to a specified commit. It's commonly used to undo changes or move between different commit states.</p>

    <h6>2. types of reset</h6>
    <p class="note">There are three main types of git reset:</p>
    
    <p class="note"><strong>Soft Reset:</strong> Moves HEAD to specified commit but keeps changes staged:</p>
    <code>git reset --soft HEAD~1</code>

    <p class="note"><strong>Mixed Reset (Default):</strong> Moves HEAD and unstages changes:</p>
    <code>git reset HEAD~1</code>
    <code>git reset --mixed HEAD~1</code>

    <p class="note"><strong>Hard Reset:</strong> Moves HEAD and discards all changes (be careful!):</p>
    <code>git reset --hard HEAD~1</code>

    <h6>3. common use cases</h6>
    <p class="note">Reset to specific commit using hash:</p>
    <code>git reset --hard abc123</code>

    <p class="note">Undo last commit but keep changes:</p>
    <code>git reset --soft HEAD~1</code>

    <p class="note">Reset to remote branch state:</p>
    <code>git reset --hard origin/main</code>

    <h6>4. finding commit hashes</h6>
    <p class="note">View commit history with hashes:</p>
    <code>git log</code>

    <p class="note">Compact view of commits:</p>
    <code>git log --oneline</code>

    <p class="note">Search commits by message:</p>
    <code>git log --grep="search term"</code>

    <blockquote>
      Note: Be very careful with --hard reset as it permanently discards changes. Make sure to commit or stash any important changes before using it. You can usually use just the first 6-8 characters of a commit hash.
    </blockquote>

    <br />
  `,
};
