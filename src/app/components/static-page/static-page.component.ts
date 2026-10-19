import { Component, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router, RouterLink } from '@angular/router';
import { Note, NoteService } from '../../note.service';
import { QUESTS } from '../../data/quests.data';
import { DEFAULT_PAGE, PAGES } from '../../data/pages.data';

/**
 * A plain version of the current page, rendered only while prerendering. Search engines and
 * link previews read it; in the browser the game UI replaces it as soon as the app starts
 * (and index.html hides it until then).
 */
@Component({
  selector: 'app-static-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="static-page">
      <nav>
        <a routerLink="/">aronsnotes</a> ·
        <a routerLink="/character">character</a> ·
        <a routerLink="/quests">quests</a> ·
        <a routerLink="/skills">skills</a> ·
        <a routerLink="/notes">notes</a>
      </nav>

      @if (note; as note) {
        <article>
          <h1>{{ note.title }}</h1>
          <p>{{ note.subtitle }}</p>
          <p><time>{{ note.date }}</time> · by Aron Kovacs</p>
          <div [innerHTML]="noteContent(note)"></div>
        </article>
      } @else {
        <main>
          <h1>{{ page.title }}</h1>
          <p>{{ page.description }}</p>

          @if (path === '/character') {
            <h2>Aron Kovacs</h2>
            <p>A founder marketer of the tank class. A creative tank who charges headfirst into the unknown.</p>
            <p>
              <a href="mailto:aron.peter.kovacs@gmail.com">email</a> ·
              <a href="https://www.linkedin.com/in/aronpeterkovacs/">LinkedIn</a> ·
              <a href="https://github.com/mixedoff">GitHub</a> ·
              <a href="https://www.instagram.com/misterkovax/">Instagram</a>
            </p>
          }

          @if (path === '/quests' || path === '/character') {
            <h2>Quests</h2>
            @for (quest of quests; track quest.id) {
              <section>
                <h3>{{ quest.name }}</h3>
                <p>{{ quest.subtitle }}</p>
                <p>{{ quest.description }}</p>
                @if (quest.link && !quest.link.startsWith('mailto:')) {
                  <p><a [href]="quest.link">{{ quest.link }}</a></p>
                }
              </section>
            }
          }

          <h2>Notes</h2>
          <ul>
            @for (item of notes; track item.id) {
              <li>
                <a [routerLink]="'/' + item.slug">{{ item.title }}</a>
                <span> · {{ item.subtitle }}</span>
              </li>
            }
          </ul>
        </main>
      }
    </div>
  `,
})
export class StaticPageComponent {
  private router = inject(Router);
  private noteService = inject(NoteService);
  private sanitizer = inject(DomSanitizer);

  readonly quests = QUESTS;
  readonly notes = this.noteService.originalNotes;

  get path(): string {
    return this.router.url.split(/[?#]/)[0] || '/';
  }

  get note(): Note | undefined {
    return this.noteService.getNoteBySlug(this.path.slice(1));
  }

  get page() {
    return PAGES.find((page) => page.path === this.path) ?? DEFAULT_PAGE;
  }

  /** Note bodies are the site's own HTML, kept as written */
  noteContent(note: Note): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(note.content);
  }
}
