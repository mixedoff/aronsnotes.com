import { Component, EventEmitter, Output, Input } from '@angular/core';
import { RouterModule, Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Article, ArticleService } from '../../../article.service';
import { ArticleStateService } from '../../../article.service.state';
import { OnInit, OnDestroy } from '@angular/core';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-articles-container',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './articles-container.component.html',
  styleUrl: './articles-container.component.css',
})
export class ArticlesContainerComponent implements OnInit, OnDestroy {
  @Input() sourceScreen: 'booknotes' | 'articles' | 'main-menu' | 'about' | 'personal' =
    'articles';
  @Output() articleClicked = new EventEmitter<Article>();
  @Output() closeArticlesClicked = new EventEmitter<void>();
  @Input() containerTitle: string = 'notes'; // default value is 'notes'
  articles: Article[];
  private navigatingToArticle = false;
  private routerSubscription: Subscription | null = null;

  constructor(
    private articleService: ArticleService,
    private articleStateService: ArticleStateService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.articles = this.articleService.getArticles();

    // Subscribe to router events to track navigation
    this.routerSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        // Check if we're navigating to an article page (note or practice)
        this.navigatingToArticle = event.url.includes('/note/');
      });
  }

  ngOnInit() {
    // Check if we're on a specific route and apply appropriate filtering
    this.checkRouteAndApplyFilter();
    
    this.articles = this.articleService.getArticles();
  }

  private checkRouteAndApplyFilter() {
    const currentUrl = this.router.url;
    
    if (currentUrl.includes('/theory')) {
      // We're on the theory/booknotes screen
      this.articleService.filterArticles('books');
    } else if (currentUrl.includes('/practice')) {
      // We're on the practice screen
      this.articleService.filterArticles([
        'aronsnotes',
        'careeverz',
        'miscellaneous',
        'codingmindtech',
      ]);
    } else if (currentUrl.includes('/creative')) {
      // We're on the creative/personal screen
      this.articleService.filterArticles('personal');
    } else if (currentUrl.includes('/note/')) {
      // We're viewing an article, check the article's folder to determine context
      const articleId = this.route.snapshot.paramMap.get('id');
      if (articleId) {
        const article = this.articleService.getArticleById(Number(articleId));
        if (article) {
          // Apply filtering based on the article's folder
          if (article.folder === 'books') {
            this.articleService.filterArticles('books');
          } else if (article.folder === 'personal') {
            this.articleService.filterArticles('personal');
          } else {
            this.articleService.filterArticles([
              'aronsnotes',
              'careeverz',
              'miscellaneous',
              'codingmindtech',
            ]);
          }
        }
      }
    }
  }

  selectArticle(article: Article) {
    // First, emit the event for any parent components that need it
    this.articleClicked.emit(article);

    // Set the selected article in the state service
    this.articleStateService.setSelectedArticle(article);
    this.articleStateService.setShowArticleContent(true);

    // Set flag that we're navigating to an article
    this.navigatingToArticle = true;

    // Determine the correct route based on the article's folder
    let routePath: string;
    if (article.folder === 'books') {
      routePath = '/note';
    } else {
      routePath = '/note';
    }

    // Navigate to the appropriate route
    this.router.navigate([routePath, article.id]);
  }

  closeArticles() {
    this.closeArticlesClicked.emit();
    this.router.navigate(['/quit']);
  }

  ngOnDestroy() {
    // Only reset the filter if we're not navigating to an article page
    if (!this.navigatingToArticle) {
      this.articleService.filterArticles([
        'aronsnotes',
        'careeverz',
        'miscellaneous',
        'codingmindtech',
      ]);
    }

    // Clean up subscription
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
}
