import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  constructor() {}

  getTopNavStyles(
    sourceScreen: 'booknotes' | 'articles' | 'main-menu' | 'about' | 'personal'
  ): string {
    switch (sourceScreen) {
      case 'booknotes':
        return (
          '--nav-color: rgba(111, 250, 30, 0.5);' +
          '--nav-bg: #091522;' +
          '--nav-articles-color: rgba(111, 250, 30, 0.5);' +
          '--nav-articles-bg: #091522;' +
          '--nav-reads-color: #6ffa1e;' +
          '--nav-reads-bg: #091522;' +
          '--nav-connect-color: rgba(111, 250, 30, 0.5);' +
          '--nav-connect-bg: #091522;' +
          '--nav-menu-color: rgba(111, 250, 30, 0.5);' +
          '--nav-menu-bg: #091522;' +
          '--nav-quit-color: rgba(111, 250, 30, 0.5);' +
          '--nav-quit-bg: #091522;' +
          '--font-weight: 400;'
        );
      case 'articles':
        return (
          '--nav-color: white;' +
          '--nav-bg: #6f7a83;' +
          '--nav-articles-color: #000000;' +
          '--nav-articles-bg: #c6c8c8;' +
          '--nav-reads-color: #ffffff;' +
          '--nav-reads-bg: #6f7a83;' +
          '--nav-connect-color: #ffffff;' +
          '--nav-connect-bg: #6f7a83;' +
          '--nav-menu-color: #ffffff;' +
          '--nav-menu-bg: #6f7a83;' +
          '--nav-quit-color: #ffffff;' +
          '--nav-quit-bg: #6f7a83;' +
          '--font-weight: 500;'
        );
      case 'main-menu':
        return (
          '--nav-color: #000000;' +
          '--nav-bg: #c6c8c8;' +
          '--nav-articles-color: #000000;' +
          '--nav-articles-bg: #c6c8c8;' +
          '--nav-reads-color: #000000;' +
          '--nav-reads-bg: #c6c8c8;' +
          '--nav-connect-color: #000000;' +
          '--nav-connect-bg: #c6c8c8;' +
          '--nav-menu-color: #ffffff;' +
          '--nav-menu-bg: #6f7a83;' +
          '--nav-quit-color: #000000;' +
          '--nav-quit-bg: #c6c8c8;' +
          '--font-weight: 500;'
        );
      case 'about':
        return (
          '--nav-color: #f2f2f2;' +
          '--nav-bg: #091522;' +
          '--nav-articles-color: #ffffff;' +
          '--nav-articles-bg: #091522;' +
          '--nav-reads-color: #6ffa1e;' +
          '--nav-reads-bg: #091522;' +
          '--nav-connect-color: #ffffff;' +
          '--nav-connect-bg: #091522;' +
          '--nav-menu-color: #ffffff;' +
          '--nav-menu-bg: #091522;' +
          '--nav-quit-color: #ffffff;' +
          '--nav-quit-bg: #091522;' +
          '--font-weight: 400;'
        );
      case 'personal':
        return (
          '--nav-color: #f2f2f2;' +
          '--nav-bg: #091522;' +
          '--nav-articles-color: #ffffff;' +
          '--nav-articles-bg: #091522;' +
          '--nav-reads-color: #6ffa1e;' +
          '--nav-reads-bg: #091522;' +
          '--nav-connect-color: #ffffff;' +
          '--nav-connect-bg: #091522;' +
          '--nav-menu-color: #ffffff;' +
          '--nav-menu-bg: #091522;' +
          '--nav-quit-color: #ffffff;' +
          '--nav-quit-bg: #091522;' +
          '--font-weight: 400;'
        );
      default:
        return '';
    }
  }

  getBottomNavStyles(
    sourceScreen: 'booknotes' | 'articles' | 'main-menu' | 'about' | 'personal'
  ): string {
    switch (sourceScreen) {
      case 'booknotes':
        return (
          '--nav-bg: #091522;' +
          '--nav-color: #6ffa1e;' +
          '--font-weight: 400;' +
          '--beta-bg: none;' +
          '--beta-color: transparent;'
        );
      case 'articles':
        return (
          '--nav-bg: #6f7a83;' +
          '--nav-color: #ffffff;' +
          '--font-weight: 500;' +
          '--beta-bg: #6f7a83;' +
          '--beta-color: #ffffff;'
        );
      case 'main-menu':
        return (
          '--nav-bg: #c6c8c8;' +
          '--nav-color: #080a19;' +
          '--font-weight: 500;' +
          '--beta-bg: #6f7a83;' +
          '--beta-color: #F2F2F2;'
        );
      case 'about':
        return (
          '--nav-bg: #c6c8c8;' +
          '--nav-color: #080a19;' +
          '--font-weight: 500;' +
          '--beta-bg: #6f7a83;' +
          '--beta-color: #F2F2F2;'
        );
      case 'personal':
        return (
          '--nav-bg: #091522;' +
          '--nav-color: #F2F2F2;' +
          '--font-weight: 400;' +
          '--beta-bg: none;' +
          '--beta-color: transparent;'
        );
      default:
        return '';
    }
  }

  getArticleContainerStyles(
    sourceScreen: 'booknotes' | 'articles' | 'main-menu' | 'about' | 'personal'
  ): string {
    switch (sourceScreen) {
      case 'booknotes':
        return (
          '--outer-container-bg: #091522;' +
          '--inner-container-bg: #091522;' +
          '--inner-container-border: #F2F2F2;' +
          '--text-color: #F2F2F2;' +
          '--horizontal-rule-color: #F2F2F2;' +
          '--font-weight: 400;'
        );
      case 'articles':
        return (
          '--outer-container-bg: #c6c8c8;' +
          '--inner-container-bg: #c6c8c8;' +
          '--inner-container-border: #080a19;' +
          '--text-color: #080a19;' +
          '--horizontal-rule-color: #080a19;'
        );
      case 'main-menu':
        return (
          '--outer-container-bg: #c6c8c8;' +
          '--inner-container-bg: #c6c8c8;' +
          '--inner-container-border: #080a19;' +
          '--text-color: #080a19;' +
          '--horizontal-rule-color: #080a19;'
        );
      case 'about':
        return (
          '--outer-container-bg: #091522;' +
          '--inner-container-bg: #091522;' +
          '--article-title-color: #6ffa1e;' +
          '--article-text-color: #f2f2f2;' +
          '--article-link-color: #6ffa1e;' +
          '--article-link-hover-color: #ffffff;' +
          '--article-code-bg: #1e1e1e;' +
          '--article-code-color: #f2f2f2;' +
          '--article-blockquote-border: #6ffa1e;' +
          '--article-blockquote-bg: rgba(111, 250, 30, 0.1);' +
          '--article-blockquote-color: #f2f2f2;'
        );
      case 'personal':
        return (
          '--outer-container-bg: #091522;' +
          '--inner-container-bg: #091522;' +
          '--inner-container-border: #F2F2F2;' +
          '--text-color: #F2F2F2;' +
          '--horizontal-rule-color: #F2F2F2;' +
          '--font-weight: 400;'
        );
      default:
        return '';
    }
  }

  getArticlesContainerStyles(
    sourceScreen: 'booknotes' | 'articles' | 'main-menu' | 'about' | 'personal'
  ): string {
    switch (sourceScreen) {
      case 'booknotes':
        return (
          '--text-color: #f2f2f2;' +
          '--outer-container-bg: #091522;' +
          '--inner-container-bg: #091522;' +
          '--inner-container-border: #F2F2F2;' +
          '--font-weight: 400;' +
          '--article-item-hover-bg: rgba(111, 250, 30, 0.1);' +
          '--article-item-hover-color: #6ffa1e;' +
          '--article-item-hover-hr-color: #6ffa1e;'
        );
      case 'articles':
        return '';
      case 'main-menu':
        return '';
      case 'about':
        return '';
      case 'personal':
        return (
          '--text-color: #f2f2f2;' +
          '--outer-container-bg: #091522;' +
          '--inner-container-bg: #091522;' +
          '--inner-container-border: #F2F2F2;' +
          '--font-weight: 400;' +
          '--article-item-hover-bg: rgba(111, 250, 30, 0.1);' +
          '--article-item-hover-color: #6ffa1e;' +
          '--article-item-hover-hr-color: #6ffa1e;'
        );
      default:
        return '';
    }
  }
  // getArticlesBackgroundStyles(
  //   sourceScreen: 'booknotes' | 'articles' | 'main-menu'
  // ): string {
  //   switch (sourceScreen) {
  //     case 'booknotes':
  //       return '--articles-background-color: #091522;';
  //     case 'articles':
  //       return '--articles-background-color: #c6c8c8;';
  //     case 'main-menu':
  //       return '';
  //   }
  // }
}
