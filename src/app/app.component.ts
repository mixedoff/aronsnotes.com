import { Component, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { StaticPageComponent } from './components/static-page/static-page.component';
import { Router } from '@angular/router';
import { LoadingScreenComponent } from './screens/loading-screen/loading-screen.component';
import { WelcomeScreenComponent } from './screens/welcome-screen/welcome-screen.component';
import { MainMenuScreenComponent } from './screens/main-menu-screen/main-menu-screen.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NoteScreenComponent } from './screens/note-screen/note-screen.component';
import { CharacterScreenComponent } from './screens/character-screen/character-screen.component';
import { Note } from './note.service';
import { QuitScreenComponent } from './screens/quit-screen/quit-screen.component';
import { HiddenScreenComponent } from './screens/hidden-screen/hidden-screen.component';
import { BooknotesScreenComponent } from './screens/booknotes-screen/booknotes-screen.component';
import { NotesScreenComponent } from './screens/notes-screen/notes-screen.component';
import { NoteService } from './note.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CustomCursorComponent } from './components/custom-cursor/custom-cursor.component';
import { BezierScreensaverComponent } from './components/bezier-screensaver/bezier-screensaver.component';
import { HireMeComponent } from './components/hire-me/hire-me.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    StaticPageComponent,
    LoadingScreenComponent,
    WelcomeScreenComponent,
    MainMenuScreenComponent,
    ReactiveFormsModule,
    NoteScreenComponent,
    CharacterScreenComponent,
    QuitScreenComponent,
    HiddenScreenComponent,
    BooknotesScreenComponent,
    NotesScreenComponent,
    RouterModule,
    CommonModule,
    CustomCursorComponent,
    BezierScreensaverComponent,
    HireMeComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title: string = 'aronsnotes';
  /** The game UI only runs in the browser; prerendering renders a static page instead */
  readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  constructor(private noteService: NoteService, private router: Router) {}

  onGrandchildInputSubmitted() {
    this.router.navigate(['/main-menu']);
  }

  onGrandchildMenuNoteClick(note: Note | undefined) {
    if (note) {
      this.router.navigateByUrl(this.noteService.noteUrl(note));
    }
  }

  onGrandchildNotesNoteClick(note: Note) {
    this.router.navigateByUrl(this.noteService.noteUrl(note));
  }

  onGrandchildBooknotesNoteClick(note: Note | undefined) {
    if (note) {
      this.router.navigateByUrl(this.noteService.noteUrl(note));
    }
  }

  onGrandchildCloseNotesClicked() {
    this.router.navigate(['/main-menu']);
  }

  onGrandchildConnectClick() {
    this.router.navigate(['/character']);
  }

  onGrandchildShiftC() {
    this.router.navigate(['/character']);
  }

  onGrandchildShiftM() {
    this.router.navigate(['/main-menu']);
  }

  onGrandchildMenuClick() {
    this.router.navigate(['/main-menu']);
  }

  onGrandchildQuitClick() {
    this.router.navigate(['/quit']);
  }

  onGrandchildMinimizeClick() {
    this.router.navigate(['/hidden']);
  }

  onGrandchildMaximizeClick() {
    this.noteService.filterNotes([
      'aronsnotes',
      'careeverz',
      'miscellaneous',
      'codingmindtech',
    ]);
    this.router.navigate(['/notes']);
  }

  onGrandchildSkipLoadingScreen() {
    this.router.navigate(['/character']);
  }

  onGoBackToSubmenu() {
    // Determine which screen to go back to based on context
    // For now, default to main-menu
    this.router.navigate(['/main-menu']);
  }

  onChildBooknotesClick() {
    this.noteService.filterNotes('books');
    this.router.navigate(['/booknotes']);
  }

  onGrandchildNotesClick() {
    this.noteService.filterNotes([
      'aronsnotes',
      'careeverz',
      'miscellaneous',
      'codingmindtech',
    ]);
    this.router.navigate(['/notes']);
  }
}
