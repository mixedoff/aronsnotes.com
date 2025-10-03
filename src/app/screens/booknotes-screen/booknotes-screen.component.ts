import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { BottomNavComponent } from '../../nav/bottom-nav/bottom-nav.component';
import { SkillTreeComponent } from '../../components/skill-tree/skill-tree.component';
import { Article } from '../../article.service';
import { ArticleTopNavComponent } from '../../nav/article-top-nav/article-top-nav.component';
import { ArticleService } from '../../article.service';
import { Router } from '@angular/router';
import { ThemeService } from '../../theme.service';
import { ArticleContainerComponent } from '../../containers/lg-containers/article-container/article-container.component';
import { ArticleStateService } from '../../article.service.state';

interface Book {
  name: string;
  title: string;
  subtitle: string;
  type: string[];
  size: string;
  date: string;
  author: string;
  published: string;
  content: string;
}

@Component({
  selector: 'app-booknotes-screen',
  standalone: true,
  imports: [
    BottomNavComponent,
    SkillTreeComponent,
    ArticleTopNavComponent,
    ArticleContainerComponent,
  ],
  templateUrl: './booknotes-screen.component.html',
  styleUrl: './booknotes-screen.component.css',
})
export class BooknotesScreenComponent implements OnInit {
  @Output() menuClickedOnChild = new EventEmitter<boolean>();
  @Output() closeArticlesClicked = new EventEmitter<void>();
  @Output() articleClickedOnChild = new EventEmitter<Article>();
  @Output() connectClickedOnChild = new EventEmitter<boolean>();
  @Output() quitClickedOnChild = new EventEmitter<boolean>();
  @Output() readsClickedOnChild = new EventEmitter<boolean>();
  @Output() articlesClickedOnChild = new EventEmitter<boolean>();

  showArticleContainer: boolean = false;

  constructor(
    private articleService: ArticleService,
    private router: Router,
    public themeService: ThemeService,
    private articleStateService: ArticleStateService
  ) {}

  ngOnInit() {
    // Ensure articles are filtered when component initializes
    console.log('BooknotesScreenComponent initialized - filtering for writing articles');
    this.articleService.filterArticles('writing');
  }

  clickArticleOnChild(article: Article) {
    console.log('Article clicked:', article);
    
    // Set the selected article in the state service
    this.articleStateService.setSelectedArticle(article);
    this.articleStateService.setShowArticleContent(true);
    
    // Show the article container
    this.showArticleContainer = true;
    
    // Also emit the event for parent components
    this.articleClickedOnChild.emit(article);
  }

  onGoBack() {
    console.log('Going back to skill tree');
    this.showArticleContainer = false;
    this.articleStateService.setShowArticleContent(false);
  }

  onOverlayClick(event: MouseEvent) {
    // Close overlay when clicking on the background (not the article container)
    if (event.target === event.currentTarget) {
      this.onGoBack();
    }
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
}
