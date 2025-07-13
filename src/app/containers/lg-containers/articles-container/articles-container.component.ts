import { Component, EventEmitter, Output, Input } from '@angular/core';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
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
    private router: Router
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
    this.articles = this.articleService.getArticles();
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
