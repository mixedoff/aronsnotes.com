import { inject } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { NoteService } from './note.service';
import { LoadingScreenComponent } from './screens/loading-screen/loading-screen.component';
import { WelcomeScreenComponent } from './screens/welcome-screen/welcome-screen.component';
import { MainMenuScreenComponent } from './screens/main-menu-screen/main-menu-screen.component';
import { NoteScreenComponent } from './screens/note-screen/note-screen.component';
import { CharacterScreenComponent } from './screens/character-screen/character-screen.component';
import { QuitScreenComponent } from './screens/quit-screen/quit-screen.component';
import { HiddenScreenComponent } from './screens/hidden-screen/hidden-screen.component';
import { BooknotesScreenComponent } from './screens/booknotes-screen/booknotes-screen.component';
import { NotesScreenComponent } from './screens/notes-screen/notes-screen.component';
import { QuestsScreenComponent } from './screens/quests-screen/quests-screen.component';
import { PersonalScreenComponent } from './screens/personal-screen/personal-screen.component';
import { NotFoundScreenComponent } from './screens/not-found-screen/not-found-screen.component';

export const routes: Routes = [
  { path: '', redirectTo: 'loading', pathMatch: 'full' },
  { path: 'loading', component: LoadingScreenComponent },
  { path: 'welcome', component: WelcomeScreenComponent },
  // select mode screen was removed but might be used again in the future;
  // until then, old /select-mode links go to the character page
  { path: 'select-mode', redirectTo: 'character' },
  { path: 'main-menu', component: MainMenuScreenComponent },
  { path: 'skills', component: BooknotesScreenComponent },
  // the skills page used to live at /theory (with /folders, /quests and /technologies views)
  { path: 'theory', redirectTo: 'skills', pathMatch: 'full' },
  { path: 'theory/:view', redirectTo: 'skills' },
  { path: 'notes', component: NotesScreenComponent },
  { path: 'character', component: CharacterScreenComponent },
  { path: 'quests', component: QuestsScreenComponent },
  { path: 'quit', component: QuitScreenComponent },
  { path: 'hidden', component: HiddenScreenComponent },
  { path: 'creative', component: PersonalScreenComponent },
  // old addresses: /practice, /about and /note/41 still lead to the same pages
  { path: 'practice', redirectTo: 'notes' },
  // keeps the #section, so /about#connect still opens at the socials
  {
    path: 'about',
    redirectTo: ({ queryParams, fragment }) =>
      inject(Router).createUrlTree(['/character'], { queryParams, fragment: fragment ?? undefined }),
  },
  {
    path: 'note/:id',
    redirectTo: ({ params }) => {
      const note = inject(NoteService).originalNotes.find((n) => n.id === Number(params['id']));
      return note ? `/${note.slug}` : '/notes';
    },
  },
  // every note lives at its own address, e.g. /nobody-googles-anymore-right
  {
    path: ':slug',
    component: NoteScreenComponent,
    canMatch: [(_route: unknown, segments: { path: string }[]) =>
      !!inject(NoteService).getNoteBySlug(segments[0]?.path ?? '')],
  },
  // anything else doesn't exist; /404 is prerendered for nginx's error page
  { path: '404', component: NotFoundScreenComponent },
  { path: '**', component: NotFoundScreenComponent },
];
