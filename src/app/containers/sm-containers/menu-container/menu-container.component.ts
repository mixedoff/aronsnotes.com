import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { NoteService, Note } from '../../../note.service';
import { NoteStateService } from '../../../note.service.state';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu-container',
  standalone: true,
  imports: [],
  templateUrl: './menu-container.component.html',
  styleUrl: './menu-container.component.css',
})
export class MenuContainerComponent implements OnInit {
  @Output() showSubmenu: boolean = false;
  @Output() currentLabel: string = '';
  @Output() clickNoteScreen = new EventEmitter<boolean>();
  @Output() selectedNote = new EventEmitter<Note | undefined>();
  @Output() showNoteContent = new EventEmitter<boolean>();
  @Output() clickConnect = new EventEmitter<boolean>();
  @Output() clickQuit = new EventEmitter<boolean>();
  @Output() clickMinimize = new EventEmitter<boolean>();
  @Output() clickMaximize = new EventEmitter<boolean>();
  // selectedNote: Note | undefined = undefined;
  // showNoteContent: boolean = false;
  // selectedNote: Note | undefined;

  notes: Note[];

  constructor(
    private noteService: NoteService,
    private noteStateService: NoteStateService,
    private router: Router
  ) {
    this.notes = [];
  }

  ngOnInit() {
    this.notes = this.noteService.getNotes();
    // setTimeout(() => {
    //   const element = document.querySelector('.svg-minimize');
    //   element?.classList.add('active');
    // }, 4000);
  }

  openNote(note: Note) {
    console.log(`Opening note: ${note.title}`);
    // Add your logic to open the note
    this.selectedNote.emit(note);
    this.showNoteContent.emit(true);
    this.noteStateService.setSelectedNote(note);
    this.noteStateService.setShowNoteContent(true);
    this.router.navigateByUrl(this.noteService.noteUrl(note));
    // this.selectedNote = note;
    // this.showNoteContent = true;
    // this.clickNoteScreen.emit(true);
  }

  openSubmenuOverlay(label: string) {
    console.log(label);
    this.showSubmenu = true;
    this.currentLabel = label;
  }

  closeSubmenu() {
    this.showSubmenu = false;
  }
  onConnect() {
    this.clickConnect.emit(true);
    console.log('clickConnect emitted');
  }

  onQuit() {
    this.clickQuit.emit(true);
    console.log('clickQuit emitted');
  }

  onMinimize() {
    this.clickMinimize.emit(true);
    console.log('clickMinimize emitted');
  }

  onMaximize() {
    this.clickMaximize.emit(true);
    console.log('clickMaximize emitted');
  }
}
