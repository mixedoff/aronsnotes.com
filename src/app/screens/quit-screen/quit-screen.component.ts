import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatrixTypingComponent } from '../../animations/matrix-typing/matrix-typing.component';
import { BottomNavComponent } from '../../nav/bottom-nav/bottom-nav.component';
import { QuitBottomNavComponent } from '../../nav/quit-bottom-nav/quit-bottom-nav.component';

@Component({
  selector: 'app-quit-screen',
  standalone: true,
  imports: [MatrixTypingComponent, QuitBottomNavComponent],
  templateUrl: './quit-screen.component.html',
  styleUrl: './quit-screen.component.css',
})
export class QuitScreenComponent {
  @Output() menuClickedOnChild = new EventEmitter<boolean>();
  clickMenuOnChild() {
    this.menuClickedOnChild.emit(true);
    console.log('menuClickedOnChild emitted');
  }
}
