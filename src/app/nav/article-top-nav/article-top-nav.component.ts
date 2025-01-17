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
  @Output() clickQuit = new EventEmitter<boolean>();
  @Output() clickArticles = new EventEmitter<boolean>();

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.code === 'KeyC') {
      console.log('KeyC');
      this.onConnect();
    } else if (event.code === 'KeyM') {
      console.log('KeyM');
      this.onMenu();
    } else if (event.code === 'KeyA') {
      console.log('KeyA');
      this.onArticles();
    } else if (event.code === 'KeyQ') {
      console.log('KeyQ');
      this.onQuit();
    }
  }

  onConnect() {
    this.clickConnect.emit(true);
    console.log('clickConnect emitted');
  }
  onMenu() {
    this.clickMenu.emit(true);
    console.log('clickConnect emitted');
  }
  onArticles() {
    this.clickArticles.emit(true);
    console.log('Articles clicked');
  }
  onQuit() {
    this.clickQuit.emit(true);
    console.log('Quit clicked');
  }
}
