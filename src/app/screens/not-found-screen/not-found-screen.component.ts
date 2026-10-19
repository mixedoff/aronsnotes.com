import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/** Shown for addresses that don't exist; prerendered as /404 for nginx's error page */
@Component({
  selector: 'app-not-found-screen',
  standalone: true,
  imports: [RouterLink],
  template: `
    <main class="not-found">
      <h1>404</h1>
      <p>This page doesn't exist (anymore).</p>
      <p>
        <a routerLink="/notes">read the notes</a> ·
        <a routerLink="/quests">see the quests</a> ·
        <a routerLink="/skills">open the skill tree</a>
      </p>
    </main>
  `,
  styles: `
    .not-found {
      min-height: 100dvh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 16px;
      text-align: center;
      color: #6ffa1e;
      background: #080a19;
    }
    h1 { font-size: 4rem; margin: 0; }
    a { color: #6ffa1e; }
  `,
})
export class NotFoundScreenComponent {}
