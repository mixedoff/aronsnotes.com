import { Component, EventEmitter, Output } from '@angular/core';
import { TopNavComponent } from '../../nav/top-nav/top-nav.component';
import { BottomNavComponent } from '../../nav/bottom-nav/bottom-nav.component';
import { LabelContainerComponent } from '../../containers/lg-containers/label-container/label-container.component';
import { LevelContainerComponent } from '../../containers/sm-containers/level-container/level-container.component';

@Component({
  selector: 'app-select-mode-screen',
  standalone: true,
  imports: [
    TopNavComponent,
    BottomNavComponent,
    LabelContainerComponent,
    LevelContainerComponent,
  ],
  templateUrl: './select-mode-screen.component.html',
  styleUrl: './select-mode-screen.component.css',
})
export class SelectModeScreenComponent {
  @Output() buttonClickedFromChild = new EventEmitter<void>();

  onChildButtonClick() {
    this.buttonClickedFromChild.emit();
  }
}
