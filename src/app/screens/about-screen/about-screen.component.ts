import { Component, EventEmitter, Output } from '@angular/core';
import { TopNavComponent } from '../../nav/top-nav/top-nav.component';
import { BottomNavComponent } from '../../nav/bottom-nav/bottom-nav.component';
import { LabelContainerComponent } from '../../containers/lg-containers/label-container/label-container.component';
import { AboutContainerComponent } from '../../containers/lg-containers/about-container/about-container.component';
import { ArticleTopNavComponent } from '../../nav/article-top-nav/article-top-nav.component';

@Component({
  selector: 'app-about-screen',
  standalone: true,
  imports: [
    BottomNavComponent,
    AboutContainerComponent,
    ArticleTopNavComponent,
  ],
  templateUrl: './about-screen.component.html',
  styleUrl: './about-screen.component.css',
})
export class AboutScreenComponent {
  @Output() aPressedOnChild = new EventEmitter<boolean>();
  @Output() menuClickedOnChild = new EventEmitter<boolean>();
  @Output() connectClickedOnChild = new EventEmitter<boolean>();
  @Output() quitClickedOnChild = new EventEmitter<boolean>();
  @Output() articlesClickedOnChild = new EventEmitter<boolean>();

  clickMenuOnChild() {
    this.menuClickedOnChild.emit(true);
    console.log('menuClickedOnChild emitted');
  }

  clickConnectOnChild() {
    this.connectClickedOnChild.emit(true);
    console.log('Connect clicked');
  }

  clickQuitOnChild() {
    this.quitClickedOnChild.emit(true);
    console.log('Quit clicked');
  }

  clickArticlesOnChild() {
    this.articlesClickedOnChild.emit(true);
    console.log('Articles clicked');
  }

  handleAPressed() {
    this.aPressedOnChild.emit(true);
    console.log('aPressedOnChild emitted');
  }
}
