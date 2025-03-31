import { Component, EventEmitter, Output } from '@angular/core';
import { LabelContainerComponent } from '../../containers/lg-containers/label-container/label-container.component';
import { StartContainerComponent } from '../../containers/sm-containers/start-container/start-container.component';
import { Router } from '@angular/router';
@Component({
  selector: 'app-welcome-screen',
  standalone: true,
  imports: [LabelContainerComponent, StartContainerComponent],
  templateUrl: './welcome-screen.component.html',
  styleUrl: './welcome-screen.component.css',
})
export class WelcomeScreenComponent {
  constructor(private router: Router) {}
  @Output() forwardToMainMenuScreenEvent = new EventEmitter<boolean>();
  forwardToMainMenuScreen() {
    console.log('forwardToMainMenuScreen');
    this.forwardToMainMenuScreenEvent.emit(true);
    this.router.navigate(['/practice']);
  }
  @Output() childEnterPressed = new EventEmitter<void>();
  onChildEnterPressed() {
    this.router.navigate(['/select-mode']);
  }
}
