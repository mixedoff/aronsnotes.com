import { Injectable } from '@angular/core';
import * as Articles from './articles';
export interface Article {
  id: number;
  date: string;
  folder: string[];
  subFolder: string[];
  subSubFolder: string[];
  project: string;
  title: string;
  subtitle: string;
  technologies: string[];
  size: string | null;
  author: string | null;
  published: string | null;
  content: string;
  /** Project overview notes; reachable from project cards and the skill tree, but left out of the notes list */
  projectNote?: boolean;
  /**
   * Folder paths ([folder, subFolder?, subSubFolder?]) for a note filed in more than one place,
   * e.g. [['technology', 'seo'], ['communications', 'copywriting']]. When set, folder, subFolder and
   * subSubFolder are filled in from these on load.
   */
  paths?: string[][];
  /** Optional p5js or other visualization component to display at the top of the article */
  visualizationComponent?: any;
}

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  public originalArticles: Article[] = [];
  articles: Article[] = [];
  private currentFilter: string | string[] | null = null;

  constructor() {
    this.loadArticles();
  }

  private loadArticles() {
    try {
      console.log('ArticleService - Starting to load articles...');
      const articles: Article[] = [];
      
      // Get all article exports from the barrel file
      const articleExports = Object.values(Articles);
      
      console.log('ArticleService - Found article exports:', articleExports.length);
      
      // Process all article exports
      for (const article of articleExports) {
        if (article && typeof article === 'object' && 'id' in article) {
          articles.push(article as Article);
        }
      }

      // Notes with explicit paths get their folder lists from those paths
      articles.forEach((article) => {
        if (article.paths) {
          const level = (i: number) =>
            Array.from(new Set(article.paths!.map((path) => path[i]).filter(Boolean)));
          article.folder = level(0);
          article.subFolder = level(1);
          article.subSubFolder = level(2);
        }
      });

      // Sort articles by id in descending order (newest first)
      articles.sort((a, b) => b.id - a.id);
      
      this.originalArticles = articles;
      this.articles = [...this.originalArticles];
      console.log('ArticleService - Successfully loaded articles:', this.originalArticles.length);
    } catch (error) {
      console.error('Error loading articles:', error);
      this.originalArticles = [];
      this.articles = [];
    }
  }

  /**
   * Every folder path a note is filed under. Without explicit paths, each of the
   * note's folders is combined with each of its subfolders (and sub-subfolders).
   */
  getFolderPaths(article: Article): string[][] {
    if (article.paths) {
      return article.paths.map((path) => path.filter(Boolean));
    }
    const orEmpty = (list: string[]) => {
      const filled = list.filter(Boolean);
      return filled.length > 0 ? filled : [''];
    };
    const paths: string[][] = [];
    orEmpty(article.folder).forEach((folder) =>
      orEmpty(article.subFolder).forEach((subFolder) =>
        orEmpty(article.subSubFolder).forEach((subSubFolder) =>
          paths.push([folder, subFolder, subSubFolder].filter(Boolean))
        )
      )
    );
    return paths;
  }

  getArticles(): Article[] {
    // Ensure articles are loaded before returning
    if (this.articles.length === 0) {
      this.loadArticles();
    }
    return this.articles;
  }

  getArticleById(id: number): Article | undefined {
    // Ensure articles are loaded before searching
    if (this.articles.length === 0) {
      this.loadArticles();
    }
    return this.articles.find((article) => article.id === id);
  }

  getArticleByProject(projectId: string, projectName?: string): Article | undefined {
    // Ensure articles are loaded before searching
    if (this.articles.length === 0) {
      this.loadArticles();
    }
    
    // Search in original articles to find all matches.
    // Project notes come first, so a newer note about the same project
    // doesn't replace the project's own overview note.
    const allArticles = [...this.originalArticles].sort(
      (a, b) => Number(!!b.projectNote) - Number(!!a.projectNote)
    );
    
    // Match by project id (case-insensitive) or project name (case-insensitive, with/without .com)
    return allArticles.find((article) => {
      if (!article.project) return false;
      
      const articleProjectLower = article.project.toLowerCase().trim();
      const projectIdLower = projectId.toLowerCase();
      
      // Match by project id
      if (articleProjectLower === projectIdLower) {
        return true;
      }
      
      // Match by project name if provided
      if (projectName) {
        const projectNameLower = projectName.toLowerCase();
        const projectNameNoCom = projectNameLower.replace(/\.com$/, '');
        
        if (articleProjectLower === projectNameLower || 
            articleProjectLower === projectNameNoCom) {
          return true;
        }
      }
      
      return false;
    });
  }

  filterArticles(folders: string | string[]) {
    // Ensure articles are loaded before filtering
    if (this.articles.length === 0) {
      this.loadArticles();
    }
    
    console.log('ArticleService - Filtering articles for folders:', folders);
    console.log('ArticleService - Original articles count:', this.originalArticles.length);
    
    // Store the current filter
    this.currentFilter = folders;
    
    // Reset to original list first
    this.articles = [...this.originalArticles];

    // Convert single string to array for consistent handling
    const filterFolders = Array.isArray(folders) ? folders : [folders];

    // Filter articles that have at least one folder matching the filter
    this.articles = this.articles.filter((article) =>
      filterFolders.some(filterFolder => 
        article.folder.includes(filterFolder)
      )
    );
    
    console.log('ArticleService - Filtered articles count:', this.articles.length);
  }

  resetToOriginal() {
    this.articles = [...this.originalArticles];
    this.currentFilter = null;
  }

  getCurrentFilter(): string | string[] | null {
    return this.currentFilter;
  }

  applyCurrentFilter() {
    if (this.currentFilter) {
      this.filterArticles(this.currentFilter);
    }
  }
}

