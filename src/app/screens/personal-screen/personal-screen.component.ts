import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { BottomNavComponent } from '../../nav/bottom-nav/bottom-nav.component';
import { NotesContainerComponent } from '../../containers/lg-containers/notes-container/notes-container.component';
import { Note } from '../../note.service';
import { NoteTopNavComponent } from '../../nav/note-top-nav/note-top-nav.component';
import { NoteService } from '../../note.service';
import { Router } from '@angular/router';
import { ThemeService } from '../../theme.service';
import { TopNavComponent } from "../../nav/top-nav/top-nav.component";

@Component({
  selector: 'app-personal-screen',
  standalone: true,
  imports: [
    BottomNavComponent,
    NotesContainerComponent,
    NoteTopNavComponent,
    TopNavComponent
  ],
  templateUrl: './personal-screen.component.html',
  styleUrl: './personal-screen.component.css',
})
export class PersonalScreenComponent implements OnInit {
  @Output() menuClickedOnChild = new EventEmitter<boolean>();
  @Output() closeNotesClicked = new EventEmitter<void>();
  @Output() noteClickedOnChild = new EventEmitter<Note>();
  @Output() connectClickedOnChild = new EventEmitter<boolean>();
  @Output() quitClickedOnChild = new EventEmitter<boolean>();
  @Output() readsClickedOnChild = new EventEmitter<boolean>();
  @Output() notesClickedOnChild = new EventEmitter<boolean>();

  constructor(
    private noteService: NoteService,
    private router: Router,
    public themeService: ThemeService
  ) {}

  ngOnInit() {
    // Ensure notes are filtered when component initializes
    console.log('PersonalScreenComponent initialized - filtering for personal');
    this.noteService.filterNotes('personal');
  }

  clickNoteOnChild(note: Note) {
    console.log('Note clicked:', note);
    // Just emit the event, the navigation is handled by NotesContainerComponent
    this.noteClickedOnChild.emit(note);
    // No need to navigate here as it's already done in NotesContainerComponent
  }

  clickMenuOnChild() {
    this.menuClickedOnChild.emit(true);
    console.log('menuClickedOnChild emitted');
  }

  clickCloseNotesOnChild() {
    console.log('closeNotesClicked emitted');
    this.closeNotesClicked.emit();
  }

  clickNotesOnChild() {
    this.notesClickedOnChild.emit(true);
  }

  clickConnectOnChild() {
    this.connectClickedOnChild.emit(true);
  }

  clickQuitOnChild() {
    this.quitClickedOnChild.emit(true);
  }

  clickReadsOnChild() {
    this.readsClickedOnChild.emit(true);
  }

  onBottomNavPClick() {
    this.router.navigate(['/notes']);
  }
} 