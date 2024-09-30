import { Component, EventEmitter, Output } from '@angular/core';
import { ArticleContainerComponent } from '../../containers/lg-containers/article-container/article-container.component';
import { TopNavComponent } from '../../nav/top-nav/top-nav.component';
import { BottomNavComponent } from '../../nav/bottom-nav/bottom-nav.component';
import { ArticleTopNavComponent } from '../../nav/article-top-nav/article-top-nav.component';
import { Article } from '../../article.service';
import { ImageHolderComponent } from '../../image-holder/image-holder.component';

@Component({
  selector: 'app-article-screen',
  standalone: true,
  imports: [
    ArticleContainerComponent,
    TopNavComponent,
    BottomNavComponent,
    ArticleTopNavComponent,
  ],
  templateUrl: './article-screen.component.html',
  styleUrl: './article-screen.component.css',
})
export class ArticleScreenComponent {
  @Output() ArticleClickedFromParent = new EventEmitter<Article | undefined>();
  @Output() connectClickedOnChild = new EventEmitter<boolean>();
  @Output() menuClickedOnChild = new EventEmitter<boolean>();

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
}
