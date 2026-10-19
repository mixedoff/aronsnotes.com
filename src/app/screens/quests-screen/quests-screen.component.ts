import { Component } from '@angular/core';
import { BottomNavComponent } from '../../nav/bottom-nav/bottom-nav.component';
import { NoteTopNavComponent } from '../../nav/note-top-nav/note-top-nav.component';
import { QuestsContainerComponent } from '../../containers/lg-containers/quests-container/quests-container.component';

@Component({
  selector: 'app-quests-screen',
  standalone: true,
  imports: [BottomNavComponent, NoteTopNavComponent, QuestsContainerComponent],
  templateUrl: './quests-screen.component.html',
  styleUrl: '../character-screen/character-screen.component.css',
})
export class QuestsScreenComponent {}
