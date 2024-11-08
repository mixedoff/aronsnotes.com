import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-label-container',
  standalone: true,
  imports: [],
  templateUrl: './label-container.component.html',
  styleUrl: './label-container.component.css',
})
export class LabelContainerComponent {
  @Output() skipLoadingScreenEvent = new EventEmitter<boolean>();
  skipLoadingScreen() {
    console.log('skipLoadingScreen');
    this.skipLoadingScreenEvent.emit(true);
  }
  @Input() message: string = '';
  @Input() content: string = '';
}
