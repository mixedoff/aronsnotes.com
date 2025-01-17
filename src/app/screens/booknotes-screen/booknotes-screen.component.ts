import { Component, EventEmitter, Output } from '@angular/core';
import { TopNavComponent } from '../../nav/top-nav/top-nav.component';
import { BottomNavComponent } from '../../nav/bottom-nav/bottom-nav.component';
import { ArticlesContainerComponent } from '../../containers/lg-containers/articles-container/articles-container.component';
import { Article } from '../../article.service';

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
  imports: [TopNavComponent, BottomNavComponent, ArticlesContainerComponent],
  templateUrl: './booknotes-screen.component.html',
  styleUrl: './booknotes-screen.component.css',
})
export class BooknotesScreenComponent {
  @Output() menuClickedOnChild = new EventEmitter<boolean>();
  @Output() closeArticlesClicked = new EventEmitter<void>();
  @Output() articleClickedOnChild = new EventEmitter<Article>();
  clickArticleOnChild(article: Article) {
    console.log('Article clicked:', article);
    this.articleClickedOnChild.emit(article);
  }

  clickMenuOnChild() {
    this.menuClickedOnChild.emit(true);
    console.log('menuClickedOnChild emitted');
  }

  clickCloseArticlesOnChild() {
    console.log('closeArticlesClicked emitted');
    this.closeArticlesClicked.emit();
  }
}
