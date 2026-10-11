import { Routes } from '@angular/router';
import { LoadingScreenComponent } from './screens/loading-screen/loading-screen.component';
import { WelcomeScreenComponent } from './screens/welcome-screen/welcome-screen.component';
import { MainMenuScreenComponent } from './screens/main-menu-screen/main-menu-screen.component';
import { ArticleScreenComponent } from './screens/article-screen/article-screen.component';
import { AboutScreenComponent } from './screens/about-screen/about-screen.component';
import { QuitScreenComponent } from './screens/quit-screen/quit-screen.component';
import { HiddenScreenComponent } from './screens/hidden-screen/hidden-screen.component';
import { BooknotesScreenComponent } from './screens/booknotes-screen/booknotes-screen.component';
import { ArticlesScreenComponent } from './screens/articles-screen/articles-screen.component';
import { PersonalScreenComponent } from './screens/personal-screen/personal-screen.component';

export const routes: Routes = [
  { path: '', redirectTo: 'loading', pathMatch: 'full' },
  { path: 'loading', component: LoadingScreenComponent },
  { path: 'welcome', component: WelcomeScreenComponent },
  // select mode screen was removed but might be used again in the future;
  // until then, old /select-mode links go to about
  { path: 'select-mode', redirectTo: 'about' },
  { path: 'main-menu', component: MainMenuScreenComponent },
  { path: 'theory/:view', component: BooknotesScreenComponent },
  { path: 'theory', component: BooknotesScreenComponent },
  { path: 'note/:id', component: ArticleScreenComponent },
  { path: 'practice', component: ArticlesScreenComponent },
  { path: 'note/:id', component: ArticleScreenComponent },
  { path: 'about', component: AboutScreenComponent },
  { path: 'quit', component: QuitScreenComponent },
  { path: 'hidden', component: HiddenScreenComponent },
  { path: 'creative', component: PersonalScreenComponent },
  // redirect to practice if no path is found
  { path: '**', redirectTo: 'practice' },
];
