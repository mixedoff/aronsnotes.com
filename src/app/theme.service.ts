import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  constructor() {}

  getTopNavStyles(
    sourceScreen: 'booknotes' | 'notes' | 'main-menu' | 'character' | 'personal'
  ): string {
    switch (sourceScreen) {
      case 'booknotes':
        return (
          '--nav-color: rgba(111, 250, 30, 0.5);' +
          '--nav-bg: #091522;' +
          '--nav-notes-color: rgba(111, 250, 30, 0.5);' +
          '--nav-notes-bg: #091522;' +
          '--nav-reads-color: #6ffa1e;' +
          '--nav-reads-bg: #091522;' +
          '--nav-connect-color: rgba(111, 250, 30, 0.5);' +
          '--nav-connect-bg: #091522;' +
          '--nav-quests-color: rgba(111, 250, 30, 0.5);' +
          '--nav-quests-bg: #091522;' +
          '--nav-menu-color: rgba(111, 250, 30, 0.5);' +
          '--nav-menu-bg: #091522;' +
          '--nav-quit-color: rgba(111, 250, 30, 0.5);' +
          '--nav-quit-bg: #091522;' +
          '--font-weight: 400;'
        );
      case 'notes':
        return (
          '--nav-color: rgba(111, 250, 30, 0.5);' +
          '--nav-bg: #091522;' +
          '--nav-notes-color: #6ffa1e;' +
          '--nav-notes-bg: #091522;' +
          '--nav-reads-color: rgba(111, 250, 30, 0.5);' +
          '--nav-reads-bg: #091522;' +
          '--nav-connect-color: rgba(111, 250, 30, 0.5);' +
          '--nav-connect-bg: #091522;' +
          '--nav-quests-color: rgba(111, 250, 30, 0.5);' +
          '--nav-quests-bg: #091522;' +
          '--nav-menu-color: rgba(111, 250, 30, 0.5);' +
          '--nav-menu-bg: #091522;' +
          '--nav-quit-color: rgba(111, 250, 30, 0.5);' +
          '--nav-quit-bg: #091522;' +
          '--font-weight: 400;'
        );
      case 'main-menu':
        return (
          '--nav-color: #000000;' +
          '--nav-bg: #c6c8c8;' +
          '--nav-notes-color: #000000;' +
          '--nav-notes-bg: #c6c8c8;' +
          '--nav-reads-color: #000000;' +
          '--nav-reads-bg: #c6c8c8;' +
          '--nav-connect-color: #000000;' +
          '--nav-connect-bg: #c6c8c8;' +
          '--nav-quests-color: #000000;' +
          '--nav-quests-bg: #c6c8c8;' +
          '--nav-menu-color: #ffffff;' +
          '--nav-menu-bg: #6f7a83;' +
          '--nav-quit-color: #000000;' +
          '--nav-quit-bg: #c6c8c8;' +
          '--font-weight: 500;'
        );
      case 'character':
        return (
          '--nav-color: #f2f2f2;' +
          '--nav-bg: #091522;' +
          '--nav-notes-color: #ffffff;' +
          '--nav-notes-bg: #091522;' +
          '--nav-reads-color: #6ffa1e;' +
          '--nav-reads-bg: #091522;' +
          '--nav-connect-color: #ffffff;' +
          '--nav-connect-bg: #091522;' +
          '--nav-quests-color: #ffffff;' +
          '--nav-quests-bg: #091522;' +
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
          '--nav-notes-color: #ffffff;' +
          '--nav-notes-bg: #091522;' +
          '--nav-reads-color: #6ffa1e;' +
          '--nav-reads-bg: #091522;' +
          '--nav-connect-color: #ffffff;' +
          '--nav-connect-bg: #091522;' +
          '--nav-quests-color: #ffffff;' +
          '--nav-quests-bg: #091522;' +
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
    sourceScreen: 'booknotes' | 'notes' | 'main-menu' | 'character' | 'personal'
  ): string {
    switch (sourceScreen) {
      case 'booknotes':
        return (
          '--nav-bg: #091522;' +
          '--icon-filter: invert(1);' +
          '--nav-color: #6ffa1e;' +
          '--font-weight: 400;' +
          '--beta-bg: none;' +
          '--beta-color: transparent;'
        );
      case 'notes':
        return (
          '--nav-bg: #091522;' +
          '--icon-filter: invert(1);' +
          '--nav-color: #6ffa1e;' +
          '--font-weight: 400;' +
          '--beta-bg: none;' +
          '--beta-color: transparent;'
        );
      case 'main-menu':
        return (
          '--nav-bg: #c6c8c8;' +
          '--nav-color: #080a19;' +
          '--font-weight: 500;' +
          '--beta-bg: #6f7a83;' +
          '--beta-color: #F2F2F2;'
        );
      case 'character':
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
          '--icon-filter: invert(1);' +
          '--nav-color: #F2F2F2;' +
          '--font-weight: 400;' +
          '--beta-bg: none;' +
          '--beta-color: transparent;'
        );
      default:
        return '';
    }
  }

  getNoteContainerStyles(
    sourceScreen: 'booknotes' | 'notes' | 'main-menu' | 'character' | 'personal'
  ): string {
    switch (sourceScreen) {
      case 'booknotes':
        return (
          '--outer-container-bg: #091522;' +
          '--inner-container-bg: #091522;' +
          '--inner-container-border: rgba(111, 250, 30, 0.5);' +
          '--text-color: #6ffa1e;' +
          '--horizontal-rule-color: #6ffa1e;' +
          '--font-weight: 400;'
        );
      case 'notes':
        return (
          '--outer-container-bg: #091522;' +
          '--inner-container-bg: #091522;' +
          '--inner-container-border: rgba(111, 250, 30, 0.5);' +
          '--text-color: #6ffa1e;' +
          '--horizontal-rule-color: #6ffa1e;' +
          '--font-weight: 400;'
        );
      case 'main-menu':
        return (
          '--outer-container-bg: #c6c8c8;' +
          '--inner-container-bg: #c6c8c8;' +
          '--inner-container-border: #080a19;' +
          '--text-color: #080a19;' +
          '--horizontal-rule-color: #080a19;'
        );
      case 'character':
        return (
          '--outer-container-bg: #091522;' +
          '--inner-container-bg: #091522;' +
          '--note-title-color: #6ffa1e;' +
          '--note-text-color: #f2f2f2;' +
          '--note-link-color: #6ffa1e;' +
          '--note-link-hover-color: #ffffff;' +
          '--note-code-bg: #1e1e1e;' +
          '--note-code-color: #f2f2f2;' +
          '--note-blockquote-border: #6ffa1e;' +
          '--note-blockquote-bg: rgba(111, 250, 30, 0.1);' +
          '--note-blockquote-color: #f2f2f2;'
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

  getNotesContainerStyles(
    sourceScreen: 'booknotes' | 'notes' | 'main-menu' | 'character' | 'personal'
  ): string {
    switch (sourceScreen) {
      case 'booknotes':
        return (
          '--text-color: #f2f2f2;' +
          '--outer-container-bg: #091522;' +
          '--inner-container-bg: #091522;' +
          '--inner-container-border: #F2F2F2;' +
          '--font-weight: 400;' +
          '--note-item-hover-bg: rgba(111, 250, 30, 0.1);' +
          '--note-item-hover-color: #6ffa1e;' +
          '--note-item-hover-hr-color: #6ffa1e;'
        );
      case 'notes':
        return (
          '--text-color: #f2f2f2;' +
          '--outer-container-bg: #091522;' +
          '--inner-container-bg: #091522;' +
          '--inner-container-border: #F2F2F2;' +
          '--font-weight: 400;' +
          '--note-item-hover-bg: rgba(111, 250, 30, 0.1);' +
          '--note-item-hover-color: #6ffa1e;' +
          '--note-item-hover-hr-color: #6ffa1e;'
        );
      case 'main-menu':
        return '';
      case 'character':
        return '';
      case 'personal':
        return (
          '--text-color: #f2f2f2;' +
          '--outer-container-bg: #091522;' +
          '--inner-container-bg: #091522;' +
          '--inner-container-border: #F2F2F2;' +
          '--font-weight: 400;' +
          '--note-item-hover-bg: rgba(111, 250, 30, 0.1);' +
          '--note-item-hover-color: #6ffa1e;' +
          '--note-item-hover-hr-color: #6ffa1e;'
        );
      default:
        return '';
    }
  }
  // getNotesBackgroundStyles(
  //   sourceScreen: 'booknotes' | 'notes' | 'main-menu'
  // ): string {
  //   switch (sourceScreen) {
  //     case 'booknotes':
  //       return '--notes-background-color: #091522;';
  //     case 'notes':
  //       return '--notes-background-color: #c6c8c8;';
  //     case 'main-menu':
  //       return '';
  //   }
  // }
}
