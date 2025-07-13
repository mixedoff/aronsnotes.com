import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { BottomNavComponent } from '../../nav/bottom-nav/bottom-nav.component';
import { ArticlesContainerComponent } from '../../containers/lg-containers/articles-container/articles-container.component';
import { Article } from '../../article.service';
import { ArticleTopNavComponent } from '../../nav/article-top-nav/article-top-nav.component';
import { ArticleService } from '../../article.service';
import { Router } from '@angular/router';
import { ThemeService } from '../../theme.service';
import { TopNavComponent } from "../../nav/top-nav/top-nav.component";

@Component({
  selector: 'app-personal-screen',
  standalone: true,
  imports: [
    BottomNavComponent,
    ArticlesContainerComponent,
    ArticleTopNavComponent,
    TopNavComponent
  ],
  templateUrl: './personal-screen.component.html',
  styleUrl: './personal-screen.component.css',
})
export class PersonalScreenComponent implements OnInit {
  @Output() menuClickedOnChild = new EventEmitter<boolean>();
  @Output() closeArticlesClicked = new EventEmitter<void>();
  @Output() articleClickedOnChild = new EventEmitter<Article>();
  @Output() connectClickedOnChild = new EventEmitter<boolean>();
  @Output() quitClickedOnChild = new EventEmitter<boolean>();
  @Output() readsClickedOnChild = new EventEmitter<boolean>();
  @Output() articlesClickedOnChild = new EventEmitter<boolean>();

  constructor(
    private articleService: ArticleService,
    private router: Router,
    public themeService: ThemeService
  ) {}

  ngOnInit() {
    // Ensure articles are filtered when component initializes
    console.log('PersonalScreenComponent initialized - filtering for personal');
    this.articleService.filterArticles('personal');
  }

  clickArticleOnChild(article: Article) {
    console.log('Article clicked:', article);
    // Just emit the event, the navigation is handled by ArticlesContainerComponent
    this.articleClickedOnChild.emit(article);
    // No need to navigate here as it's already done in ArticlesContainerComponent
  }

  clickMenuOnChild() {
    this.menuClickedOnChild.emit(true);
    console.log('menuClickedOnChild emitted');
  }

  clickCloseArticlesOnChild() {
    console.log('closeArticlesClicked emitted');
    this.closeArticlesClicked.emit();
  }

  clickArticlesOnChild() {
    this.articlesClickedOnChild.emit(true);
  }

  clickConnectOnChild() {
    this.connectClickedOnChild.emit(true);
  }

  clickQuitOnChild() {
    this.quitClickedOnChild.emit(true);
  }

  clickReadsOnChild() {
    this.readsClickedOnChild.emit(true);
  }

  onBottomNavPClick() {
    this.router.navigate(['/practice']);
  }
} 