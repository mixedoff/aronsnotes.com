import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingScreenComponent } from './screens/loading-screen/loading-screen.component';
import { WelcomeScreenComponent } from './screens/welcome-screen/welcome-screen.component';
import { MainMenuScreenComponent } from './screens/main-menu-screen/main-menu-screen.component';
import { SelectModeScreenComponent } from './screens/select-mode-screen/select-mode-screen.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ArticleScreenComponent } from './screens/article-screen/article-screen.component';
import { AboutScreenComponent } from './screens/about-screen/about-screen.component';
import { Article } from './article.service';
import { QuitScreenComponent } from './screens/quit-screen/quit-screen.component';
import { HiddenScreenComponent } from './screens/hidden-screen/hidden-screen.component';
import { BooknotesScreenComponent } from './screens/booknotes-screen/booknotes-screen.component';
import { ArticlesScreenComponent } from './screens/articles-screen/articles-screen.component';
import { ArticleService } from './article.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    LoadingScreenComponent,
    WelcomeScreenComponent,
    MainMenuScreenComponent,
    SelectModeScreenComponent,
    ReactiveFormsModule,
    ArticleScreenComponent,
    AboutScreenComponent,
    QuitScreenComponent,
    HiddenScreenComponent,
    BooknotesScreenComponent,
    ArticlesScreenComponent,
    RouterModule,
    CommonModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title: string = 'aronsnotes';

  constructor(private articleService: ArticleService, private router: Router) {}

  onGrandchildEnterPressed() {
    this.router.navigate(['/select-mode']);
  }

  onGrandchildButtonClick() {
    this.router.navigate(['/about']);
  }

  onGrandchildInputSubmitted() {
    this.router.navigate(['/main-menu']);
  }

  onGrandchildMenuArticleClick(article: Article | undefined) {
    if (article) {
      this.router.navigate(['/article', article.id]);
    }
  }

  onGrandchildArticlesArticleClick(article: Article) {
    this.router.navigate(['/article', article.id]);
  }

  onGrandchildBooknotesArticleClick(article: Article | undefined) {
    if (article) {
      this.router.navigate(['/article', article.id]);
    }
  }

  onGrandchildCloseArticlesClicked() {
    this.router.navigate(['/main-menu']);
  }

  onGrandchildConnectClick() {
    this.router.navigate(['/about']);
  }

  onGrandchildShiftC() {
    this.router.navigate(['/about']);
  }

  onGrandchildShiftM() {
    this.router.navigate(['/main-menu']);
  }

  onGrandchildMenuClick() {
    this.router.navigate(['/main-menu']);
  }

  onGrandchildQuitClick() {
    this.router.navigate(['/quit']);
  }

  onGrandchildMinimizeClick() {
    this.router.navigate(['/hidden']);
  }

  onGrandchildMaximizeClick() {
    this.articleService.filterArticles([
      'aronsnotes',
      'careeverz',
      'miscellaneous',
    ]);
    this.router.navigate(['/articles']);
  }

  onGrandchildSkipLoadingScreen() {
    this.router.navigate(['/about']);
  }

  onGoBackToSubmenu() {
    // Determine which screen to go back to based on context
    // For now, default to main-menu
    this.router.navigate(['/main-menu']);
  }

  onChildBooknotesClick() {
    this.articleService.filterArticles('books');
    this.router.navigate(['/booknotes']);
  }

  onGrandchildArticlesClick() {
    this.articleService.filterArticles([
      'aronsnotes',
      'careeverz',
      'miscellaneous',
    ]);
    this.router.navigate(['/articles']);
  }
}
