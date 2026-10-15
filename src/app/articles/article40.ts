export const article40 = {
  id: 40,
  date: '12.10.2026',
  folder: ['growth'],
  subFolder: ['analytics'],
  subSubFolder: [''],
  project: 'CareeVerz',
  title: 'one screen above all',
  subtitle: 'A one-screen KPI dashboard for CareeVerz in Google Analytics, and what it told us',
  technologies: ['google-analytics', 'claude'],
  size: null,
  author: null,
  published: null,
  content: `
<p class="article">We've been tracking <a href="https://careeverz.com" target="_blank" rel="noopener">CareeVerz.com</a>'s activity in Google Analytics (GA) for a while. But once a few of our videos started gaining traction, we needed a single screen that shows our key performance indicators (KPIs) at a glance. We're pushing on several fronts at once, so we have to be able to tell what's actually working.</p>

<p class="article">The solution: one custom dashboard in GA that shows only the numbers that matter to us, on one screen, readable in under ten seconds. Here's how we built it and what it showed us, including one number we didn't like.</p>

<img src="./assets/img/article40/01.png" alt="The CareeVerz KPIs dashboard in Google Analytics: active users over time, scorecards and the app funnel">

<h2>Deciding what to track</h2>
<p class="article">Before building anything, we had to agree on what "doing well" means for CareeVerz. We're an early-stage career guidance app, not an e-commerce shop, so revenue and cart size don't help us. We care about three things:</p>
<ol>
  <li><strong>Reach.</strong> Are people finding us?</li>
  <li><strong>Activation.</strong> Do they start the career test, and do they like what it shows them?</li>
  <li><strong>Engagement.</strong> Once they're in, do they actually use the app?</li>
</ol>

<p class="article">Every tile on the dashboard answers one of these questions. For now, reach mostly lives on our social channels, so the dashboard focuses on the other two.</p>

<h2>What's on the dashboard</h2>
<p class="article"><strong>Active users over time.</strong> A line chart from September 2024 to today. It's the first thing I look at, because it shows at a glance whether a campaign or a post actually moved anything.</p>

<p class="article"><strong>Active users and first visits.</strong> Two scorecards side by side. Comparing them shows how many people come back, not just how many show up.</p>

<p class="article"><strong>Page views and average engagement time.</strong> These show how deep people go once they're in.</p>

<p class="article"><strong>Get started clicks.</strong> A custom event that fires when someone clicks the main call to action and starts the test. This is our most important conversion.</p>

<p class="article"><strong>Likes and unlikes.</strong> Also custom events. In the app, you swipe through real work tasks and mark the ones you like. These two counters show how people react to what we show them. More importantly, they feed our machine learning model, so its recommendations keep getting better.</p>

<p class="article"><strong>App funnel.</strong> Strictly speaking, it's a three-step funnel with reach as the first step, but for now we get reach data from our social channels. The remaining two steps (all users → clicked Get started) show what share of visitors actually start the test. This is probably the most important percentage on the screen, because it shows how well we convert visitors.</p>

<h2>How we built it</h2>
<ol>
  <li><strong>Set up custom events.</strong> We added <em>get_started</em>, <em>like</em> and <em>unlike</em> to the code with gtag.</li>
  <li><strong>Registered it in GA4.</strong> We added <em>get_started</em> as a custom event in GA4, so it shows up as a metric on the dashboard.</li>
  <li><strong>Built the dashboard.</strong> It's a new feature in GA and a great way to put all the numbers on one screen.</li>
  <li><strong>Set the date range.</strong> It starts on September 10, 2024, when the site went live.</li>
</ol>

<p class="highlight">One catch: we added the custom events long after launch, so the event numbers in our funnel are much lower than they should be.</p>

<h2>What the numbers told us</h2>
<p class="article">Here's what the dashboard shows for September 2024 to October 2026:</p>
<ul>
  <li><strong>834 active users</strong> and <strong>826 first visits.</strong> Almost every user is new. That's great for reach, but it means very few people come back. Retention is the next problem to solve.</li>
  <li><strong>6,700 page views</strong>, about eight per user. People who come in do look around.</li>
  <li><strong>114 Get started clicks.</strong> The funnel shows only 24 users at step 1, because we connected the custom events much later.</li>
  <li><strong>78 likes vs. 19 unlikes.</strong> About four out of five reactions are positive, so what we show people mostly lands.</li>
  <li><strong>The spikes.</strong> The line chart has two clear peaks: a smaller one around mid-2025 and a big one in early 2026, close to 80 users in a day. Both came from our collaborations with schools.</li>
  <li><strong>The funnel:</strong> 45.8% of users clicked Get started, and 54.2% left before they did. Keep in mind this is based on only 24 users (11 clicks), because the funnel only counts people since we added the event. A conversion rate near 50% would be very high, which is great for us. But I suspect the school collaborations behind those spikes are driving it, and it will very likely drop once more of our growth comes from social, organic and word of mouth. Bringing that drop-off down is exactly what the <a href="/note/39">new landing page</a> is for.</li>
  <li><strong>Average engagement time</strong> shows 55m 05s, but a few very long internal and test sessions inflate it. If we start the date range in 2025, which leaves those sessions out, it drops to around 10 minutes. That's still not great, since the test alone takes about that long. The median would tell us much more, so our next step is exporting the raw data to BigQuery to calculate it.</li>
</ul>

<h2>What I'd do differently</h2>
<ul>
  <li>Filter out internal traffic from day one, so our own testing doesn't skew the numbers.</li>
  <li>Plan custom events before launch, not after. Any event you add later has no history.</li>
  <li>Add two more custom events: <em>test_finish</em>, so we can see how many people who start the test actually finish it, and <em>rating</em>.</li>
  <li>Add a returning-users tile, since retention turned out to be the real story.</li>
</ul>

<h2>Want to build your own?</h2>
<p class="article">Here's what you need:</p>
<ul>
  <li>A GA4 property with tracking live on your site or app</li>
  <li>A short list of 5–8 metrics that answer "are we doing well?" for your product</li>
  <li>Custom events for the actions that matter most (for us: starting the test, and liking or unliking a task)</li>
  <li>About an hour to put it together (I used Claude in Chrome)</li>
</ul>

<h2>What's next</h2>
<p class="article">The dashboard didn't make CareeVerz grow by itself. But now, when we post a video or run a collaboration, we can see within a day whether it moved anything. Next, we're working on retention and testing the new landing page.</p>

<br>
<br>
  `,
};
