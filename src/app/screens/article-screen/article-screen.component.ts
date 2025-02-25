import { Component, EventEmitter, Output, Input } from '@angular/core';
import { ArticleContainerComponent } from '../../containers/lg-containers/article-container/article-container.component';
import { BottomNavComponent } from '../../nav/bottom-nav/bottom-nav.component';
import { ArticleTopNavComponent } from '../../nav/article-top-nav/article-top-nav.component';
import { Article } from '../../article.service';
import { ImageHolderComponent } from '../../image-holder/image-holder.component';

@Component({
  selector: 'app-article-screen',
  standalone: true,
  imports: [ArticleContainerComponent],
  templateUrl: './article-screen.component.html',
  styleUrl: './article-screen.component.css',
})
export class ArticleScreenComponent {
  @Output() ArticleClickedFromParent = new EventEmitter<Article | undefined>();
  @Output() connectClickedOnChild = new EventEmitter<boolean>();
  @Output() menuClickedOnChild = new EventEmitter<boolean>();
  @Output() shiftC = new EventEmitter<boolean>();
  @Output() shiftM = new EventEmitter<boolean>();
  @Output() goBackToSubmenu = new EventEmitter<boolean>();
  @Input() sourceScreen: 'booknotes' | 'articles' = 'articles';

  pressedShiftCOnChild() {
    this.shiftC.emit(true);
    console.log('shiftC emitted');
  }

  pressedShiftMOnChild() {
    this.shiftM.emit(true);
    console.log('shiftM emitted');
  }

  onArticleClickedFromParent(article: Article | undefined) {
    this.ArticleClickedFromParent.emit(article);
  }
  clickConnectOnChild() {
    this.connectClickedOnChild.emit(true);
    console.log('connectClickedOnChild emitted');
  }
  clickMenuOnChild() {
    this.menuClickedOnChild.emit(true);
    console.log('menuClickedOnChild emitted');
  }

  onGoBackToSubmenu() {
    this.goBackToSubmenu.emit(true);
    console.log('goBackToSubmenu emitted');
  }
}
