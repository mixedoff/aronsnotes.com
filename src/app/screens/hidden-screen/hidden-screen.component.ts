import { Component, Output, EventEmitter } from '@angular/core';
import { TopNavComponent } from '../../nav/top-nav/top-nav.component';
import { BottomNavComponent } from '../../nav/bottom-nav/bottom-nav.component';
import { ArticleService } from '../../article.service';

@Component({
  selector: 'app-hidden-screen',
  standalone: true,
  imports: [TopNavComponent, BottomNavComponent],
  templateUrl: './hidden-screen.component.html',
  styleUrl: './hidden-screen.component.css',
})
export class HiddenScreenComponent {
  @Output() menuClickedOnChild = new EventEmitter<boolean>();
  @Output() booknotesClicked = new EventEmitter<boolean>();

  constructor(private articleService: ArticleService) {}

  clickMenuOnChild() {
    this.menuClickedOnChild.emit(true);
    console.log('menuClickedOnChild emitted');
  }

  clickBooknotesScreen() {
    this.booknotesClicked.emit(true);
  }
}
