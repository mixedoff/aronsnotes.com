import { Component, EventEmitter, Output } from '@angular/core';
import { TopNavComponent } from '../../nav/top-nav/top-nav.component';
import { BottomNavComponent } from '../../nav/bottom-nav/bottom-nav.component';
import { MenuContainerComponent } from '../../containers/sm-containers/menu-container/menu-container.component';
import { Article } from '../../article.service';

@Component({
  selector: 'app-main-menu-screen',
  standalone: true,
  imports: [TopNavComponent, BottomNavComponent, MenuContainerComponent],
  templateUrl: './main-menu-screen.component.html',
  styleUrl: './main-menu-screen.component.css',
})
export class MainMenuScreenComponent {
  @Output() ArticleClickedFromChild = new EventEmitter<Article | undefined>();
  @Output() connectClickedOnChild = new EventEmitter<boolean>();
  @Output() quitClickedOnChild = new EventEmitter<boolean>();

  onChildClickArticle(article: Article | undefined) {
    this.ArticleClickedFromChild.emit(article);
  }

  clickConnectOnChild() {
    this.connectClickedOnChild.emit(true);
    console.log('connectClickedOnChild emitted');
  }

  clickQuitOnChild() {
    this.quitClickedOnChild.emit(true);
    console.log('quitClickedOnChild emitted');
  }
}
