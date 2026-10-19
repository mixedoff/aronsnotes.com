import { Component, Output, EventEmitter } from '@angular/core';
import { TopNavComponent } from '../../nav/top-nav/top-nav.component';
import { BottomNavComponent } from '../../nav/bottom-nav/bottom-nav.component';
import { NoteService } from '../../note.service';
import { CharacterHiddenAppsComponent } from '../../components/character-hidden-apps/character-hidden-apps.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hidden-screen',
  standalone: true,
  imports: [TopNavComponent, BottomNavComponent, CharacterHiddenAppsComponent],
  templateUrl: './hidden-screen.component.html',
  styleUrl: './hidden-screen.component.css',
})
export class HiddenScreenComponent {
  @Output() menuClickedOnChild = new EventEmitter<boolean>();
  @Output() booknotesClicked = new EventEmitter<boolean>();

  constructor(private noteService: NoteService, private router: Router) {}

  clickMenuOnChild() {
    this.router.navigate(['/character']);
  }

  clickBooknotesScreen() {
    this.booknotesClicked.emit(true);
  }
}
