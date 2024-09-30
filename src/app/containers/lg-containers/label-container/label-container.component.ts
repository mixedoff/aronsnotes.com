import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-label-container',
  standalone: true,
  imports: [],
  templateUrl: './label-container.component.html',
  styleUrl: './label-container.component.css',
})
export class LabelContainerComponent {
  @Input() message: string = '';
  @Input() content: string = '';
}
