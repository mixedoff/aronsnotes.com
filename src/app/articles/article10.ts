export const article10 = {
  id: 10,
  date: '13.11.2024',
  folder: 'code',
  title: 'git reset',
  subtitle: 'Different types of git reset and when to use them',
  tags: ['git'],
  content: `
    <h6>1. what is git reset?</h6>
    <p class="article">Git reset is a command that moves the HEAD and branch refs to a specified commit. It's commonly used to undo changes or move between different commit states.</p>

    <h6>2. types of reset</h6>
    <p class="article">There are three main types of git reset:</p>
    
    <p class="article"><strong>Soft Reset:</strong> Moves HEAD to specified commit but keeps changes staged:</p>
    <code>git reset --soft HEAD~1</code>

    <p class="article"><strong>Mixed Reset (Default):</strong> Moves HEAD and unstages changes:</p>
    <code>git reset HEAD~1</code>
    <code>git reset --mixed HEAD~1</code>

    <p class="article"><strong>Hard Reset:</strong> Moves HEAD and discards all changes (be careful!):</p>
    <code>git reset --hard HEAD~1</code>

    <h6>3. common use cases</h6>
    <p class="article">Reset to specific commit using hash:</p>
    <code>git reset --hard abc123</code>

    <p class="article">Undo last commit but keep changes:</p>
    <code>git reset --soft HEAD~1</code>

    <p class="article">Reset to remote branch state:</p>
    <code>git reset --hard origin/main</code>

    <h6>4. finding commit hashes</h6>
    <p class="article">View commit history with hashes:</p>
    <code>git log</code>

    <p class="article">Compact view of commits:</p>
    <code>git log --oneline</code>

    <p class="article">Search commits by message:</p>
    <code>git log --grep="search term"</code>

    <blockquote>
      Note: Be very careful with --hard reset as it permanently discards changes. Make sure to commit or stash any important changes before using it. You can usually use just the first 6-8 characters of a commit hash.
    </blockquote>

    <br />
  `,
};
