import { Component, EventEmitter, Output } from '@angular/core';
import { Article, ArticleService } from '../../../article.service';
import { ArticleStateService } from '../../../article.service.state';

@Component({
  selector: 'app-articles-container',
  standalone: true,
  imports: [],
  templateUrl: './articles-container.component.html',
  styleUrl: './articles-container.component.css',
})
export class ArticlesContainerComponent {
  @Output() articleClicked = new EventEmitter<Article>();
  @Output() closeArticlesClicked = new EventEmitter<void>();
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
    this.articleService.filterArticles(['code', 'UX', 'UI', 'miscellaneous']);
  }
}
