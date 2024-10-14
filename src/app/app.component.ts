import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopNavComponent } from './nav/top-nav/top-nav.component';
import { BottomNavComponent } from './nav/bottom-nav/bottom-nav.component';
import { LabelContainerComponent } from './containers/lg-containers/label-container/label-container.component';
import { InfoContainerComponent } from './containers/sm-containers/info-container/info-container.component';
import { LoadingScreenComponent } from './screens/loading-screen/loading-screen.component';
import { WelcomeScreenComponent } from './screens/welcome-screen/welcome-screen.component';
import { MainMenuScreenComponent } from './screens/main-menu-screen/main-menu-screen.component';
import { SelectModeScreenComponent } from './screens/select-mode-screen/select-mode-screen.component';
import { PasswordScreenComponent } from './screens/password-screen/password-screen.component';
import { StartContainerComponent } from './containers/sm-containers/start-container/start-container.component';
import { LevelContainerComponent } from './containers/sm-containers/level-container/level-container.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ArticleContainerComponent } from './containers/lg-containers/article-container/article-container.component';
import { ArticleScreenComponent } from './screens/article-screen/article-screen.component';
import { AboutScreenComponent } from './screens/about-screen/about-screen.component';
import { Article } from './article.service';
import { QuitScreenComponent } from './screens/quit-screen/quit-screen.component';
import { ImageHolderComponent } from './image-holder/image-holder.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    TopNavComponent,
    BottomNavComponent,
    LabelContainerComponent,
    InfoContainerComponent,
    LoadingScreenComponent,
    WelcomeScreenComponent,
    MainMenuScreenComponent,
    SelectModeScreenComponent,
    PasswordScreenComponent,
    StartContainerComponent,
    LevelContainerComponent,
    ReactiveFormsModule,
    ArticleContainerComponent,
    ArticleScreenComponent,
    AboutScreenComponent,
    QuitScreenComponent,
    ImageHolderComponent,
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

  ngOnInit() {
    setTimeout(() => {
      this.showLoadingScreen = false;
      this.showWelcomeScreen = true;
    }, 4000);
  }
}
