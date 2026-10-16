export const article41 = {
  id: 41,
  date: '16.10.2026',
  folder: ['growth'],
  subFolder: ['seo'],
  subSubFolder: ['keyword-research'],
  project: 'CareeVerz',
  title: 'nobody googles anymore. right?',
  subtitle: 'Why I ended up doing good old-fashioned SEO for CareeVerz, and what I found once I started digging',
  technologies: ['google-search-console', 'google-ads', 'google-keyword-planner', 'angular'],
  size: null,
  author: null,
  published: null,
  content: `
<p class="article">I was sure nobody Googles anymore and that LLMs had already eaten search. Then I looked at the numbers… So, against my own predictions, I'm now doing good old-fashioned SEO for <a href="https://careeverz.com" target="_blank" rel="noopener">CareeVerz.com</a>, our AI career guidance platform. Here's why, and what I found once I started digging.</p>

<h2>To SEO or not to SEO</h2>
<blockquote>"The future is here, it's just not evenly distributed." – William Gibson</blockquote>

<p class="article">The product goal is 5% organic growth (our metric for a good product), which so far we've tried to reach through videos alone (plus word of mouth). It isn't working yet. We did manage to get clicks from videos (a big feat in itself, but more on that another time), but on its own that's still too little. If only people would search for us by themselves…</p>

<p class="article">It's a little painful to admit, but I was fully convinced that LLMs already dominate the vast majority of searches. <em>Who does SEO nowadays?</em> Well… after a bit of research, I had to realize that LLMs currently handle only a minuscule part of web search.</p>

<p class="article">Monthly sessions on AI platforms add up to 56% of global "search" volume, and 34% in the US [<a href="https://www.stackmatix.com/blog/ai-powered-search-engine-statistics" target="_blank" rel="noopener">1</a>]. But these aren't really searches, they're sessions: people have AI write emails, translate, code and brainstorm. On Google, on the other hand, people almost always type because they're looking for something. If we count only real searches on ChatGPT, we get about 12% of Google's volume, not 56%. So it's no surprise that only about 0.4% of website traffic comes from all AI assistants combined (0.34% of it from ChatGPT), while Google brings in about 24%, roughly 55 times more [<a href="https://ahrefs.com/benchmarks/ai-vs-search" target="_blank" rel="noopener">2</a>]. For comparison, Google handles about 13.7 billion searches a day, ChatGPT about 2.5 billion prompts [<a href="https://ahrefs.com/blog/chatgpt-has-12-percent-of-googles-search-volume/" target="_blank" rel="noopener">3</a>].</p>

<p class="article">I'm certain that search will shift heavily toward LLMs in the medium and long term, but even then, Google's index may well remain the foundation. So I put on my big boy pants and got down to SEO.</p>

<p class="article">Many AI search tools (ChatGPT, Perplexity, Google AI Overviews) work from Google and Bing results, so sites that rank well have a better chance of being included.</p>

<p class="article">According to Ahrefs' benchmark of 115,000 websites, this is how website traffic was split in September 2026 [<a href="https://ahrefs.com/benchmarks/ai-vs-search" target="_blank" rel="noopener">2</a>]:</p>

<table class="article">
  <thead><tr><th>Source</th><th>Share of traffic</th></tr></thead>
  <tbody>
    <tr><td>Direct (typed URL, bookmark)</td><td>39.3%</td></tr>
    <tr><td>Organic search total</td><td>26.8%</td></tr>
    <tr><td>↳ Google</td><td>24.0%</td></tr>
    <tr><td>↳ Bing</td><td>1.1%</td></tr>
    <tr><td>↳ Yahoo, Yandex, DuckDuckGo, etc.</td><td>~1.7%</td></tr>
    <tr><td>Paid ads</td><td>15.5%</td></tr>
    <tr><td>Unknown</td><td>13.7%</td></tr>
    <tr><td>Social media</td><td>7.4%</td></tr>
    <tr><td>AI assistants total</td><td>0.43%</td></tr>
    <tr><td>↳ ChatGPT</td><td>0.34%</td></tr>
    <tr><td>↳ Meta AI</td><td>0.05%</td></tr>
    <tr><td>↳ Gemini</td><td>0.02%</td></tr>
    <tr><td>↳ Claude, Perplexity</td><td>0.01% each</td></tr>
  </tbody>
</table>

<h2>What to SEO</h2>
<p class="article">To begin with, our best chance is with searches like "career aptitude test", "choosing a career" and "career counseling" (in Hungarian: „pályaorientációs teszt", „pályaválasztás", „karriertanácsadás"), which seem to be the most common searches in our cluster. We already have pages for these; they just need a little fixing. So we're improving the existing pages first (the test page, the homepage and In-Demand Occupations 2026), and only then launching the blog.</p>

<p class="article">I've also launched a Google Ads campaign, not just to get familiar with the platform, but also to get monthly search volumes for each term from Google Keyword Planner.</p>

<img class="whiteBoard" src="./assets/img/article41/01-google-ads-campaign.png" alt="Setting up the first CareeVerz Google Ads campaign, with a preview of the career aptitude test ad on Google mobile search">

<h2>Show me the keywords</h2>
<ul>
  <li>The Hungarian market is small: most terms get 10–1,000 searches a month. That makes smaller, longer phrases (long-tail) worth it too.</li>
  <li>We marked 13 keywords as high priority. Most of them point to the test page and the homepage.</li>
  <li>The topics with the highest search volume ("CV template" at 10k–100k and "cover letter template" at 1k–10k searches a month) are competitive and less related to us, so they come later.</li>
  <li>Versions without Hungarian accents ("palyaorientacios teszt") get just as many searches, so we take those into account too.</li>
</ul>

<p class="highlight">&gt; Surprisingly, according to Google Keyword Planner, adding "free" to a search term doesn't change its volume at all.</p>

<p class="article">Keywords by topic:</p>

<table class="article auto-cols">
  <thead><tr><th>Topic</th><th>Count</th><th>Priority</th><th>Main target page</th></tr></thead>
  <tbody>
    <tr><td>Career guidance</td><td>17</td><td>8</td><td>Test page, homepage, "What profession suits me?" article</td></tr>
    <tr><td>Career change</td><td>12</td><td>2</td><td>Career change pillar article, In-Demand Occupations 2026</td></tr>
    <tr><td>Career counseling</td><td>5</td><td>2</td><td>Homepage</td></tr>
    <tr><td>Self-knowledge</td><td>4</td><td>1</td><td>Test page</td></tr>
    <tr><td>Job search</td><td>9</td><td>0</td><td>Later blog posts</td></tr>
  </tbody>
</table>

<h2>Technical fixes</h2>
<p class="article">The main problem is that for now <strong>we are missing real links</strong> in the menu, on the homepage and, in fact, on most of the site, which means Google can't find those pages yet.</p>

<p class="highlight">&gt; Turns out Google only follows real &lt;a href="..."&gt; links, not code that runs on click. Our front end looks like Angular, so the fix is simple: rewrite the menu items as &lt;a routerLink="/hu/holland-codes"&gt;. The links work exactly the same for users, but the HTML gets a real href that Google can follow.</p>

<p class="article">With that said, we might be sitting on a gold mine… Since <strong>we have a separate page for each of our nearly one thousand careers</strong> (e.g., marketing manager) with very detailed descriptions, when we fix these links, <strong>we may unlock long-tail searches for every one of these occupations</strong> (e.g., what does a marketing manager do?)!</p>

<p class="article">Along these lines, we also need to <strong>fix robots.txt and sitemap.xml</strong>, and submit the sitemap to Google Search Console.</p>

<p class="highlight">&gt; Fixing the sitemap means making sure it actually lists every page we want Google to see: the test page, the homepage and all ~1,000 career pages. A sitemap that leaves them out won't do much, even after we submit it.</p>

<p class="highlight">&gt; For robots.txt, we need to make sure it doesn't block anything important and that it points to our sitemap with a Sitemap: https://careeverz.com/sitemap.xml line. Bonus: that line helps Bing find us too, and Bing feeds ChatGPT and other AI search tools.</p>

<p class="article">We also need <strong>a unique Hungarian page title and description for every important page</strong>.</p>

<p class="highlight">&gt; Angular's Title and Meta services let us set these page by page. Here's what I'm planning (in Hungarian, the way they'll show up in Google):</p>
<ul>
  <li>/hu/: „AI karriertanácsadás: találd meg az álmaid karrierjét | CareeVerz"</li>
  <li>/hu/assessment: „Ingyenes pályaorientációs teszt: milyen szakma illik hozzád? | CareeVerz"</li>
  <li>/hu/holland-codes: „Holland-kódok (RIASEC): mit jelentenek a típusok? | CareeVerz"</li>
  <li>Karrieroldal: „Marketingmenedzser: feladatok, személyiség, kapcsolódó karrierek | CareeVerz"</li>
</ul>

<p class="highlight">&gt; While we're at it, we should also set &lt;html lang="hu"&gt;, hreflang between the Hungarian and English versions, and a canonical URL.</p>

<p class="article">We also need intro text on the test page (/hu/assessment) so that Google (and users) understand what it's about.</p>

<h2>Day 1 from Search Console</h2>
<p class="article">From mid-July to mid-October 2026 (3 months):</p>
<ul>
  <li>13 clicks and 54 impressions, at an average position of 6.6. All traffic went to the homepage (careeverz.com/hu).</li>
  <li>We only show up for brand searches, and misspelled ones at that ("carevers", "carefiz", "carezi"). These are people who already know our name.</li>
  <li>We don't appear yet for any of our target keywords (career aptitude test, career counseling, etc.).</li>
  <li>So far Google has indexed only 2 pages, with 4 left out. The test page and the career pages are probably not in Google yet, which makes the technical fixes the most urgent.</li>
</ul>

<h2>Questions</h2>
<p class="article"><strong>If we have AI generate blog posts, will Google index them the same way?</strong></p>
<p class="highlight">&gt; Yes, Google indexes them the same way. It looks at whether the content is useful and original, not at who wrote it. Mass-produced, mechanical articles can hurt rankings, though, so every article needs editing and our own examples and data.</p>

<p class="article"><strong>What share of searches do ads eat up? In other words, of the average 100–1,000 searches, how many can we reach organically?</strong></p>
<p class="highlight">&gt; There's no general number for this, because it varies a lot by keyword and device, and besides ads, Google's AI Overviews also take clicks. After a few weeks of Search Console data we can make our own estimate: impressions and click-through rate show how much we reach organically.</p>

<p class="article"><strong>If we have basic SEO, does that also boost our visibility in LLMs? If not, what does that take? Reddit?</strong></p>
<p class="highlight">&gt; Partly, yes. Many AI search tools (ChatGPT, Perplexity, Google AI Overviews) work from Google and Bing results, so sites that rank well have a better chance of being included. That's why it's worth submitting the sitemap to Bing Webmaster Tools too. Beyond that, what matters is how often we're mentioned elsewhere: Reddit and forums, articles, and "best career aptitude tests" style lists.</p>

<h2>Next steps</h2>
<ol>
  <li><strong>Test page (/hu/assessment):</strong> new title and meta, H1: "Career aptitude and career choice test", a 300–500 word intro (what it measures, RIASEC and Big Five, how long it takes) and an FAQ block.</li>
  <li><strong>Homepage (/hu/):</strong> new title and meta, with the terms career counseling, career choice, "free" and "AI career counselor" in the copy.</li>
  <li><strong>In-Demand Occupations 2026 page:</strong> new title and updated content. A quick win, since the page already exists.</li>
  <li><strong>Shipping the technical fixes:</strong> real links, robots.txt, sitemap.</li>
  <li><strong>Submitting the sitemap:</strong> Search Console is already connected, so in 4–6 weeks we can fine-tune based on real data.</li>
  <li><strong>Google Ads:</strong> the career aptitude and career choice test keywords go into the campaign, pointing to the test page.</li>
  <li><strong>First blog post:</strong> "What profession suits me?", with a button to the test at the end.</li>
  <li><strong>Career change pillar article:</strong> over 30 and over 40, career change vs. career adjustment, "I don't like my job", with internal links to the test.</li>
  <li><strong>Later:</strong> career guidance for adults, what trade should I learn, and the first job-search article ("CV template for entry-level").</li>
</ol>

<h2>So, did it work?</h2>
<p class="article">Not yet, and that's the honest answer. SEO is slow: Google needs weeks to crawl, index and start trusting new pages, so there's nothing to celebrate (or cry about) today. But now we have a baseline, and that's what makes this an experiment instead of a hope.</p>

<p class="article">Here's what I'll report back on in about six weeks, once the fixes are live:</p>
<ul>
  <li>How many of our ~1,000 pages Google has indexed (today: 2).</li>
  <li>Whether we show up for "pályaorientációs teszt" and our other target keywords (today: not at all).</li>
  <li>How many test starts come from Google versus our videos.</li>
  <li>Whether any of this makes us show up in ChatGPT or Perplexity answers.</li>
</ul>

<p class="article">If the gold mine turns out to be real, you'll read about it here. If it turns out to be fool's gold, you'll read about that too. Aron out.</p>

<br>
<br>
  `,
};
