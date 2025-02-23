import { Component, EventEmitter, Output, Input } from '@angular/core';
import { Article, ArticleService } from '../../../article.service';
import { ArticleStateService } from '../../../article.service.state';
import { OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-articles-container',
  standalone: true,
  imports: [],
  templateUrl: './articles-container.component.html',
  styleUrl: './articles-container.component.css',
})
export class ArticlesContainerComponent implements OnInit, OnDestroy {
  @Output() articleClicked = new EventEmitter<Article>();
  @Output() closeArticlesClicked = new EventEmitter<void>();
  @Input() containerTitle: string = 'notes'; // default value is 'notes'
  articles: Article[];

  constructor(
    private articleService: ArticleService,
    private articleStateService: ArticleStateService
  ) {
    this.articles = this.articleService.getArticles();
  }

  ngOnInit() {
    this.articles = this.articleService.getArticles();
  }

  selectArticle(article: Article) {
    this.articleClicked.emit(article);
    this.articleStateService.setSelectedArticle(article);
    this.articleStateService.setShowArticleContent(true);

    // Implementation for article selection
  }

  closeArticles() {
    this.closeArticlesClicked.emit();
  }

  ngOnDestroy() {
    this.articleService.filterArticles([
      'aronsnotes',
      'careeverz',
      'miscellaneous',
    ]);
  }
}
