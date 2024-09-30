import { Component, Input } from '@angular/core';
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
  // @Input() selectedArticle: Article | undefined;
  // @Input() date: string | undefined = undefined;
  // @Input() folder: string | undefined = undefined;
  // @Input() title: string | undefined = undefined;
  // @Input() subtitle: string | undefined = undefined;
  // @Input() content: string | undefined = undefined;
  selectedArticle: Article | undefined = undefined;
  showArticleContent: boolean = false;
  private subscriptions: Subscription = new Subscription();

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
