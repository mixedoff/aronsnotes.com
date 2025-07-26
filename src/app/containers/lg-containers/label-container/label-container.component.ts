import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-label-container',
  standalone: true,
  imports: [],
  templateUrl: './label-container.component.html',
  styleUrl: './label-container.component.css',
})
export class LabelContainerComponent {
  constructor(private router: Router) {}
  @Output() skipLoadingScreenEvent = new EventEmitter<boolean>();
  skipLoadingScreen() {
    console.log('skipLoadingScreen');
    this.skipLoadingScreenEvent.emit(true);
    this.router.navigate(['/practice']);
  }
  @Input() message: string = '';
  @Input() content: string = '';
}
