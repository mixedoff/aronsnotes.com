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
    this.articles = [];

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
  }

  private checkRouteAndApplyFilter() {
    const currentUrl = this.router.url;
    console.log('ArticlesContainerComponent - Current URL:', currentUrl);
    
    if (currentUrl.includes('/theory')) {
      // We're on the theory/booknotes screen - show writing articles
      console.log('Filtering for writing articles...');
      this.articleService.filterArticles('writing');
    } else if (currentUrl.includes('/practice')) {
      // We're on the practice screen - show all articles
      console.log('Resetting to original articles...');
      this.articleService.resetToOriginal();
    } else if (currentUrl.includes('/creative')) {
      // We're on the creative/personal screen - show writing articles (creative writing)
      console.log('Filtering for writing articles...');
      this.articleService.filterArticles('writing');
    } else if (currentUrl.includes('/design')) {
      // We're on a design screen - show design articles
      console.log('Filtering for design articles...');
      this.articleService.filterArticles('design');
    } else if (currentUrl.includes('/note/')) {
      // We're viewing an article - keep showing all articles (stay on practice page)
      console.log('Resetting to original articles...');
      this.articleService.resetToOriginal();
    } else {
      // Default fallback - show all articles
      console.log('Default fallback - resetting to original articles...');
      this.articleService.resetToOriginal();
    }
    
    // Update the articles array after filtering
    this.articles = this.articleService.getArticles();
    console.log('ArticlesContainerComponent - Loaded articles:', this.articles.length);
  }

  selectArticle(article: Article) {
    // First, emit the event for any parent components that need it
    this.articleClicked.emit(article);

    // Set the selected article in the state service
    this.articleStateService.setSelectedArticle(article);
    this.articleStateService.setShowArticleContent(true);

    // Set flag that we're navigating to an article
    this.navigatingToArticle = true;

    // All articles use the same route structure now
    const routePath = '/note';

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
      // Reset to show all articles by default (practice screen)
      this.articleService.resetToOriginal();
    }

    // Clean up subscription
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
}
