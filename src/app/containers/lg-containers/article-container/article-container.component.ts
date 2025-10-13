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
  @Input() sourceScreen: 'booknotes' | 'articles' | 'main-menu' | 'about' | 'personal' =
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

        // Process code blocks for comment styling when article changes
        setTimeout(() => {
          this.styleCodeComments();
        }, 0);
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

    // Process code blocks to add comment styling
    this.styleCodeComments();
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
    // Only reset the filter if we're closing from the articles or main-menu screens
    // For booknotes, about, personal screens, maintain the filter
    if (this.sourceScreen === 'articles' || this.sourceScreen === 'main-menu') {
      this.articleService.resetToOriginal();
    }
  }

  clickNext() {
    const currentIndex = this.articles.findIndex(
      (a) => a === this.selectedArticle
    );
    const nextArticle = this.articles[currentIndex + 1] || this.articles[0]; // Wrap to first if at end

    // Update the state service
    this.articleStateService.setSelectedArticle(nextArticle);

    // Only navigate via router if we're on the articles screen
    // For other screens (booknotes, about, personal), stay in the overlay
    if (this.sourceScreen === 'articles' || this.sourceScreen === 'main-menu') {
      const route = this.getRouteForArticle(nextArticle);
      this.router.navigate([route]);
    }
    // For booknotes, about, personal screens, the state update above is enough
    // The article container will automatically update via the observable
  }

  private getRouteForArticle(article: Article): string {
    if (article.folder.includes('writing')) {
      return `/note/${article.id}`;
    } else if (
      article.folder.includes('development') ||
      article.folder.includes('design') ||
      article.folder.includes('miscellaneous')
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

  // Automatically style comments in code blocks
  private styleCodeComments() {
    setTimeout(() => {
      if (!this.innerContainer) return;

      const codeBlocks = this.innerContainer.nativeElement.querySelectorAll('code');
      
      codeBlocks.forEach((codeBlock) => {
        // Skip if already processed
        if (codeBlock.hasAttribute('data-comments-styled')) return;
        
        // Get the text content
        let html = codeBlock.innerHTML;
        
        // Skip if there's no # character
        if (!html.includes('#')) return;
        
        // Skip if already has span.comment (manually added)
        if (html.includes('class="comment"')) return;
        
        // Replace text after # with styled span
        // Match # and everything after it until the end of line or end of content
        html = html.replace(/(#[^<]*?)(<|$)/g, '<span class="comment">$1</span>$2');
        
        codeBlock.innerHTML = html;
        codeBlock.setAttribute('data-comments-styled', 'true');
      });
    }, 100);
  }
}
