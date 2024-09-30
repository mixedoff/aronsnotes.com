import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [],
  templateUrl: './bottom-nav.component.html',
  styleUrl: './bottom-nav.component.css',
})
export class BottomNavComponent {
  @Output() menuClicked = new EventEmitter<boolean>();
  clickMenu() {
    this.menuClicked.emit(true);
  }
}
