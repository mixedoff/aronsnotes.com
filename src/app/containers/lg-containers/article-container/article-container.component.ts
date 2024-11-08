import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Article, ArticleService } from '../../../article.service';
import { Subscription } from 'rxjs';
import { ArticleStateService } from '../../../article.service.state';
import { ImageHolderComponent } from '../../../image-holder/image-holder.component';

@Component({
  selector: 'app-article-container',
  standalone: true,
  imports: [],
  templateUrl: './article-container.component.html',
  styleUrl: './article-container.component.css',
})
export class ArticleContainerComponent {
  @Output() closeClicked = new EventEmitter<boolean>();

  selectedArticle: Article | undefined = undefined;
  showArticleContent: boolean = false;
  private subscriptions: Subscription = new Subscription();

  clickClose() {
    // this.articleStateService.setShowArticleContent(false);
    console.log('clickClose');
    this.closeClicked.emit(true);
  }

  articles: Article[];

  constructor(
    private articleService: ArticleService,
    private articleStateService: ArticleStateService
  ) {
    this.articles = this.articleService.getArticles();
  }

  ngOnInit() {
    this.articles = this.articleService.getArticles();

    this.subscriptions.add(
      this.articleStateService.selectedArticle$.subscribe((article) => {
        this.selectedArticle = article;
      })
    );

    this.subscriptions.add(
      this.articleStateService.showArticleContent$.subscribe((show) => {
        this.showArticleContent = show;
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
