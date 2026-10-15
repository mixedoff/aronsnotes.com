export const article38 = {
  id: 38,
  date: '11.10.2026',
  folder: ['engineering'],
  subFolder: ['automation'],
  subSubFolder: [''],
  project: 'general',
  title: 'job application autopilot',
  subtitle: 'One n8n workflow and one Claude skill that do the typing, so I only do the deciding',
  technologies: ['n8n', 'claude', 'gmail', 'google-sheets', 'google-drive', 'linkedin'],
  size: null,
  author: null,
  published: null,
  content: `
<p class="article">Who likes applying for jobs? It's manual, arduous and time-consuming.</p>

<p class="article">Thankfully, we're living in the 21st century, so this can be automated. Unfortunately for us, not completely: LinkedIn heavily monitors bot activity, so if you hooked up an MCP at the end to automate the whole flow, you'd risk getting banned.</p>

<p class="highlight">Side note: I honestly don't get why LinkedIn doesn't offer automatic job applications within the app itself. It would be so much easier to just pick the types of jobs and criteria you want, and have a LinkedIn agent kick in and do the work on your behalf.</p>

<p class="article">So the solution is one n8n workflow that turns LinkedIn's job-alert emails into a reviewable Google Sheet, and one Claude skill that pre-fills applications and drafts custom CVs and cover letters.</p>

<h2>How it works</h2>
<p class="article">The setup has two parts. Every morning, n8n reads my LinkedIn job alert emails and adds each job as a new row in a Google Sheet. Over coffee, I scroll through the sheet and decide which jobs are worth my time.</p>

<p class="article">When I find one I like, I open the job ad in Chrome and tell Claude: /the-name-of-the-skill. From there, that Claude skill turns on, picks my best CV, tailors it if needed, writes a cover letter, logs the job, and fills in the application form.</p>

<p class="article">I only make two decisions myself: which jobs to apply to, and when to click Submit. <em>The robots do the typing, I do the deciding.</em></p>

<h2>Part 1: n8n catches the jobs</h2>
<p class="article">The first part is a small n8n workflow. It runs every morning at 7:00, before I check my email, and goes like this:</p>
<ol>
  <li>A schedule trigger starts the workflow once a day.</li>
  <li>The Gmail node fetches LinkedIn job alert emails from the last 24 hours (<em>from:jobs-noreply@linkedin.com newer_than:1d</em>).</li>
  <li>An HTML Extract node pulls the job title, company, location and link out of each email.</li>
  <li>A Split Out node turns every job into its own item.</li>
  <li>A Google Sheets lookup checks if the job is already in my sheet. LinkedIn likes to send the same jobs again and again, so this saves me from duplicates.</li>
  <li>New jobs get appended as a row with the status "new".</li>
</ol>

<p class="highlight">One tip: LinkedIn changes its email template from time to time, which breaks the HTML Extract step. Before you build it, open one real alert email, click "Show original", and test your selectors on that HTML.</p>

<h2>The Job Tracker sheet</h2>
<p class="article">Everything lands in one Google Sheet with a tab called Job Tracker. These are the columns:</p>
<ul>
  <li><strong>id</strong> and <strong>link</strong>: the job URL</li>
  <li><strong>date_found</strong>: the day the job showed up</li>
  <li><strong>job_title</strong>, <strong>company</strong> and <strong>location</strong>: copied from the ad</li>
  <li><strong>status</strong>: new, applied, networking, round2 or decline</li>
  <li><strong>applied_date</strong>: the day I actually applied</li>
  <li><strong>notes</strong>: which CV and cover letter I sent, plus anything else I want to remember</li>
</ul>

<p class="article">The sheet is the one place where I can see my whole job search. n8n fills the top of the funnel, and Claude keeps the rest up to date.</p>

<h2>Part 2: Claude applies with me</h2>
<p class="article">The second part is a Claude skill. A skill is basically a written recipe that Claude follows every time I ask for a certain task. Mine is called cv-and-cover-letter, and it does six things:</p>
<ol>
  <li><strong>Reads the job ad.</strong> It pulls out the company, job title, duties, must-haves and nice-to-haves.</li>
  <li><strong>Picks the best CV.</strong> I keep a few one-page CVs in a Google Drive folder, each with a different headline (Growth Marketer, Digital Marketer, Marketing Specialist). Claude compares them with the ad, picks one and tells me why.</li>
  <li><strong>Tailors it if it matters.</strong> If the ad asks for a tool or skill my CV doesn't mention, Claude edits the PDF and keeps the original Canva design. It only adds things I have really done, and asks me first when it isn't sure. Each edited version is saved as a new file, so the old ones stay safe.</li>
  <li><strong>Writes the cover letter.</strong> It creates a Google Doc in the same folder, in English or Hungarian depending on the ad. It keeps it under one page, uses the words from the ad, and skips the clichés (no "passionate", no "dynamic").</li>
  <li><strong>Logs the job.</strong> It adds a row to the Job Tracker, or fills in the row n8n already created, and notes which CV and cover letter it used.</li>
  <li><strong>Fills in the form.</strong> With the application page open in my Chrome tab, Claude fills in my work history, education, languages and contact details. Anything it doesn't know, like salary expectations or start date, it asks me in one go.</li>
</ol>

<p class="article">Then it stops. It never clicks Submit. I read through the form, fix anything that looks off, and send it myself. When I tell Claude "I applied", it changes the status in the sheet to applied and adds the date.</p>

<h2>Why I stay in the loop</h2>
<p class="article">I could probably automate the last click too, but I don't want to. LinkedIn watches for bot activity, and getting my account restricted in the middle of a job search would cost me more than any time I save. So I do Easy Apply jobs by hand, and Claude works on the company's own careers page, in my own browser, while I watch. I also sign in myself. Claude never types my passwords.</p>

<p class="article">There is a second reason. Sometimes a form has a dropdown where none of the options really fit, and Claude has to pick the closest one. It tells me what it guessed, but I still want to see it with my own eyes before it goes out with my name on it.</p>

<h2>Want to build your own?</h2>
<p class="article">Here is what you need:</p>
<ul>
  <li>LinkedIn job alerts switched on for the roles you want</li>
  <li>An n8n account with Gmail and Google Sheets connected</li>
  <li>A Google Sheet with the columns above</li>
  <li>Your CVs (and one good cover letter to use as a model) in a Google Drive folder</li>
  <li>Claude with Google Drive, Google Sheets and Claude in Chrome connected</li>
  <li>A skill file with your standard answers: work history, education, languages, contact details and the rules you want Claude to follow</li>
</ul>

<p class="article">It took me an afternoon to set up, and now applying for a job takes me about ten minutes instead of an hour. I still have to find the right jobs and do well in the interviews. But at least the boring part is gone.</p>

<br>
<br>
  `,
};
