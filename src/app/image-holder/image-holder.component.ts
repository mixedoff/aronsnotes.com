import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-image-holder',
  standalone: true,
  imports: [],
  templateUrl: './image-holder.component.html',
  styleUrl: './image-holder.component.css',
})
export class ImageHolderComponent {
  @Input() imageUrl: string = '';
}
