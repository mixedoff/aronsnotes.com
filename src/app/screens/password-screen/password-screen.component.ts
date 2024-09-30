import { Component, EventEmitter, Output } from '@angular/core';
import { TopNavComponent } from '../../nav/top-nav/top-nav.component';
import { LabelContainerComponent } from '../../containers/lg-containers/label-container/label-container.component';
import { LevelContainerComponent } from '../../containers/sm-containers/level-container/level-container.component';
import { BottomNavComponent } from '../../nav/bottom-nav/bottom-nav.component';
import { PasswordContainerComponent } from '../../containers/lg-containers/password-container/password-container.component';

@Component({
  selector: 'app-password-screen',
  standalone: true,
  imports: [
    TopNavComponent,
    LabelContainerComponent,
    LevelContainerComponent,
    BottomNavComponent,
    PasswordContainerComponent,
  ],
  templateUrl: './password-screen.component.html',
  styleUrl: './password-screen.component.css',
})
export class PasswordScreenComponent {
  @Output() childInputSubmitted = new EventEmitter<void>();

  onChildInputSubmitted() {
    this.childInputSubmitted.emit();
  }
}
