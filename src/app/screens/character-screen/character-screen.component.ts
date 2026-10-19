import { Component, EventEmitter, Output } from '@angular/core';
import { TopNavComponent } from '../../nav/top-nav/top-nav.component';
import { BottomNavComponent } from '../../nav/bottom-nav/bottom-nav.component';
import { LabelContainerComponent } from '../../containers/lg-containers/label-container/label-container.component';
import { CharacterContainerComponent } from '../../containers/lg-containers/character-container/character-container.component';
import { NoteTopNavComponent } from '../../nav/note-top-nav/note-top-nav.component';
import { CharacterHiddenAppsComponent } from "../../components/character-hidden-apps/character-hidden-apps.component";

@Component({
  selector: 'app-character-screen',
  standalone: true,
  imports: [
    BottomNavComponent,
    CharacterContainerComponent,
    NoteTopNavComponent,
    CharacterHiddenAppsComponent
],
  templateUrl: './character-screen.component.html',
  styleUrl: './character-screen.component.css',
})
export class CharacterScreenComponent {
  @Output() aPressedOnChild = new EventEmitter<boolean>();
  @Output() menuClickedOnChild = new EventEmitter<boolean>();
  @Output() connectClickedOnChild = new EventEmitter<boolean>();
  @Output() quitClickedOnChild = new EventEmitter<boolean>();
  @Output() notesClickedOnChild = new EventEmitter<boolean>();
  @Output() readsClickedOnChild = new EventEmitter<boolean>();

  clickMenuOnChild() {
    this.menuClickedOnChild.emit(true);
    console.log('menuClickedOnChild emitted');
  }

  clickConnectOnChild() {
    this.connectClickedOnChild.emit(true);
    console.log('Connect clicked');
  }

  clickQuitOnChild() {
    this.quitClickedOnChild.emit(true);
    console.log('Quit clicked');
  }

  clickNotesOnChild() {
    this.notesClickedOnChild.emit(true);
    console.log('Notes clicked');
  }

  handleAPressed() {
    this.aPressedOnChild.emit(true);
    console.log('aPressedOnChild emitted');
  }

  clickReadsOnChild() {
    this.readsClickedOnChild.emit(true);
    console.log('Reads clicked');
  }
}
