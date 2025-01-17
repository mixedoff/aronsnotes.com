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

@Component({
  selector: 'app-article-container',
  standalone: true,
  imports: [],
  templateUrl: './article-container.component.html',
  styleUrls: ['./article-container.component.css'],
})
export class ArticleContainerComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  @Output() goBackToSubmenu = new EventEmitter<boolean>();
  @ViewChild('innerContainer') innerContainer!: ElementRef<HTMLDivElement>;

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
        this.scrollInnerContainerToTop();
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
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  clickClose() {
    console.log('clickClose');
    this.goBackToSubmenu.emit(true);
  }

  clickNext() {
    const currentIndex = this.articles.findIndex(
      (a) => a === this.selectedArticle
    );
    const nextArticle = this.articles[currentIndex + 1] || this.articles[0]; // Wrap to first if at end
    this.articleStateService.setSelectedArticle(nextArticle);
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
}
