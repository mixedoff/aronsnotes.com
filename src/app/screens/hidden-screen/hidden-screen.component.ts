import { Component, Output, EventEmitter } from '@angular/core';
import { TopNavComponent } from '../../nav/top-nav/top-nav.component';
import { BottomNavComponent } from '../../nav/bottom-nav/bottom-nav.component';
import { ArticleService } from '../../article.service';
import { AboutHiddenAppsComponent } from '../../components/about-hidden-apps/about-hidden-apps.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hidden-screen',
  standalone: true,
  imports: [TopNavComponent, BottomNavComponent, AboutHiddenAppsComponent],
  templateUrl: './hidden-screen.component.html',
  styleUrl: './hidden-screen.component.css',
})
export class HiddenScreenComponent {
  @Output() menuClickedOnChild = new EventEmitter<boolean>();
  @Output() booknotesClicked = new EventEmitter<boolean>();

  constructor(private articleService: ArticleService, private router: Router) {}

  clickMenuOnChild() {
    this.router.navigate(['/about']);
  }

  clickBooknotesScreen() {
    this.booknotesClicked.emit(true);
  }
}
