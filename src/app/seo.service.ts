import { Injectable, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { NoteService } from './note.service';
import { DEFAULT_PAGE, PAGES, SITE_NAME, SITE_URL } from './data/pages.data';

/**
 * Sets the title, meta description, Open Graph tags and canonical link for every page.
 * Runs during prerendering too, so they end up in each page's static HTML.
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private router = inject(Router);
  private title = inject(Title);
  private meta = inject(Meta);
  private document = inject(DOCUMENT);
  private noteService = inject(NoteService);

  start() {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => this.update(event.urlAfterRedirects));
  }

  private update(url: string) {
    const path = url.split(/[?#]/)[0] || '/';
    const note = this.noteService.getNoteBySlug(path.slice(1));
    const page = PAGES.find((p) => p.path === path);

    if (note) {
      this.set(`${note.title} · ${SITE_NAME}`, note.subtitle, path, 'article');
    } else if (page) {
      this.set(page.title, page.description, path === '/loading' ? '/' : path, 'website');
    } else {
      this.set(DEFAULT_PAGE.title, DEFAULT_PAGE.description, '/', 'website');
    }
  }

  private set(title: string, description: string, path: string, type: 'website' | 'article') {
    const url = `${SITE_URL}${path}`;
    this.title.setTitle(title);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:type', content: type });
    this.meta.updateTag({ property: 'og:site_name', content: SITE_NAME });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary' });

    let canonical = this.document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = this.document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      this.document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);
  }
}
