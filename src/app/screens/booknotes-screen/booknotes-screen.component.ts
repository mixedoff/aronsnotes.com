import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { BottomNavComponent } from '../../nav/bottom-nav/bottom-nav.component';
import { ArticlesContainerComponent } from '../../containers/lg-containers/articles-container/articles-container.component';
import { Article } from '../../article.service';
import { ArticleTopNavComponent } from '../../nav/article-top-nav/article-top-nav.component';
import { ArticleService } from '../../article.service';

interface Book {
  name: string;
  title: string;
  subtitle: string;
  type: string[];
  size: string;
  date: string;
  author: string;
  published: string;
  content: string;
}

@Component({
  selector: 'app-booknotes-screen',
  standalone: true,
  imports: [
    BottomNavComponent,
    ArticlesContainerComponent,
    ArticleTopNavComponent,
  ],
  templateUrl: './booknotes-screen.component.html',
  styleUrl: './booknotes-screen.component.css',
})
export class BooknotesScreenComponent implements OnInit {
  @Output() menuClickedOnChild = new EventEmitter<boolean>();
  @Output() closeArticlesClicked = new EventEmitter<void>();
  @Output() articleClickedOnChild = new EventEmitter<Article>();
  @Output() connectClickedOnChild = new EventEmitter<boolean>();
  @Output() quitClickedOnChild = new EventEmitter<boolean>();
  @Output() readsClickedOnChild = new EventEmitter<boolean>();
  @Output() articlesClickedOnChild = new EventEmitter<boolean>();

  constructor(private articleService: ArticleService) {}

  ngOnInit() {
    // Ensure articles are filtered when component initializes
    this.articleService.filterArticles('books');
  }

  clickArticleOnChild(article: Article) {
    console.log('Article clicked:', article);
    this.articleClickedOnChild.emit(article);
  }

  clickMenuOnChild() {
    this.menuClickedOnChild.emit(true);
    console.log('menuClickedOnChild emitted');
  }

  clickCloseArticlesOnChild() {
    console.log('closeArticlesClicked emitted');
    this.closeArticlesClicked.emit();
  }

  clickArticlesOnChild() {
    this.articlesClickedOnChild.emit(true);
  }

  clickConnectOnChild() {
    this.connectClickedOnChild.emit(true);
  }

  clickQuitOnChild() {
    this.quitClickedOnChild.emit(true);
  }

  clickReadsOnChild() {
    this.readsClickedOnChild.emit(true);
  }
}
