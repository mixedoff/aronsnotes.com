export const article39 = {
  id: 39,
  date: '12.10.2026',
  folder: ['technology', 'communications'],
  subFolder: ['seo', 'copywriting'],
  subSubFolder: [''],
  paths: [['technology', 'seo'], ['communications', 'copywriting']],
  project: 'CareeVerz',
  title: 'new landing page review',
  subtitle: 'An SEO and copy review of the new CareeVerz landing page, with every suggested change',
  technologies: [''],
  size: null,
  author: null,
  published: null,
  content: `
<p class="article"><strong>The problem:</strong> we needed a proper landing page because the previous one acted more like a start page. It was a beautiful product screen, but not a page built to persuade and convert. (Previous design: <a href="/note/4">aronsnotes.com/note/4</a>, see the first picture under "key screens".)</p>

<p class="article"><strong>The solution:</strong> we built a new scroll-based landing page with subtle animations, designed to convert our target audience.</p>

<img src="./assets/img/article39/01-hero.jpg" alt="New CareeVerz landing page: hero">
<img src="./assets/img/article39/02-why-choose-careeverz.jpg" alt="New CareeVerz landing page: why choose CareeVerz section">
<img src="./assets/img/article39/03-problems-solutions.jpg" alt="New CareeVerz landing page: problems and solutions section">
<img src="./assets/img/article39/04-the-assessment.jpg" alt="New CareeVerz landing page: the assessment section">
<img src="./assets/img/article39/05-personality-graph.jpg" alt="New CareeVerz landing page: personality graph section">
<img src="./assets/img/article39/06-industry-matching.jpg" alt="New CareeVerz landing page: industry matching section">
<img src="./assets/img/article39/07-partner-with-us.jpg" alt="New CareeVerz landing page: partner with us section">
<img src="./assets/img/article39/08-faq.jpg" alt="New CareeVerz landing page: FAQ section">
<img src="./assets/img/article39/09-final-cta.jpg" alt="New CareeVerz landing page: final call to action">

<p class="article">The new page's flow and visuals were already strong, but the copy and SEO needed a rewrite.</p>

<h2>SEO and technical issues</h2>
<p class="article">"The perfect career is waiting for you" is a generic promise that could be on any job portal. That might work for us later (once we have jobs listed too), but for now I think "Which profession suits you?" would be much better. It mirrors how people search ("which profession suits me").</p>
<p class="highlight">&gt; Change hero title to: Which profession suits you?</p>

<p class="article">People search for terms like "pályaorientációs teszt" (career guidance test), "pályaválasztási teszt" (career choice test) or "milyen szakma illik hozzám" (which profession suits me). None of these are in the title or the H1 right now. Suggestion for the subtitle under the title (the title is good because it's emotional):</p>
<p class="highlight">&gt; Change hero subtitle to: Take CareeVerz's free 10-minute career guidance test.</p>

<p class="article"><strong>Social proof is weak.</strong> There's one anonymous testimonial ("game-changer… dream job"), which can come across as made up. Use 2–3 real ones with name, age or role and what they ended up choosing, or a number like "X people tested". If you don't have those yet, I'd remove the section rather than leave one generic quote.</p>
<p class="highlight">&gt; Collect 2–3 real testimonials, or remove the section for now.</p>

<p class="article"><strong>The brand name is spelled two ways:</strong> CareeVerz and Careeverz.</p>
<p class="highlight">&gt; Replace Careeverz with CareeVerz.</p>

<p class="article"><strong>No og:image.</strong> Links shared on Messenger, WhatsApp, Facebook or LinkedIn will show a blank preview. That matters given how much social video you do.</p>
<p class="highlight">&gt; Add the og:images: careeverz-og-en.png and careeverz-og-hu.png.</p>

<p class="article"><strong>No analytics on test.careeverz.com.</strong></p>
<p class="highlight">&gt; Make sure production (careeverz.com) tracks CTA clicks (hero vs. mid-page vs. footer) so you can see which button actually converts.</p>

<h2>Language issues</h2>
<p class="article">The copy was not terribly bad, but it was clearly AI-generated. I mainly suggested simpler phrasings, everyday words ("occupations" instead of "career titles", "test" instead of "assessment"), less overselling ("gold standard" → "one of the most respected models"), and the same key figures everywhere: a 10-minute test and nearly 1000 occupations.</p>

<p class="article"><em>Note: the site is in Hungarian, and the examples below are English translations. Some changes (hyphens, capitals, formal vs. informal "you") only make sense in the Hungarian original.</em></p>

<table class="article">
  <thead><tr><th>Current</th><th>Suggestion</th></tr></thead>
  <tbody>
    <tr><td>…the career that suits you best in the world.</td><td>…the careers that suit you best. ("in the world" sounds odd)</td></tr>
    <tr><td>Access detailed information… from 1000 career types</td><td>Explore the details of nearly 1000 occupations: …</td></tr>
    <tr><td>Join us in gamifying career choice, helping people find…</td><td>Let's make choosing a career more playful together, and help everyone find the path that's right for them.</td></tr>
    <tr><td>Yes, companies are our partners to optimize their recruitment.</td><td>Yes, companies also use it to make their recruitment more efficient.</td></tr>
    <tr><td>for secondary and university students</td><td>for high school and university students</td></tr>
    <tr><td>You get a personalized dashboard… a list of career titles</td><td>You get a personal results page… a list of occupations that suit you</td></tr>
    <tr><td>Our AI continuously analyzes…</td><td>Our system continuously analyzes…</td></tr>
    <tr><td>Worried about industry changes or a future-proof career?</td><td>Afraid your chosen profession will be outdated in a few years?</td></tr>
    <tr><td>…we highlight the 10-20 roles</td><td>…we highlight the 10–20 occupations</td></tr>
    <tr><td>…developed by John Holland, and widely considered the gold standard of …</td><td>…developed by John Holland, and still considered one of the most respected models in the field</td></tr>
    <tr><td>What if I don't have the skills for my job?</td><td>What if I don't have the necessary skills yet?</td></tr>
  </tbody>
</table>

<h3>Clearer, shorter sentences</h3>
<table class="article">
  <thead><tr><th>Current</th><th>Suggestion</th></tr></thead>
  <tbody>
    <tr><td>Our AI-based assessment reveals your strengths, interests and values, offering clear, personalized career options based on your unique profile.</td><td>Our AI-based test reveals your strengths, your interests and your values. Based on these, you get clear, personalized career suggestions.</td></tr>
    <tr><td>CareeVerz filters careers, highlighting the best matches so you can focus on the paths that suit you, saving time and stress.</td><td>Out of nearly 1000 occupations, CareeVerz picks out the ones that suit you best. That way you only deal with the ones that are really right for you, and you save a lot of time and stress.</td></tr>
    <tr><td>…reducing turnover and increasing team performance.</td><td>…This reduces turnover and improves team performance.</td></tr>
  </tbody>
</table>

<h3>Hyphens and capitals</h3>
<table class="article">
  <thead><tr><th>Current</th><th>Suggestion</th></tr></thead>
  <tbody>
    <tr><td>AI-based career-matching, hyphenated (meta description) / AI-Based Career-Matching, capitalized (og:title)</td><td>AI-based career matching (one word, no capitals)</td></tr>
    <tr><td>AI Career-Matching (hyphenated, capitalized)</td><td>AI-based career matching (one word, no capitals)</td></tr>
    <tr><td>our talent-matching platform (hyphenated)</td><td>our talent-matching platform (one word)</td></tr>
    <tr><td>Work-Interest And Preference Profiler (every word capitalized)</td><td>Interest and preference profile</td></tr>
    <tr><td>Industry- And Sector-Matching (capitalized, hyphenated)</td><td>Industry and sector matching (no capitals, one word)</td></tr>
    <tr><td>Career-Recommendations (hyphenated, capitalized)</td><td>Career recommendations (one word, no capitals)</td></tr>
    <tr><td>work-interest profilers (FAQ)</td><td>interest questionnaires</td></tr>
    <tr><td>with Careeverz, hyphenated (meta) / with CareeVerz, hyphenated</td><td>with CareeVerz, written as one word (per Hungarian spelling rules)</td></tr>
  </tbody>
</table>

<h3>Informal language in the B2B block (tegezés vs. magázás)</h3>
<p class="article">Here I suggest impersonal wording, so we don't have to use either the informal or the formal "you".</p>
<table class="article">
  <thead><tr><th>Current</th><th>Suggestion</th></tr></thead>
  <tbody>
    <tr><td>Use our AI-based talent-matching platform to find the perfect candidates for your organization. Make recruitment more efficient with data-driven insights.</td><td>Our AI-based talent-matching platform makes it easier to find candidates who fit the organization. Our data-based analyses make recruitment faster and more accurate.</td></tr>
    <tr><td>Strengthen your career guidance services with our comprehensive assessment tools. Help students discover their potential and make informed decisions about their future.</td><td>Our tests complement career guidance at school. They help students recognize their strengths and make better-informed decisions about further studies.</td></tr>
    <tr><td>Showcase your programs and reach your future students through our platform. Promote your fields of study to a targeted audience of career seekers.</td><td>On our platform, programs reach the young people who are choosing a career right now and whose interests fit the field.</td></tr>
    <tr><td>Become Our Partner (3×)</td><td>Let's partner up</td></tr>
  </tbody>
</table>

<h3>Consistent CTA</h3>
<table class="article">
  <thead><tr><th>Current</th><th>Suggestion</th></tr></thead>
  <tbody>
    <tr><td>Launch the test (4×)</td><td>Start the test</td></tr>
    <tr><td>Start the test (hero)</td><td>unchanged</td></tr>
  </tbody>
</table>

<h3>"Test" instead of "assessment"</h3>
<table class="article">
  <thead><tr><th>Current</th><th>Suggestion</th></tr></thead>
  <tbody>
    <tr><td>The Assessment</td><td>The test</td></tr>
    <tr><td>Short and smart assessment</td><td>Short but thorough test</td></tr>
    <tr><td>Smart Assessment</td><td>Smart test</td></tr>
    <tr><td>Complete our comprehensive personality, interest and ability assessment to understand your unique profile.</td><td>Take our test on your personality, interests and abilities, and get to know yourself better.</td></tr>
    <tr><td>Holland Work Personality Assessment</td><td>Holland work personality test</td></tr>
    <tr><td>How long does the assessment take?</td><td>How long does the test take?</td></tr>
    <tr><td>The comprehensive assessment takes about 10-15 minutes.</td><td>The test takes roughly 10 minutes.</td></tr>
    <tr><td>Transform your assessment results…</td><td>Based on your results…</td></tr>
  </tbody>
</table>

<h3>Further fixes</h3>
<table class="article">
  <thead><tr><th>Current</th><th>Suggestion</th></tr></thead>
  <tbody>
    <tr><td>Scroll to discover</td><td>Scroll down</td></tr>
    <tr><td>Struggling to define your ideal career?</td><td>Not sure which career suits you?</td></tr>
    <tr><td>Lost in the flood of information? Among thousands of jobs and confusing job ads, it's hard to find your dream career.</td><td>Lost among the options? It's hard to find your way among thousands of professions and unclear job ads.</td></tr>
    <tr><td>Personalized Match</td><td>Personalized result</td></tr>
    <tr><td>Take the test and fall in love with your career path today!</td><td>Take the test and find the career you'll really love.</td></tr>
    <tr><td>The 6-Trait Personality Graph</td><td>Your six-dimension personality profile</td></tr>
    <tr><td>Visualize your professional DNA with our interactive Holland Code (RIASEC) radar chart. This data-driven snapshot of your personality traits is the foundation for finding the perfect role.</td><td>An interactive radar chart shows how your personality is spread across the six Holland types (RIASEC). We use this to find the role that suits you.</td></tr>
    <tr><td>Whether you're a 'Realistic' doer or an 'Investigative' thinker, we match you with careers that value your strengths.</td><td>Whether you're the practical "realistic" type or the analytical "investigative" type, we show you roles where your strengths count.</td></tr>
    <tr><td>Build your future in a professional field that rewards your natural way of thinking and working.</td><td>We show you fields where your natural way of thinking and working is an advantage.</td></tr>
    <tr><td>…whether you lean toward "People vs. Things" or "Ideas vs. Data".</td><td>…whether you lean more toward people or things, ideas or data.</td></tr>
    <tr><td>This short investment gives you a detailed roadmap for your professional future.</td><td>In that time, you get a detailed roadmap for your professional future.</td></tr>
    <tr><td>…we suggest resilient career paths that offer growth potential in the evolving economy.</td><td>…we suggest careers that still have a future in a changing economy.</td></tr>
  </tbody>
</table>

<h3>Problem #1 #2 #3 feels like a template</h3>
<table class="article">
  <thead><tr><th>Current</th><th>Suggestion</th></tr></thead>
  <tbody>
    <tr><td><strong>Problem #1</strong><br>Struggling to define your ideal career? Many people are unsure what really fits their personality and goals.</td><td><strong>"I have no idea what suits me."</strong><br>Many people stay for years in a career that isn't right for them, because nobody helped them figure out what fits their personality.</td></tr>
    <tr><td><strong>Solution #1</strong><br>Our AI-based assessment reveals…</td><td><strong>10 minutes, and you'll see more clearly</strong><br>The test reveals your strengths, your interests and your values, and based on these you get concrete career suggestions.</td></tr>
    <tr><td><strong>Problem #2</strong><br>Lost in the flood of information? Among thousands of jobs and confusing job ads…</td><td><strong>"There are too many options, I don't know where to start."</strong><br>It's easy to get lost among thousands of professions and unclear job ads.</td></tr>
    <tr><td><strong>Solution #2</strong><br>CareeVerz filters careers…</td><td><strong>Your 10–20 careers out of a thousand</strong><br>Out of nearly 1000 occupations, we pick the 10–20 that really suit you. Those are the only ones you need to look at.</td></tr>
    <tr><td><strong>Problem #3</strong><br>Worried about industry changes or a future-proof career?</td><td><strong>"What if my profession becomes outdated in a few years?"</strong><br>The job market changes fast, and what seems safe today may not be tomorrow.</td></tr>
    <tr><td><strong>Solution #3</strong><br>Our AI continuously analyzes global job market trends…</td><td><strong>A career with a future</strong><br>We track job market trends, and for every recommendation we show whether that profession is growing, stable or shrinking.</td></tr>
  </tbody>
</table>

<h2>Next steps</h2>
<ul>
  <li>Change the hero title and subtitle (see SEO and technical issues).</li>
  <li>Apply the copy suggestions from the tables.</li>
  <li>Use "Start the test" on every CTA button.</li>
  <li>Collect 2–3 real testimonials, or remove the testimonial section.</li>
  <li>Replace Careeverz with CareeVerz everywhere.</li>
  <li>Add the og:images (EN and HU).</li>
  <li>Set up CTA click tracking on production.</li>
</ul>

<br>
<br>
  `,
};
