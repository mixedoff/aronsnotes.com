import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticleContainerComponent } from '../../containers/lg-containers/article-container/article-container.component';
import { BottomNavComponent } from '../../nav/bottom-nav/bottom-nav.component';
import { ArticleTopNavComponent } from '../../nav/article-top-nav/article-top-nav.component';
import { Article, ArticleService } from '../../article.service';
import { CommonModule } from '@angular/common';
import { ArticleStateService } from '../../article.service.state';
import { ThemeService } from '../../theme.service';
import { ArticlesScreenComponent } from '../articles-screen/articles-screen.component';
import { ArticlesContainerComponent } from '../../containers/lg-containers/articles-container/articles-container.component';

@Component({
  selector: 'app-article-screen',
  standalone: true,
  imports: [
    ArticleContainerComponent,
    BottomNavComponent,
    ArticleTopNavComponent,
    CommonModule,
    ArticlesContainerComponent,
  ],
  templateUrl: './article-screen.component.html',
  styleUrl: './article-screen.component.css',
})
export class ArticleScreenComponent implements OnInit {
  @Output() ArticleClickedFromParent = new EventEmitter<Article | undefined>();
  @Output() connectClickedOnChild = new EventEmitter<boolean>();
  @Output() menuClickedOnChild = new EventEmitter<boolean>();
  @Output() shiftC = new EventEmitter<boolean>();
  @Output() shiftM = new EventEmitter<boolean>();
  @Output() goBackToSubmenu = new EventEmitter<boolean>();
  @Input() sourceScreen: 'booknotes' | 'articles' | 'main-menu' | 'about' | 'personal' =
    'articles';

  currentArticle?: Article;

  constructor(
    private articleService: ArticleService,
    private articleStateService: ArticleStateService,
    private route: ActivatedRoute,
    private router: Router,
    public themeService: ThemeService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        const articleId = parseInt(id);

        // Store the current articles array to restore it later
        const currentArticles = [...this.articleService.getArticles()];

        // Temporarily reset the filter to include all articles
        this.articleService.articles = [
          ...this.articleService.originalArticles,
        ];

        // Now try to find the article
        this.currentArticle = this.articleService.getArticleById(articleId);

        // Restore the original filtered articles
        this.articleService.articles = currentArticles;

        // Set the selected article in the state service for ArticleContainerComponent
        if (this.currentArticle) {
          // Always set sourceScreen to 'articles' to stay on practice page
          this.sourceScreen = 'articles';

          console.log(
            'Article screen loaded with article:',
            this.currentArticle
          );
          console.log('Source screen set to:', this.sourceScreen);

          this.articleStateService.setSelectedArticle(this.currentArticle);
          this.articleStateService.setShowArticleContent(true);
          this.ArticleClickedFromParent.emit(this.currentArticle);
        }
      }
    });
  }

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
    this.router.navigate(['/articles']);
  }

  onGoBackToSubmenu() {
    this.goBackToSubmenu.emit(true);
    console.log('goBackToSubmenu emitted');
    this.router.navigate(['/main-menu']);
  }

  onGoBackToBooknotes() {
    this.router.navigate(['/theory']);
  }

  onGoBackToArticles() {
    this.router.navigate(['/practice']);
  }

  handleGoBack(sourceScreen: string) {
    console.log('handleGoBack called with sourceScreen:', sourceScreen);

    // Always navigate back to practice page regardless of sourceScreen
    this.onGoBackToArticles();
  }

  onOverlayClick(event: MouseEvent) {
    // Close article when clicking on the background (not the article container)
    if (event.target === event.currentTarget) {
      this.onGoBackToArticles();
    }
  }
}
