import {
  Component,
  EventEmitter,
  HostListener,
  Output,
  Input,
} from '@angular/core';

@Component({
  selector: 'app-top-nav',
  standalone: true,
  imports: [],
  templateUrl: './top-nav.component.html',
  styleUrl: './top-nav.component.css',
})
export class TopNavComponent {
  @Output() menuClicked = new EventEmitter<boolean>();
  @Output() aPressed = new EventEmitter<boolean>();
  @Input() navTitle: string = "aron's notes";

  clickMenu() {
    this.menuClicked.emit(true);
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.code === 'a') {
      console.log('a');
      this.aPressed.emit();
    }
  }
}
