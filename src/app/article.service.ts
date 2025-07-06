import { Injectable } from '@angular/core';
import { article1 } from './articles/article1';
import { article2 } from './articles/article2';
import { article3 } from './articles/article3';
import { article4 } from './articles/article4';
import { article5 } from './articles/article5';
import { article6 } from './articles/article6';
import { article7 } from './articles/article7';
import { article8 } from './articles/article8';
import { article9 } from './articles/article9';
import { article10 } from './articles/article10';
import { article11 } from './articles/article11';
import { article12 } from './articles/article12';
import { article13 } from './articles/article13';
import { article14 } from './articles/article14';
import { article15 } from './articles/article15';
import { article16 } from './articles/article16';
import { article17 } from './articles/article17';
import { article18 } from './articles/article18';
import { article19 } from './articles/article19';
export interface Article {
  id: number;
  date: string;
  folder: string;
  function: string;
  title: string;
  subtitle: string;
  tags: string[];
  size: string | null;
  author: string | null;
  published: string | null;
  content: string;
}

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  public originalArticles: Article[] = [];
  articles: Article[] = [];

  constructor() {
    this.originalArticles = [
      article19,
      article18,
      article17,
      article16,
      article15,
      article14,
      article13,
      article12,
      article11,
      article10,
      article9,
      article8,
      article7,
      article6,
      article5,
      article4,
      article3,
      article2,
      article1,
    ];
    this.articles = [...this.originalArticles];
  }

  getArticles(): Article[] {
    return this.articles;
  }

  getArticleById(id: number): Article | undefined {
    return this.articles.find((article) => article.id === id);
  }

  filterArticles(folders: string | string[]) {
    // Reset to original list first
    this.articles = [...this.originalArticles];

    // If folders is an array, show articles from any of these folders
    if (Array.isArray(folders)) {
      this.articles = this.articles.filter((article) =>
        folders.includes(article.folder)
      );
    } else {
      // If folders is a single string, show articles from that folder
      this.articles = this.articles.filter(
        (article) => article.folder === folders
      );
    }
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
