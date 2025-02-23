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
  @Output() clickReads = new EventEmitter<boolean>();
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.code === 'KeyC') {
      console.log('KeyC');
      this.onConnect();
    } else if (event.code === 'KeyW') {
      console.log('KeyW');
      this.onMenu();
    } else if (event.code === 'KeyN') {
      console.log('KeyN');
      this.onArticles();
    } else if (event.code === 'KeyR') {
      console.log('KeyR');
      this.onReads();
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
  onReads() {
    this.clickReads.emit(true);
    console.log('Reads clicked');
  }
}
