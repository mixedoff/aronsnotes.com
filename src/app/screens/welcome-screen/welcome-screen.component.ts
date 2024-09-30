import { Component, EventEmitter, Output } from '@angular/core';
import { LabelContainerComponent } from '../../containers/lg-containers/label-container/label-container.component';
import { InfoContainerComponent } from '../../containers/sm-containers/info-container/info-container.component';
import { StartContainerComponent } from '../../containers/sm-containers/start-container/start-container.component';
import { TopNavComponent } from '../../nav/top-nav/top-nav.component';
import { BottomNavComponent } from '../../nav/bottom-nav/bottom-nav.component';

@Component({
  selector: 'app-welcome-screen',
  standalone: true,
  imports: [
    LabelContainerComponent,
    InfoContainerComponent,
    StartContainerComponent,
    TopNavComponent,
    BottomNavComponent,
  ],
  templateUrl: './welcome-screen.component.html',
  styleUrl: './welcome-screen.component.css',
})
export class WelcomeScreenComponent {
  @Output() childEnterPressed = new EventEmitter<void>();
  onChildEnterPressed() {
    this.childEnterPressed.emit(); // Emit an event when Enter is pressed
  }
}
