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

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    LoadingScreenComponent,
    WelcomeScreenComponent,
    MainMenuScreenComponent,
    SelectModeScreenComponent,
    PasswordScreenComponent,
    ReactiveFormsModule,
    ArticleScreenComponent,
    AboutScreenComponent,
    QuitScreenComponent,
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
  @Output() ArticleClickedFromGrandchild = new EventEmitter<
    Article | undefined
  >();
  private loadingTimeout?: number;

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
    this.showPasswordScreen = true;
  }

  onGrandchildInputSubmitted() {
    this.showPasswordScreen = false;
    this.showMainMenuScreen = true;
  }

  onGrandchildArticleClick(article: Article | undefined) {
    this.showMainMenuScreen = false;
    this.showArticleScreen = true;
    this.ArticleClickedFromGrandchild.emit(article);
  }

  onGrandchildConnectClick() {
    this.showMainMenuScreen = false;
    this.showArticleScreen = false;
    this.showAboutScreen = true;
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
  }

  onGrandchildQuitClick() {
    this.showMainMenuScreen = false;
    this.showArticleScreen = false;
    this.showAboutScreen = false;
    this.showQuitScreen = true;
  }

  onGrandchildSkipLoadingScreen() {
    if (this.loadingTimeout) {
      clearTimeout(this.loadingTimeout);
    }
    this.showMainMenuScreen = true;
    this.showLoadingScreen = false;
    this.showWelcomeScreen = false;
    this.showSelectModeScreen = false;
    this.showPasswordScreen = false;
    this.showArticleScreen = false;
    this.showAboutScreen = false;
    this.showQuitScreen = false;
  }

  onGoBackToSubmenu() {
    this.showArticleScreen = false;
    this.showMainMenuScreen = true;
  }

  ngOnInit() {
    this.loadingTimeout = window.setTimeout(() => {
      this.showLoadingScreen = false;
      this.showWelcomeScreen = true;
    }, 4000);
  }
}
