import { Component, EventEmitter, Output } from '@angular/core';
import { LabelContainerComponent } from '../../containers/lg-containers/label-container/label-container.component';
import { LevelContainerComponent } from '../../containers/sm-containers/level-container/level-container.component';
import { Router } from '@angular/router';

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
  constructor(private router: Router) {}
  forwardToMainMenuScreen() {
    this.skipLoadingScreenEvent.emit(true);
    this.router.navigate(['/practice']);
  }

  onChildButtonClick() {
    this.buttonClickedFromChild.emit();
    this.router.navigate(['/practice']);
  }
}
