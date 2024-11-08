import { Component, EventEmitter, Output } from '@angular/core';
import { LabelContainerComponent } from '../../containers/lg-containers/label-container/label-container.component';
import { StartContainerComponent } from '../../containers/sm-containers/start-container/start-container.component';

@Component({
  selector: 'app-welcome-screen',
  standalone: true,
  imports: [LabelContainerComponent, StartContainerComponent],
  templateUrl: './welcome-screen.component.html',
  styleUrl: './welcome-screen.component.css',
})
export class WelcomeScreenComponent {
  @Output() forwardToMainMenuScreenEvent = new EventEmitter<boolean>();
  forwardToMainMenuScreen() {
    console.log('forwardToMainMenuScreen');
    this.forwardToMainMenuScreenEvent.emit(true);
  }
  @Output() childEnterPressed = new EventEmitter<void>();
  onChildEnterPressed() {
    this.childEnterPressed.emit(); // Emit an event when Enter is pressed
  }
}
