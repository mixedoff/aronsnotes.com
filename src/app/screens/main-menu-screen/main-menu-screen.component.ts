import { Component, EventEmitter, Output } from '@angular/core';
import { TopNavComponent } from '../../nav/top-nav/top-nav.component';
import { BottomNavComponent } from '../../nav/bottom-nav/bottom-nav.component';
import { MenuContainerComponent } from '../../containers/sm-containers/menu-container/menu-container.component';
import { Note } from '../../note.service';
import { NoteTopNavComponent } from '../../nav/note-top-nav/note-top-nav.component';
import { ThemeService } from '../../theme.service';

@Component({
  selector: 'app-main-menu-screen',
  standalone: true,
  imports: [BottomNavComponent, MenuContainerComponent, NoteTopNavComponent],
  templateUrl: './main-menu-screen.component.html',
  styleUrl: './main-menu-screen.component.css',
})
export class MainMenuScreenComponent {
  @Output() NoteClickedFromChild = new EventEmitter<Note | undefined>();
  @Output() notesClickedOnChild = new EventEmitter<boolean>();
  @Output() menuClickedOnChild = new EventEmitter<boolean>();
  @Output() connectClickedOnChild = new EventEmitter<boolean>();
  @Output() quitClickedOnChild = new EventEmitter<boolean>();
  @Output() minimizeClickedOnChild = new EventEmitter<boolean>();
  @Output() maximizeClickedOnChild = new EventEmitter<boolean>();
  @Output() readsClickedOnChild = new EventEmitter<boolean>();

  constructor(public themeService: ThemeService) {}

  onChildClickNote(note: Note | undefined) {
    this.NoteClickedFromChild.emit(note);
  }

  clickNotesOnChild() {
    this.notesClickedOnChild.emit(true);
  }

  clickReadsOnChild() {
    this.readsClickedOnChild.emit(true);
  }

  clickMenuOnChild() {
    this.menuClickedOnChild.emit(true);
  }

  clickConnectOnChild() {
    this.connectClickedOnChild.emit(true);
    console.log('connectClickedOnChild emitted');
  }

  clickQuitOnChild() {
    this.quitClickedOnChild.emit(true);
    console.log('quitClickedOnChild emitted');
  }

  clickMinimizeOnChild() {
    this.minimizeClickedOnChild.emit(true);
    console.log('minimizeClickedOnChild emitted');
  }

  clickMaximizeOnChild() {
    this.maximizeClickedOnChild.emit(true);
    console.log('maximizeClickedOnChild emitted');
  }
}
