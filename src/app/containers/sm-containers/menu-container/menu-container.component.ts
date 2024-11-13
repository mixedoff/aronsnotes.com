import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ArticleService, Article } from '../../../article.service';
import { ArticleStateService } from '../../../article.service.state';

@Component({
  selector: 'app-menu-container',
  standalone: true,
  imports: [],
  templateUrl: './menu-container.component.html',
  styleUrl: './menu-container.component.css',
})
export class MenuContainerComponent {
  @Output() showSubmenu: boolean = false;
  @Output() currentLabel: string = '';
  @Output() clickArticleScreen = new EventEmitter<boolean>();
  @Output() selectedArticle = new EventEmitter<Article | undefined>();
  @Output() showArticleContent = new EventEmitter<boolean>();
  @Output() clickConnect = new EventEmitter<boolean>();
  @Output() clickQuit = new EventEmitter<boolean>();
  // selectedArticle: Article | undefined = undefined;
  // showArticleContent: boolean = false;
  // selectedArticle: Article | undefined;

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

  openArticle(article: Article) {
    console.log(`Opening article: ${article.title}`);
    // Add your logic to open the article
    this.selectedArticle.emit(article);
    this.showArticleContent.emit(true);
    this.articleStateService.setSelectedArticle(article);
    this.articleStateService.setShowArticleContent(true);
    // this.selectedArticle = article;
    // this.showArticleContent = true;
    // this.clickArticleScreen.emit(true);
  }

  openSubmenuOverlay(label: string) {
    console.log(label);
    this.showSubmenu = true;
    this.currentLabel = label;
  }

  closeSubmenu() {
    this.showSubmenu = false;
  }
  onConnect() {
    this.clickConnect.emit(true);
    console.log('clickConnect emitted');
  }

  onQuit() {
    this.clickQuit.emit(true);
    console.log('clickQuit emitted');
  }
}
