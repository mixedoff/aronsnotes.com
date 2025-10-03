export const article19 = {
  id: 19,
  date: '04.07.2025',
  folder: ['development'],
  subFolder: ['frontend', 'animation'],
  subSubFolder: [''],
  project: 'aronsnotes',
  title: 'aronsnotes quit page flickering animation',
  subtitle: 'improving the flow of the quit page',
  technologies: ['css'],
  author: 'Aron Kovacs',
  published: '2025',
  size: '0.5KB',
  content: `
    <h2>Executive Summary</h2>
    <p class="article mb-2">
      I've implemented a sophisticated flickering animation on the <a href="https://aronsnotes.com/quit" target="_blank">quit page</a>, creating a subtle yet engaging user experience.
    </p>

    <h2>Intro</h2>
    <p class="article mb-2">
      I was pretty happy with the quit page's Matrix-style typing animation. It blended well with the story of aronsnotes.com—gamifying digital character development.
    </p>
    <p class="article mb-2">
      The "wake up neo…" text in the animation blurs the line between the digital and physical worlds. It closes the UX loop on the site—when you try to quit aronsnotes, you realize you're not just playing a game—you're playing life.
    </p>

    <h2>User Story</h2>
    <p class="article mb-2">
      That said, the existing flow sucked. Many users complained they couldn't return after quitting, even though clicking the logo in the bottom nav actually brings you back to the main page.
    </p>

    <h2>Fix</h2>
    <p class="article mb-2">
      I wanted to improve the flow, make it more obvious that the text is clickable, and breathe a bit more life into an otherwise blunt page.
    </p>
    <p class="article mb-2">
      I had tried to prompt a flickering effect on the bottom nav logo using Cursor a couple of months ago—it failed miserably.
    </p>
    <p class="article mb-2">
      Now, a couple of months later, Cursor has improved absurdly, and I managed to get something out with a prompt—but it still flopped.
    </p>
    <p class="article mb-2">
      So, I searched the web for a great flickering animation to serve as the base for the new UX.
    </p>
    <blockquote>
      "Good artists copy. Great artists steal." – Pablo Picasso
    </blockquote>
    <p class="article mb-2">
      I found a perfect one—shoutout to <a href="https://texteffects.dev/posts/flickering-text-effect" target="_blank">texteffects.dev</a>.
    </p>
    <p class="article mb-2">
      That became the foundation. With some tweaking, it blended perfectly with the site's style.
    </p>

    <h2>CSS</h2>
    <code>
@keyframes flicker {
  0% {
    opacity: 0.4;
    text-shadow: none;
  }
  19.9%, 22%, 62.9%, 64%, 64.9%, 70%, 100% {
    opacity: 0.99;
    text-shadow: 
      -1px -1px 0 rgba(111, 250, 30, 0.4), 
       1px -1px 0 rgba(111, 250, 30, 0.4), 
      -1px  1px 0 rgba(111, 250, 30, 0.4), 
       1px  1px 0 rgba(111, 250, 30, 0.4), 
       0 -2px 8px #6ffa1e,
       0 0 2px #6ffa1e,
       0 0 5px #6ffa1e, 
       0 0 15px #6ffa1e, 
       0 0 2px #6ffa1e, 
       0 2px 3px #000;
  }
  20%, 21.9%, 63%, 63.9%, 65%, 69.9% {
    opacity: 0.4;
    text-shadow: none;
  }
}
    </code>

    <h2>Fine-tuning</h2>
    <p class="article mb-2">
      Now came the time to finesse the details.
    </p>
    <p class="article mb-2">
      I synchronized the Matrix typing animation so that the flickering kicks in right after the fade-out.
    </p>
    <p class="article mb-2">
      When the logo starts flickering, the bottom nav's background vanishes, and the entire screen background shifts from blackish to pitch black—mimicking how real life looks when electrical lights flicker and die.
    </p>
    <p class="article mb-2">
      It was almost perfect. But one thing was still off: the Matrix animation was fading out gradually, which clashed with the abrupt flickering. So I updated it—now, the Matrix effect cuts off instantly, precisely when the flickering begins.
    </p>

    <h2>Try it out</h2>
    <p class="article mb-2">
      Go ahead—close the article and hit "quit" in the top nav.
    </p>
  `,
}; 