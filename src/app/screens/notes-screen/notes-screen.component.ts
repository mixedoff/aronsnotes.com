import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { NoteTopNavComponent } from '../../nav/note-top-nav/note-top-nav.component';
import { BottomNavComponent } from '../../nav/bottom-nav/bottom-nav.component';
import { NotesContainerComponent } from '../../containers/lg-containers/notes-container/notes-container.component';
import { Note } from '../../note.service';
import { ThemeService } from '../../theme.service';
import { NoteService } from '../../note.service';

@Component({
  selector: 'app-notes-screen',
  standalone: true,
  imports: [
    NoteTopNavComponent,
    BottomNavComponent,
    NotesContainerComponent,
  ],
  templateUrl: './notes-screen.component.html',
  styleUrl: './notes-screen.component.css',
})
export class NotesScreenComponent implements OnInit {
  @Output() noteClicked = new EventEmitter<Note>();
  @Output() closeNotesClicked = new EventEmitter<void>();
  @Output() quitClickedOnChild = new EventEmitter<void>();
  @Output() connectClickedOnChild = new EventEmitter<void>();
  @Output() notesClickedOnChild = new EventEmitter<void>();
  @Output() menuClickedOnChild = new EventEmitter<void>();
  @Output() readsClickedOnChild = new EventEmitter<boolean>();

  constructor(
    public themeService: ThemeService,
    private noteService: NoteService
  ) {}

  ngOnInit() {
    // Filter notes to exclude booknotes when component initializes
    console.log(
      'NotesScreenComponent initialized - filtering out booknotes'
    );
    this.noteService.filterNotes([
      'aronsnotes',
      'careeverz',
      'miscellaneous',
      'codingmindtech',
    ]);
  }

  onNoteClicked($event: Note) {
    console.log('Note clicked:', $event);
    this.noteClicked.emit($event);
  }

  onCloseNotesClicked() {
    this.closeNotesClicked.emit();
  }

  clickQuitOnChild() {
    this.quitClickedOnChild.emit();
  }

  clickConnectOnChild() {
    this.connectClickedOnChild.emit();
  }

  clickNotesOnChild() {
    this.notesClickedOnChild.emit();
  }

  clickMenuOnChild() {
    this.menuClickedOnChild.emit();
  }

  clickReadsOnChild() {
    this.readsClickedOnChild.emit(true);
    console.log('Reads clicked');
  }
}
