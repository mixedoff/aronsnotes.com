export const note24 = {
  id: 24,
  date: '12.10.2025',
  folder: ['engineering'],
  subFolder: ['devops'],
  subSubFolder: ['version-control'],
  quest: 'aronsnotes',
  title: 'git update',
  subtitle: 'The daily git workflow: check the status, fetch, switch branches, commit and push',
  technologies: ['git'],
  size: null,
  author: null,
  published: null,
  content: `
    <h6>1. what is a git update workflow?</h6>
    <p class="note">A git update workflow is the complete process of syncing your local repository with the remote, making changes, and pushing them back. This is the daily bread and butter of version control.</p>

    <h6>2. checking status</h6>
    <p class="note">Always start by checking what's changed:</p>
    <code>git status # see what's modified</code>

    <p class="note">This shows modified files, untracked files, and your current branch.</p>

    <h6>3. fetching latest changes</h6>
    <p class="note">Fetch updates from remote without merging:</p>
    <code>git fetch origin # download updates</code>

    <p class="note">This downloads new data but doesn't modify your working directory.</p>

    <h6>4. switching branches</h6>
    <p class="note">Switch to a different branch:</p>
    <code>git checkout branch-name</code>

    <p class="note">Create and switch to a new branch:</p>
    <code>git checkout -b new-branch-name # creates & switches</code>

    <p class="note">Modern syntax (Git 2.23+):</p>
    <code>git switch branch-name</code>
    <code>git switch -c new-branch-name # creates & switches</code>

    <h6>5. pulling changes</h6>
    <p class="note">Pull and merge changes from remote branch:</p>
    <code>git pull origin branch-name # fetch + merge</code>

    <p class="note">This is essentially a fetch + merge. It updates your current branch with remote changes.</p>

    <h6>6. staging changes</h6>
    <p class="note">Add specific file to staging:</p>
    <code>git add filename.ext</code>

    <p class="note">Add all changes:</p>
    <code>git add . # stages everything</code>

    <p class="note">Add all files of a certain type:</p>
    <code>git add *.ts # all TypeScript files</code>

    <p class="note">Interactive staging (choose what to add):</p>
    <code>git add -p # pick changes interactively</code>

    <h6>7. committing changes</h6>
    <p class="note">Commit staged changes with a message:</p>
    <code>git commit -m "Your descriptive commit message"</code>

    <p class="note">Commit all modified files (skip staging):</p>
    <code>git commit -am "Your message" # adds & commits</code>

    <blockquote>
      Write clear, descriptive commit messages. Good format: "verb + what changed" like "Add login feature" or "Fix navigation bug".
    </blockquote>

    <h6>8. pushing changes</h6>
    <p class="note">Push to remote branch:</p>
    <code>git push origin branch-name</code>

    <p class="note">Push and set upstream (first time pushing a new branch):</p>
    <code>git push -u origin branch-name # sets upstream</code>

    <p class="note">After setting upstream, you can just use:</p>
    <code>git push # uses saved upstream</code>

    <h6>9. complete workflow example</h6>
    <p class="note">Here's a typical update workflow:</p>
    <code>git status</code>
    <code>git fetch origin</code>
    <code>git checkout develop</code>
    <code>git pull origin develop</code>
    <code>git add .</code>
    <code>git commit -m "Update skill tree styling"</code>
    <code>git push origin develop</code>

    <h6>10. checking remote information</h6>
    <p class="note">View remote repository URLs:</p>
    <code>git remote -v</code>

    <p class="note">View all branches (local and remote):</p>
    <code>git branch -a</code>

    <h6>11. common issues and solutions</h6>
    <p class="note"><strong>Merge conflicts:</strong> When pulling, if there are conflicts:</p>
    <code>git status</code>
    <p class="note">Edit conflicting files, then:</p>
    <code>git add .</code>
    <code>git commit -m "Resolve merge conflicts"</code>

    <p class="note"><strong>Uncommitted changes when switching branches:</strong></p>
    <code>git stash</code>
    <code>git checkout other-branch</code>
    <code>git stash pop</code>

    <p class="note"><strong>Pushed wrong commit:</strong></p>
    <code>git revert commit-hash</code>
    <code>git push origin branch-name</code>

    <blockquote>
      Pro tip: Never use <code>git push --force</code> on shared branches like main or develop unless you absolutely know what you're doing and have team approval. It can overwrite others' work.
    </blockquote>

    <h6>12. viewing commit history</h6>
    <p class="note">View detailed commit log:</p>
    <code>git log</code>

    <p class="note">Compact one-line view:</p>
    <code>git log --oneline</code>

    <p class="note">View commits with file changes:</p>
    <code>git log --stat</code>

    <p class="note">View visual branch graph:</p>
    <code>git log --graph --oneline --all</code>

    <br />
  `,
};

