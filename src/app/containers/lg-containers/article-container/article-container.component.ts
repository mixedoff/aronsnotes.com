import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Article, ArticleService } from '../../../article.service';
import { Subscription } from 'rxjs';
import { ArticleStateService } from '../../../article.service.state';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../theme.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-article-container',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './article-container.component.html',
  styleUrls: ['./article-container.component.css'],
  host: {
    '[style]': 'getContainerStyles()',
  },
})
export class ArticleContainerComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  @Output() goBack = new EventEmitter<string>();
  @ViewChild('innerContainer') innerContainer!: ElementRef<HTMLDivElement>;
  @Input() sourceScreen: 'booknotes' | 'articles' | 'main-menu' | 'about' =
    'articles';

  selectedArticle: Article | undefined = undefined;
  showArticleContent: boolean = false;
  private subscriptions: Subscription = new Subscription();

  articles: Article[];

  constructor(
    private articleService: ArticleService,
    private articleStateService: ArticleStateService,
    private router: Router,
    public themeService: ThemeService
  ) {
    this.articles = this.articleService.getArticles();
  }

  ngOnInit() {
    this.articles = this.articleService.getArticles();

    this.subscriptions.add(
      this.articleStateService.selectedArticle$.subscribe((article) => {
        console.log('ArticleContainer received article:', article);
        this.selectedArticle = article;
        this.scrollInnerContainerToTop();
      })
    );

    this.subscriptions.add(
      this.articleStateService.showArticleContent$.subscribe((show) => {
        console.log('ArticleContainer showArticleContent:', show);
        this.showArticleContent = show;
      })
    );
  }

  ngAfterViewInit() {
    // Initial scroll if needed
    this.scrollInnerContainerToTop();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  clickClose(sourceScreen?: string) {
    console.log('clickClose called with sourceScreen:', sourceScreen);
    this.goBack.emit(sourceScreen || this.sourceScreen);
    this.articleService.filterArticles([
      'aronsnotes',
      'careeverz',
      'miscellaneous',
    ]);
  }

  clickNext() {
    const currentIndex = this.articles.findIndex(
      (a) => a === this.selectedArticle
    );
    const nextArticle = this.articles[currentIndex + 1] || this.articles[0]; // Wrap to first if at end

    // Update the state service
    this.articleStateService.setSelectedArticle(nextArticle);

    // Navigate to the next article's route
    const route = this.getRouteForArticle(nextArticle);
    this.router.navigate([route]);
  }

  private getRouteForArticle(article: Article): string {
    if (article.folder === 'books') {
      return `/note/${article.id}`;
    } else if (
      article.folder === 'miscellaneous' ||
      article.folder === 'aronsnotes' ||
      article.folder === 'careeverz'
    ) {
      return `/note/${article.id}`;
    } else {
      return `/note/${article.id}`;
    }
  }

  private scrollInnerContainerToTop() {
    // Use setTimeout to ensure the view has updated with the new article
    setTimeout(() => {
      if (this.innerContainer && this.innerContainer.nativeElement) {
        this.innerContainer.nativeElement.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
        console.log('Scrolled to top');
      } else {
        console.warn('Inner container not found');
      }
    }, 0);
  }

  // Method to get the container styles based on the component's sourceScreen
  getContainerStyles(): string {
    console.log(
      'Getting container styles for sourceScreen:',
      this.sourceScreen
    );
    return this.themeService.getArticleContainerStyles(this.sourceScreen);
  }
}
