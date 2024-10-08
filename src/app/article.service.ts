import { Injectable } from '@angular/core';
import { article1 } from './articles/article1';
import { article2 } from './articles/article2';
import { article3 } from './articles/article3';
import { article4 } from './articles/article4';

export interface Article {
  id: number;
  date: string;
  folder: string;
  title: string;
  subtitle: string;
  tags: string[];
  content: string;
}

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  private articles: Article[] = [article4, article3, article2, article1];

  getArticles(): Article[] {
    return this.articles;
  }

  getArticleById(id: number): Article | undefined {
    return this.articles.find((article) => article.id === id);
  }
}

// AUTOMATICALLY ADDING THE SINGLE ARTICLE FILES TO THE ARTICLE ARRAY AND IMPORT
// import { Injectable } from '@angular/core';

// export interface Article {
//   id: number;
//   title: string;
//   content: string;
// }

// @Injectable({
//   providedIn: 'root',
// })
// export class ArticleService {
//   private articles: Article[] = [];

//   constructor() {
//     this.loadArticles();
//   }

//   private async loadArticles() {
//     const articleFilesContext = require.context('./articles', false, /\.ts$/);
//     const articlePaths = articleFilesContext.keys();

//     // ERROR FOR GLOB
//     //   private async loadArticles() {
//     //     const articleFiles = import.meta.glob('./articles/*.ts');

//     for (const path in articleFiles) {
//       const module = await articleFiles[path]();
//       const articleKey = Object.keys(module)[0];
//       this.articles.push(module[articleKey] as Article);
//     }

//     // Sort articles by id
//     this.articles.sort((a, b) => a.id - b.id);
//   }

//   getArticles(): Article[] {
//     return this.articles;
//   }

//   getArticleById(id: number): Article | undefined {
//     return this.articles.find((article) => article.id === id);
//   }
// }
