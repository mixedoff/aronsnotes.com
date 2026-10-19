import { Component, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import { BottomNavComponent } from '../../nav/bottom-nav/bottom-nav.component';
import { SkillTreeComponent } from '../../components/skill-tree/skill-tree.component';
import { Note } from '../../note.service';
import { NoteTopNavComponent } from '../../nav/note-top-nav/note-top-nav.component';
import { NoteService } from '../../note.service';
import { Router } from '@angular/router';
import { ThemeService } from '../../theme.service';
import { NoteContainerComponent } from '../../containers/lg-containers/note-container/note-container.component';
import { NoteStateService } from '../../note.service.state';

interface Book {
  name: string;
  title: string;
  subtitle: string;
  type: string[];
  size: string;
  date: string;
  author: string;
  published: string;
  content: string;
}

@Component({
  selector: 'app-booknotes-screen',
  standalone: true,
  imports: [
    BottomNavComponent,
    SkillTreeComponent,
    NoteTopNavComponent,
    NoteContainerComponent,
  ],
  templateUrl: './booknotes-screen.component.html',
  styleUrl: './booknotes-screen.component.css',
})
export class BooknotesScreenComponent implements OnInit, OnDestroy {
  @Output() menuClickedOnChild = new EventEmitter<boolean>();
  @Output() closeNotesClicked = new EventEmitter<void>();
  @Output() noteClickedOnChild = new EventEmitter<Note>();
  @Output() connectClickedOnChild = new EventEmitter<boolean>();
  @Output() quitClickedOnChild = new EventEmitter<boolean>();
  @Output() readsClickedOnChild = new EventEmitter<boolean>();
  @Output() notesClickedOnChild = new EventEmitter<boolean>();

  showNoteContainer: boolean = false;

  constructor(
    private noteService: NoteService,
    private router: Router,
    public themeService: ThemeService,
    private noteStateService: NoteStateService
  ) {}

  ngOnInit() {
    // Ensure notes are filtered when component initializes
    console.log('BooknotesScreenComponent initialized - filtering for writing notes');
    this.noteService.filterNotes('content');
  }

  ngOnDestroy() {
    // Reset the note filter when leaving the booknotes screen
    console.log('BooknotesScreenComponent destroyed - resetting note filter');
    this.noteService.resetToOriginal();
  }

  clickNoteOnChild(note: Note) {
    console.log('Note clicked:', note);
    
    // Set the selected note in the state service
    this.noteStateService.setSelectedNote(note);
    this.noteStateService.setShowNoteContent(true);
    
    // Show the note container
    this.showNoteContainer = true;
    
    // Also emit the event for parent components
    this.noteClickedOnChild.emit(note);
  }

  onGoBack() {
    console.log('Going back to skill tree');
    this.showNoteContainer = false;
    this.noteStateService.setShowNoteContent(false);
  }

  onOverlayClick(event: MouseEvent) {
    // Close overlay when clicking on the background (not the note container)
    if (event.target === event.currentTarget) {
      this.onGoBack();
    }
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
}
