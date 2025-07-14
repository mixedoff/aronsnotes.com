import { Component, EventEmitter, Output } from '@angular/core';
import { PasswordContainerComponent } from '../../containers/lg-containers/password-container/password-container.component';

@Component({
  selector: 'app-password-screen',
  standalone: true,
  imports: [PasswordContainerComponent],
  templateUrl: './password-screen.component.html',
  styleUrl: './password-screen.component.css',
})
export class PasswordScreenComponent {
onChildOnClose() {
throw new Error('Method not implemented.');
}
  @Output() childInputSubmitted = new EventEmitter<void>();

  onChildInputSubmitted() {
    this.childInputSubmitted.emit();
  }
}
