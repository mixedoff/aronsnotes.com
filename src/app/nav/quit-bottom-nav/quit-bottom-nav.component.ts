import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-quit-bottom-nav',
  standalone: true,
  imports: [],
  templateUrl: './quit-bottom-nav.component.html',
  styleUrl: './quit-bottom-nav.component.css',
})
export class QuitBottomNavComponent {
  @Output() menuClicked = new EventEmitter<boolean>();
  clickMenu() {
    this.menuClicked.emit(true);
    console.log('menuClicked has been emitted');
  }
}
