import { Component, EventEmitter, Output } from '@angular/core';
import { LabelContainerComponent } from '../../containers/lg-containers/label-container/label-container.component';
import { LevelContainerComponent } from '../../containers/sm-containers/level-container/level-container.component';

@Component({
  selector: 'app-select-mode-screen',
  standalone: true,
  imports: [LabelContainerComponent, LevelContainerComponent],
  templateUrl: './select-mode-screen.component.html',
  styleUrl: './select-mode-screen.component.css',
})
export class SelectModeScreenComponent {
  @Output() skipLoadingScreenEvent = new EventEmitter<boolean>();
  @Output() buttonClickedFromChild = new EventEmitter<void>();

  forwardToMainMenuScreen() {
    this.skipLoadingScreenEvent.emit(true);
  }

  onChildButtonClick() {
    this.buttonClickedFromChild.emit();
  }
}
