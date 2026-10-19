import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NoteContainerComponent } from '../../containers/lg-containers/note-container/note-container.component';
import { BottomNavComponent } from '../../nav/bottom-nav/bottom-nav.component';
import { NoteTopNavComponent } from '../../nav/note-top-nav/note-top-nav.component';
import { Note, NoteService } from '../../note.service';
import { CommonModule } from '@angular/common';
import { NoteStateService } from '../../note.service.state';
import { ThemeService } from '../../theme.service';
import { NotesScreenComponent } from '../notes-screen/notes-screen.component';
import { NotesContainerComponent } from '../../containers/lg-containers/notes-container/notes-container.component';

@Component({
  selector: 'app-note-screen',
  standalone: true,
  imports: [
    NoteContainerComponent,
    BottomNavComponent,
    NoteTopNavComponent,
    CommonModule,
    NotesContainerComponent,
  ],
  templateUrl: './note-screen.component.html',
  styleUrl: './note-screen.component.css',
})
export class NoteScreenComponent implements OnInit {
  @Output() NoteClickedFromParent = new EventEmitter<Note | undefined>();
  @Output() connectClickedOnChild = new EventEmitter<boolean>();
  @Output() menuClickedOnChild = new EventEmitter<boolean>();
  @Output() shiftC = new EventEmitter<boolean>();
  @Output() shiftM = new EventEmitter<boolean>();
  @Output() goBackToSubmenu = new EventEmitter<boolean>();
  @Input() sourceScreen: 'booknotes' | 'notes' | 'main-menu' | 'character' | 'personal' =
    'notes';

  currentNote?: Note;

  constructor(
    private noteService: NoteService,
    private noteStateService: NoteStateService,
    private route: ActivatedRoute,
    private router: Router,
    public themeService: ThemeService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const slug = params.get('slug');
      if (slug) {
        this.currentNote = this.noteService.getNoteBySlug(slug);

        // Set the selected note in the state service for NoteContainerComponent
        if (this.currentNote) {
          // Always set sourceScreen to 'notes' to stay on practice page
          this.sourceScreen = 'notes';

          console.log(
            'Note screen loaded with note:',
            this.currentNote
          );
          console.log('Source screen set to:', this.sourceScreen);

          this.noteStateService.setSelectedNote(this.currentNote);
          this.noteStateService.setShowNoteContent(true);
          this.NoteClickedFromParent.emit(this.currentNote);
        }
      }
    });
  }

  pressedShiftCOnChild() {
    this.shiftC.emit(true);
    console.log('shiftC emitted');
  }

  pressedShiftMOnChild() {
    this.shiftM.emit(true);
    console.log('shiftM emitted');
  }

  onNoteClickedFromParent(note: Note | undefined) {
    this.NoteClickedFromParent.emit(note);
  }

  clickConnectOnChild() {
    this.connectClickedOnChild.emit(true);
    console.log('connectClickedOnChild emitted');
  }

  clickMenuOnChild() {
    this.menuClickedOnChild.emit(true);
    console.log('menuClickedOnChild emitted');
    this.router.navigate(['/notes']);
  }

  onGoBackToSubmenu() {
    this.goBackToSubmenu.emit(true);
    console.log('goBackToSubmenu emitted');
    this.router.navigate(['/main-menu']);
  }

  onGoBackToBooknotes() {
    this.router.navigate(['/skills']);
  }

  onGoBackToNotes() {
    this.router.navigate(['/notes']);
  }

  handleGoBack(sourceScreen: string) {
    console.log('handleGoBack called with sourceScreen:', sourceScreen);

    // Always navigate back to practice page regardless of sourceScreen
    this.onGoBackToNotes();
  }

  onOverlayClick(event: MouseEvent) {
    // Close note when clicking on the background (not the note container)
    if (event.target === event.currentTarget) {
      this.onGoBackToNotes();
    }
  }
}
