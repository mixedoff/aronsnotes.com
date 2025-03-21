import { Component, EventEmitter, Output } from '@angular/core';
import { LoadingScreenComponent } from './screens/loading-screen/loading-screen.component';
import { WelcomeScreenComponent } from './screens/welcome-screen/welcome-screen.component';
import { MainMenuScreenComponent } from './screens/main-menu-screen/main-menu-screen.component';
import { SelectModeScreenComponent } from './screens/select-mode-screen/select-mode-screen.component';
import { PasswordScreenComponent } from './screens/password-screen/password-screen.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ArticleScreenComponent } from './screens/article-screen/article-screen.component';
import { AboutScreenComponent } from './screens/about-screen/about-screen.component';
import { Article } from './article.service';
import { QuitScreenComponent } from './screens/quit-screen/quit-screen.component';
import { HiddenScreenComponent } from './screens/hidden-screen/hidden-screen.component';
import { BooknotesScreenComponent } from './screens/booknotes-screen/booknotes-screen.component';
import { ArticlesScreenComponent } from './screens/articles-screen/articles-screen.component';
import { ArticleService } from './article.service';

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
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title: string = 'aronsnotes';
  showLoadingScreen: boolean = true;
  showWelcomeScreen: boolean = false;
  showSelectModeScreen: boolean = false;
  showPasswordScreen: boolean = false;
  showMainMenuScreen: boolean = false;
  showArticleScreen: boolean = false;
  showAboutScreen: boolean = false;
  showQuitScreen: boolean = false;
  showHiddenScreen: boolean = false;
  showBooknotesScreen: boolean = false;
  showArticlesScreen: boolean = false;

  @Output() ArticleClickedFromGrandchild = new EventEmitter<
    Article | undefined
  >();
  private loadingTimeout?: number;

  constructor(private articleService: ArticleService) {}

  onGrandchildEnterPressed() {
    // console.log('enter');
    this.showLoadingScreen = false; // Show select mode screen on Enter press
    this.showWelcomeScreen = false; // Show select mode screen on Enter press
    this.showSelectModeScreen = true; // Show select mode screen on Enter press
  }
  onGrandchildButtonClick() {
    console.log('Button in grandchild component was clicked');
    this.showLoadingScreen = false;
    this.showWelcomeScreen = false;
    this.showSelectModeScreen = false;
    this.showAboutScreen = true;
    // this.showMainMenuScreen = true;
    // this.showPasswordScreen = true;
  }

  onGrandchildInputSubmitted() {
    this.showPasswordScreen = false;
    this.showMainMenuScreen = true;
  }

  onGrandchildMenuArticleClick(article: Article | undefined) {
    console.log('Article clicked:', article);
    // this.articleService.setSelectedArticle(article);
    // this.articleService.setShowArticleContent(true);
    this.showArticleScreen = true;
    this.ArticleClickedFromGrandchild.emit(article);
    this.showMainMenuScreen = true;
    // ... any other handling
  }

  onGrandchildArticlesArticleClick($event: Article) {
    console.log('Article clicked:', $event);
    this.showArticleScreen = true;
    this.ArticleClickedFromGrandchild.emit($event);
    this.showMainMenuScreen = false;
  }

  onGrandchildBooknotesArticleClick(article: Article | undefined) {
    console.log('Article clicked:', article);
    // this.articleService.setSelectedArticle(article);
    // this.articleService.setShowArticleContent(true);
    this.showArticleScreen = true;
    this.ArticleClickedFromGrandchild.emit(article);
    this.showMainMenuScreen = false;
    // ... any other handling
  }

  onGrandchildCloseArticlesClicked() {
    this.showArticlesScreen = false;
    this.showMainMenuScreen = true;
    this.showBooknotesScreen = false;
  }

  // WHAT THE FUCK DID I DO HERE?
  // onGrandchildArticlesClick(article: Article | undefined) {
  //   this.showArticleScreen = true;
  //   this.ArticleClickedFromGrandchild.emit(article);
  // }

  onGrandchildConnectClick() {
    this.showMainMenuScreen = false;
    this.showArticleScreen = false;
    this.showAboutScreen = true;
    this.showArticlesScreen = false;
    this.showBooknotesScreen = false;
  }

  onGrandchildShiftC() {
    this.showMainMenuScreen = false;
    this.showArticleScreen = false;
    this.showAboutScreen = true;
  }

  onGrandchildShiftM() {
    this.showMainMenuScreen = true;
    this.showArticleScreen = false;
    this.showAboutScreen = false;
  }

  onGrandchildMenuClick() {
    this.showMainMenuScreen = true;
    this.showLoadingScreen = false;
    this.showWelcomeScreen = false;
    this.showSelectModeScreen = false;
    this.showPasswordScreen = false;
    this.showArticleScreen = false;
    this.showAboutScreen = false;
    this.showQuitScreen = false;
    this.showBooknotesScreen = false;
    this.showHiddenScreen = false;
    this.showArticlesScreen = false;
  }

  onGrandchildQuitClick() {
    this.showMainMenuScreen = false;
    this.showArticleScreen = false;
    this.showAboutScreen = false;
    this.showQuitScreen = true;
  }

  onGrandchildMinimizeClick() {
    this.showMainMenuScreen = false;
    this.showHiddenScreen = true;
  }

  onGrandchildMaximizeClick() {
    this.showMainMenuScreen = false;
    this.showArticlesScreen = true;
    this.articleService.filterArticles([
      'aronsnotes',
      'careeverz',
      'miscellaneous',
    ]);
  }

  onGrandchildSkipLoadingScreen() {
    if (this.loadingTimeout) {
      clearTimeout(this.loadingTimeout);
    }
    this.showMainMenuScreen = false;
    this.showLoadingScreen = false;
    this.showWelcomeScreen = false;
    this.showSelectModeScreen = false;
    this.showPasswordScreen = false;
    this.showArticleScreen = false;
    this.showAboutScreen = true;
    this.showQuitScreen = false;
  }

  onGoBackToSubmenu() {
    this.showArticleScreen = false;
    // this.showMainMenuScreen = true;
  }

  onChildBooknotesClick() {
    // Filter articles first
    this.articleService.filterArticles('books');
    // Then handle screen transitions
    this.showHiddenScreen = false;
    this.showBooknotesScreen = true;
    this.showAboutScreen = false;
    this.showArticlesScreen = false;
    this.showMainMenuScreen = false;
  }

  onGrandchildArticlesClick() {
    this.articleService.filterArticles([
      'aronsnotes',
      'careeverz',
      'miscellaneous',
    ]);
    this.showArticlesScreen = true;
    this.showAboutScreen = false;
    this.showMainMenuScreen = false;
    this.showBooknotesScreen = false;
  }

  ngOnInit() {
    this.loadingTimeout = window.setTimeout(() => {
      this.showLoadingScreen = false;
      this.showWelcomeScreen = true;
    }, 4000);
  }
}
