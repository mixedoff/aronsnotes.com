import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-top-nav',
  standalone: true,
  imports: [],
  templateUrl: './top-nav.component.html',
  styleUrl: './top-nav.component.css',
})
export class TopNavComponent {
  @Output() menuClicked = new EventEmitter<boolean>();
  clickMenu() {
    this.menuClicked.emit(true);
  }
}
