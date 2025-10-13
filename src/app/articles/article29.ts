export const article29 = {
  id: 29,
  date: '13.10.2025',
  folder: ['development', 'design'],
  subFolder: ['angular', 'animation'],
  subSubFolder: ['components'],
  project: 'aronsnotes',
  title: 'building an animated custom cursor in angular',
  subtitle: 'Replace the default cursor with a playful animated fly',
  technologies: ['angular', 'typescript', 'css', 'piskel'],
  size: null,
  author: null,
  published: null,
  content: `
    <h6>the concept</h6>
    <p class="article">The default cursor is boring. Why not replace it with something more interesting? In this article, I'll walk through building a custom animated cursor component that replaces the system cursor with an animated fly character that responds to different user interactions.</p>
    
    <h6>component setup</h6>
    <p class="article">The custom cursor is a standalone Angular component that needs to:</p>
    <ul>
      <li>Track mouse position in real-time</li>
      <li>Display different animations based on cursor state</li>
      <li>Hide the system cursor completely</li>
      <li>Handle edge cases like mobile devices and screen recording</li>
    </ul>

    <p class="article">Start by creating a standalone component with the necessary imports:</p>
    <code>import { Component, OnInit, OnDestroy, HostListener, Renderer2, Inject } from '@angular/core';</code>
    <code>import { CommonModule } from '@angular/common';</code>
    <code>import { DOCUMENT } from '@angular/common';</code>

    <h6>the three animation states</h6>
    <p class="article">The cursor has three distinct animation states, each with its own sprite frames:</p>

    <p class="article"><strong>1. Moving (Wing Flapping):</strong> When the mouse is moving, the fly shows a 4-frame wing flapping animation. This creates a lively, buzzing effect.</p>
    <code>// Use wing flap animation when moving (frames 00-03)</code>
    <code>return \`/assets/img/cursor/fly_wing_flap_frame_\${frameNumber}.png\`;</code>
    
    <div style="display: flex; gap: 10px; margin: 20px 0; align-items: center;">
      <img src="assets/img/cursor/fly_wing_flap_frame_00.png" style="width: 32px; height: 32px; image-rendering: pixelated;" alt="Wing flap frame 1" />
      <img src="assets/img/cursor/fly_wing_flap_frame_01.png" style="width: 32px; height: 32px; image-rendering: pixelated;" alt="Wing flap frame 2" />
      <img src="assets/img/cursor/fly_wing_flap_frame_02.png" style="width: 32px; height: 32px; image-rendering: pixelated;" alt="Wing flap frame 3" />
      <img src="assets/img/cursor/fly_wing_flap_frame_03.png" style="width: 32px; height: 32px; image-rendering: pixelated;" alt="Wing flap frame 4" />
    </div>

    <p class="article"><strong>2. Idle (Rubbing):</strong> After 500ms of no movement, the fly switches to an idle "rubbing" animation. It alternates between two different rubbing animations (regular rubbing and leg rubbing) to add variety.</p>
    <code>// Alternates between regular and leg rubbing</code>
    <code>if (this.useLegRubbing) {</code>
    <code>  return \`/assets/img/cursor/fly_leg_rubbing_v2_frame_\${this.currentFrame - 1}.png\`;</code>
    <code>} else {</code>
    <code>  return \`/assets/img/cursor/fly_rubbing_frame_\${frameNumber}.png\`;</code>
    <code>}</code>

    <p class="article">Regular rubbing animation (4 frames):</p>
    <div style="display: flex; gap: 10px; margin: 20px 0; align-items: center;">
      <img src="assets/img/cursor/fly_rubbing_frame_00.png" style="width: 32px; height: 32px; image-rendering: pixelated;" alt="Rubbing frame 1" />
      <img src="assets/img/cursor/fly_rubbing_frame_01.png" style="width: 32px; height: 32px; image-rendering: pixelated;" alt="Rubbing frame 2" />
      <img src="assets/img/cursor/fly_rubbing_frame_02.png" style="width: 32px; height: 32px; image-rendering: pixelated;" alt="Rubbing frame 3" />
      <img src="assets/img/cursor/fly_rubbing_frame_03.png" style="width: 32px; height: 32px; image-rendering: pixelated;" alt="Rubbing frame 4" />
    </div>

    <p class="article">Leg rubbing animation (4 frames):</p>
    <div style="display: flex; gap: 10px; margin: 20px 0; align-items: center;">
      <img src="assets/img/cursor/fly_leg_rubbing_v2_frame_0.png" style="width: 32px; height: 32px; image-rendering: pixelated;" alt="Leg rubbing frame 1" />
      <img src="assets/img/cursor/fly_leg_rubbing_v2_frame_1.png" style="width: 32px; height: 32px; image-rendering: pixelated;" alt="Leg rubbing frame 2" />
      <img src="assets/img/cursor/fly_leg_rubbing_v2_frame_2.png" style="width: 32px; height: 32px; image-rendering: pixelated;" alt="Leg rubbing frame 3" />
      <img src="assets/img/cursor/fly_leg_rubbing_v2_frame_3.png" style="width: 32px; height: 32px; image-rendering: pixelated;" alt="Leg rubbing frame 4" />
    </div>

    <p class="article"><strong>3. Over Clickable Elements (Slurping):</strong> When hovering over buttons, links, or other interactive elements, the fly shows an 18-frame "slurping" animation.</p>
    <code>// Use slurping animation when over clickable elements (frames 00-17)</code>
    <code>return \`/assets/img/cursor/fly_slurping_v5_frame_\${frameNumber}.png\`;</code>

    <p class="article">Slurping animation (showing key frames from 18 total):</p>
    <div style="display: flex; gap: 10px; margin: 20px 0; align-items: center; flex-wrap: wrap;">
      <img src="assets/img/cursor/fly_slurping_v5_frame_00.png" style="width: 32px; height: 32px; image-rendering: pixelated;" alt="Slurping frame 1" />
      <img src="assets/img/cursor/fly_slurping_v5_frame_03.png" style="width: 32px; height: 32px; image-rendering: pixelated;" alt="Slurping frame 4" />
      <img src="assets/img/cursor/fly_slurping_v5_frame_06.png" style="width: 32px; height: 32px; image-rendering: pixelated;" alt="Slurping frame 7" />
      <img src="assets/img/cursor/fly_slurping_v5_frame_09.png" style="width: 32px; height: 32px; image-rendering: pixelated;" alt="Slurping frame 10" />
      <img src="assets/img/cursor/fly_slurping_v5_frame_12.png" style="width: 32px; height: 32px; image-rendering: pixelated;" alt="Slurping frame 13" />
      <img src="assets/img/cursor/fly_slurping_v5_frame_15.png" style="width: 32px; height: 32px; image-rendering: pixelated;" alt="Slurping frame 16" />
      <img src="assets/img/cursor/fly_slurping_v5_frame_17.png" style="width: 32px; height: 32px; image-rendering: pixelated;" alt="Slurping frame 18" />
    </div>

    <h6>tracking mouse position</h6>
    <p class="article">The cursor needs to follow the mouse smoothly. Use Angular's @HostListener to capture mouse events:</p>
    <code>@HostListener('document:mousemove', ['$event'])</code>
    <code>onMouseMove(event: MouseEvent) {</code>
    <code>  this.cursorX = event.clientX;</code>
    <code>  this.cursorY = event.clientY;</code>
    <code>  this.isCursorVisible = true;</code>
    <code>  this.isMoving = true;</code>
    <code>  this.resetMovementTimer();</code>
    <code>}</code>

    <p class="article">Update the cursor position at 60fps for smooth movement:</p>
    <code>setInterval(() => {</code>
    <code>  this.updateCursorPosition();</code>
    <code>}, 16); // ~60fps update rate</code>

    <h6>detecting clickable elements</h6>
    <p class="article">To trigger the slurping animation, detect when the cursor hovers over interactive elements:</p>
    <code>private isClickableElement(element: HTMLElement): boolean {</code>
    <code>  const clickableSelectors = [</code>
    <code>    'button', 'a', '[role="button"]',</code>
    <code>    '.icon-holder', 'input', 'textarea', 'select'</code>
    <code>  ];</code>
    <code>  return clickableSelectors.some(selector => </code>
    <code>    element.matches(selector) || element.closest(selector)</code>
    <code>  );</code>
    <code>}</code>

    <h6>hiding the system cursor (the lightweight approach)</h6>
    <p class="article">The trickiest part is completely hiding the default cursor. Initially, I tried aggressive JavaScript approaches with intervals and MutationObservers, but that was overkill. The solution? A lightweight CSS-based approach using a transparent SVG cursor.</p>

    <p class="article"><strong>The transparent cursor trick</strong></p>
    <p class="article">Instead of cursor: none (which some browsers override for accessibility), use a 1x1 transparent SVG as the cursor:</p>
    <code>cursor: url('data:image/svg+xml;utf8,&lt;svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"&gt;&lt;rect width="1" height="1" fill="transparent"/&gt;&lt;/svg&gt;') 0 0, none !important;</code>

    <p class="article"><strong>Global CSS application</strong></p>
    <p class="article">Apply this to all elements in your index.html using CSS cascade:</p>
    <code>*, *::before, *::after { cursor: url(...) !important; }</code>
    <code>*:hover, *:focus, *:active { cursor: url(...) !important; }</code>

    <p class="article"><strong>Lightweight JavaScript backup</strong></p>
    <p class="article">Add a small script that only runs on page load (not continuously):</p>
    <code>function hideCursor() {</code>
    <code>  document.documentElement.style.cursor = transparentCursor;</code>
    <code>  document.body.style.cursor = transparentCursor;</code>
    <code>}</code>
    <code>window.addEventListener('load', hideCursor);</code>

    <blockquote>
      The key insight: Let CSS cascade do the heavy lifting instead of JavaScript intervals. Set the cursor on root elements and use !important to cascade down.
    </blockquote>

    <h6>mobile responsiveness</h6>
    <p class="article">Custom cursors don't make sense on mobile devices. Hide the custom cursor and restore normal behavior on smaller screens:</p>
    <code>@media (max-width: 768px) {</code>
    <code>  .custom-cursor { display: none !important; }</code>
    <code>  html, body, * { cursor: auto !important; }</code>
    <code>}</code>

    <h6>performance considerations</h6>
    <p class="article">A few tips to keep the custom cursor performant:</p>
    <ul>
      <li><strong>CSS over JavaScript:</strong> Use CSS cascade with !important instead of JavaScript intervals for cursor hiding</li>
      <li><strong>Use fixed positioning:</strong> Position the cursor as fixed with high z-index (9999) to ensure it's always on top</li>
      <li><strong>Disable pointer events:</strong> Set pointer-events: none on the cursor element so it doesn't interfere with clicks</li>
      <li><strong>Optimize animations:</strong> Use steps(1) animation for sprite-based animations instead of smooth transitions</li>
      <li><strong>Update at 60fps:</strong> Match browser refresh rate for smooth tracking</li>
    </ul>

    <h6>frame management</h6>
    <p class="article">Each animation state has a different number of frames. Reset the frame counter when switching between states to avoid jarring transitions:</p>
    <code>// Reset frame if switching between different animation states</code>
    <code>if (wasOverClickable !== this.isOverClickable) {</code>
    <code>  this.currentFrame = 1;</code>
    <code>}</code>

    <h6>the final touch</h6>
    <p class="article">Handle edge cases for a polished experience:</p>
    <ul>
      <li>Hide cursor when mouse leaves the page (mouseenter/mouseleave events)</li>
      <li>Show cursor immediately when mouse moves</li>
      <li>Clean up intervals and timers in ngOnDestroy to prevent memory leaks</li>
    </ul>

    <blockquote>
      Pro tip: The transparent SVG cursor trick works where cursor: none fails. It's the secret to reliable cross-browser cursor hiding without performance-heavy JavaScript.
    </blockquote>

    <h6>key takeaways</h6>
    <p class="highlight">Building a custom cursor requires careful attention to state management, animation timing, and smart cursor suppression. The result is a delightful UX detail that adds personality to your application.</p>

    <p class="article">The three core principles:</p>
    <ol>
      <li><strong>State-driven animations:</strong> Different animations for different interaction states</li>
      <li><strong>Lightweight cursor hiding:</strong> CSS cascade with transparent SVG instead of JavaScript intervals</li>
      <li><strong>Performance optimization:</strong> 60fps updates with minimal overhead</li>
    </ol>

    <br />
  `,
};

