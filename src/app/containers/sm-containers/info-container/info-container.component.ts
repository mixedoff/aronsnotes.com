import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-info-container',
  standalone: true,
  imports: [],
  templateUrl: './info-container.component.html',
  styleUrl: './info-container.component.css',
})
export class InfoContainerComponent {
  @Input() infoText: string = '';
}
