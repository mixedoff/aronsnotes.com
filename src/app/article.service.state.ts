import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Article } from './article.service';

@Injectable({
  providedIn: 'root',
})
export class ArticleStateService {
  private selectedArticleSubject = new BehaviorSubject<Article | undefined>(
    undefined
  );
  private showArticleContentSubject = new BehaviorSubject<boolean>(false);

  selectedArticle$: Observable<Article | undefined> =
    this.selectedArticleSubject.asObservable();
  showArticleContent$: Observable<boolean> =
    this.showArticleContentSubject.asObservable();

  setSelectedArticle(article: Article | undefined) {
    this.selectedArticleSubject.next(article);
  }

  setShowArticleContent(show: boolean) {
    this.showArticleContentSubject.next(show);
  }
}
