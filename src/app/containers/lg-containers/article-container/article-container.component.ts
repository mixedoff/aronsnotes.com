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
  ComponentRef,
  ViewContainerRef,
  Injector,
  createComponent,
  EnvironmentInjector,
} from '@angular/core';
import { Article, ArticleService } from '../../../article.service';
import { Subscription } from 'rxjs';
import { ArticleStateService } from '../../../article.service.state';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../theme.service';
import { Router } from '@angular/router';
import { GameOfLifeComponent } from '../../../animations/game-of-life.component';

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
  @ViewChild('articleBodyContainer', { read: ViewContainerRef })
  articleBodyContainer!: ViewContainerRef;
  @Input() sourceScreen: 'booknotes' | 'articles' | 'main-menu' | 'about' =
    'articles';

  selectedArticle: Article | undefined = undefined;
  showArticleContent: boolean = false;
  private subscriptions: Subscription = new Subscription();
  private gameOfLifeComponentRef: ComponentRef<GameOfLifeComponent> | null =
    null;

  articles: Article[];

  constructor(
    private articleService: ArticleService,
    private articleStateService: ArticleStateService,
    private router: Router,
    public themeService: ThemeService,
    private injector: EnvironmentInjector
  ) {
    this.articles = this.articleService.getArticles();
  }

  ngOnInit() {
    this.articles = this.articleService.getArticles();

    this.subscriptions.add(
      this.articleStateService.selectedArticle$.subscribe((article) => {
        this.selectedArticle = article;
        this.scrollInnerContainerToTop();

        // Check if we need to add the Game of Life component
        if (article && 'gameOfLifeComponent' in article) {
          this.addGameOfLifeComponent();
        } else {
          this.removeGameOfLifeComponent();
        }
      })
    );

    this.subscriptions.add(
      this.articleStateService.showArticleContent$.subscribe((show) => {
        this.showArticleContent = show;
      })
    );
  }

  ngAfterViewInit() {
    // Initial scroll if needed
    this.scrollInnerContainerToTop();

    // If the selected article has the game of life, add it
    if (this.selectedArticle && 'gameOfLifeComponent' in this.selectedArticle) {
      setTimeout(() => {
        this.addGameOfLifeComponent();
      }, 0);
    }
  }

  ngOnDestroy() {
    this.removeGameOfLifeComponent();
    this.subscriptions.unsubscribe();
  }

  private addGameOfLifeComponent() {
    if (!this.articleBodyContainer) return;

    // Remove any existing component
    this.removeGameOfLifeComponent();

    // Create a new component
    setTimeout(() => {
      if (this.articleBodyContainer) {
        this.articleBodyContainer.clear();
        this.gameOfLifeComponentRef = createComponent(GameOfLifeComponent, {
          environmentInjector: this.injector,
          hostElement: document.createElement('div'),
        });

        // Configure the component
        this.gameOfLifeComponentRef.instance.width = 300;
        this.gameOfLifeComponentRef.instance.height = 300;

        // Add it to the view
        this.articleBodyContainer.insert(this.gameOfLifeComponentRef.hostView);
      }
    }, 100);
  }

  private removeGameOfLifeComponent() {
    if (this.gameOfLifeComponentRef) {
      this.gameOfLifeComponentRef.destroy();
      this.gameOfLifeComponentRef = null;
    }

    if (this.articleBodyContainer) {
      this.articleBodyContainer.clear();
    }
  }

  clickClose(sourceScreen?: string) {
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
      } else {
        console.warn('Inner container not found');
      }
    }, 0);
  }

  // Method to get the container styles based on the component's sourceScreen
  getContainerStyles(): string {
    return this.themeService.getArticleContainerStyles(this.sourceScreen);
  }
}
