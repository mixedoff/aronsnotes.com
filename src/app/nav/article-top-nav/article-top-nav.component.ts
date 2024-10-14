import { Component, EventEmitter, HostListener, Output } from '@angular/core';

@Component({
  selector: 'app-article-top-nav',
  standalone: true,
  imports: [],
  templateUrl: './article-top-nav.component.html',
  styleUrl: './article-top-nav.component.css',
})
export class ArticleTopNavComponent {
  @Output() clickConnect = new EventEmitter<boolean>();
  @Output() clickMenu = new EventEmitter<boolean>();
  @Output() shiftC = new EventEmitter<void>();
  @Output() shiftM = new EventEmitter<void>();

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.code === 'KeyC' && event.shiftKey) {
      console.log('Shift + C');
      this.shiftC.emit();
    } else if (event.code === 'KeyM' && event.shiftKey) {
      console.log('Shift + M');
      this.shiftM.emit();
    }
  }
  onUpvote() {
    throw new Error('Method not implemented.');
  }
  onReport() {
    throw new Error('Method not implemented.');
  }
  onConnect() {
    this.clickConnect.emit(true);
    console.log('clickConnect emitted');
  }
  onMenu() {
    this.clickMenu.emit(true);
    console.log('clickConnect emitted');
  }
}
