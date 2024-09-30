import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-level-container',
  standalone: true,
  imports: [],
  templateUrl: './level-container.component.html',
  styleUrl: './level-container.component.css',
})
export class LevelContainerComponent {
  @Output() buttonClicked = new EventEmitter<void>();
  onClick() {
    this.buttonClicked.emit();
  }
}
