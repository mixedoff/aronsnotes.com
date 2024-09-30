import { Component, EventEmitter, Output } from '@angular/core';

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
