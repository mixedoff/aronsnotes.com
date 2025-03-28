import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { ArticleTopNavComponent } from '../../nav/article-top-nav/article-top-nav.component';
import { BottomNavComponent } from '../../nav/bottom-nav/bottom-nav.component';
import { ArticlesContainerComponent } from '../../containers/lg-containers/articles-container/articles-container.component';
import { Article } from '../../article.service';
import { ThemeService } from '../../theme.service';
import { ArticleService } from '../../article.service';

@Component({
  selector: 'app-articles-screen',
  standalone: true,
  imports: [
    ArticleTopNavComponent,
    BottomNavComponent,
    ArticlesContainerComponent,
  ],
  templateUrl: './articles-screen.component.html',
  styleUrl: './articles-screen.component.css',
})
export class ArticlesScreenComponent implements OnInit {
  @Output() articleClicked = new EventEmitter<Article>();
  @Output() closeArticlesClicked = new EventEmitter<void>();
  @Output() quitClickedOnChild = new EventEmitter<void>();
  @Output() connectClickedOnChild = new EventEmitter<void>();
  @Output() articlesClickedOnChild = new EventEmitter<void>();
  @Output() menuClickedOnChild = new EventEmitter<void>();
  @Output() readsClickedOnChild = new EventEmitter<boolean>();

  constructor(
    public themeService: ThemeService,
    private articleService: ArticleService
  ) {}

  ngOnInit() {
    // Filter articles to exclude booknotes when component initializes
    console.log(
      'ArticlesScreenComponent initialized - filtering out booknotes'
    );
    this.articleService.filterArticles([
      'aronsnotes',
      'careeverz',
      'miscellaneous',
    ]);
  }

  onArticleClicked($event: Article) {
    console.log('Article clicked:', $event);
    this.articleClicked.emit($event);
  }

  onCloseArticlesClicked() {
    this.closeArticlesClicked.emit();
  }

  clickQuitOnChild() {
    this.quitClickedOnChild.emit();
  }

  clickConnectOnChild() {
    this.connectClickedOnChild.emit();
  }

  clickArticlesOnChild() {
    this.articlesClickedOnChild.emit();
  }

  clickMenuOnChild() {
    this.menuClickedOnChild.emit();
  }

  clickReadsOnChild() {
    this.readsClickedOnChild.emit(true);
    console.log('Reads clicked');
  }
}
