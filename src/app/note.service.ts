import { Injectable } from '@angular/core';
import * as Notes from './notes';
export interface Note {
  id: number;
  date: string;
  folder: string[];
  subFolder: string[];
  subSubFolder: string[];
  quest: string;
  title: string;
  subtitle: string;
  technologies: string[];
  size: string | null;
  author: string | null;
  published: string | null;
  content: string;
  /**
   * Folder paths ([folder, subFolder?, subSubFolder?]) for a note filed in more than one place,
   * e.g. [['growth', 'seo'], ['content', 'copywriting']]. When set, folder, subFolder and
   * subSubFolder are filled in from these on load. Paths can go deeper than subSubFolder;
   * the skills page shows every level.
   */
  paths?: string[][];
  /** Optional p5js or other visualization component to display at the top of the note */
  visualizationComponent?: any;
  /**
   * The note's address, e.g. 'nobody-googles-anymore-right' for aronsnotes.com/nobody-googles-anymore-right.
   * Made from the title on load; set it only to pin an address that shouldn't change with the title.
   */
  slug?: string;
}

/** 'nobody googles anymore. right?' -> 'nobody-googles-anymore-right' */
export function slugify(title: string): string {
  return title
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '') // accents
    .toLowerCase()
    .replace(/['’]/g, '') // let's -> lets
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

@Injectable({
  providedIn: 'root',
})
export class NoteService {
  public originalNotes: Note[] = [];
  notes: Note[] = [];
  private currentFilter: string | string[] | null = null;

  constructor() {
    this.loadNotes();
  }

  private loadNotes() {
    try {
      console.log('NoteService - Starting to load notes...');
      const notes: Note[] = [];
      
      // Get all note exports from the barrel file
      const noteExports = Object.values(Notes);
      
      console.log('NoteService - Found note exports:', noteExports.length);
      
      // Process all note exports
      for (const note of noteExports) {
        if (note && typeof note === 'object' && 'id' in note) {
          notes.push(note as Note);
        }
      }

      // Notes with explicit paths get their folder lists from those paths
      notes.forEach((note) => {
        if (note.paths) {
          const level = (i: number) =>
            Array.from(new Set(note.paths!.map((path) => path[i]).filter(Boolean)));
          note.folder = level(0);
          note.subFolder = level(1);
          note.subSubFolder = level(2);
        }
      });

      // Sort notes by id in descending order (newest first)
      notes.sort((a, b) => b.id - a.id);

      // Every note gets its own address; older notes keep theirs if a newer one has the same title
      const taken = new Set<string>();
      [...notes].reverse().forEach((note) => {
        const base = note.slug || slugify(note.title) || `note-${note.id}`;
        let slug = base;
        for (let n = 2; taken.has(slug); n++) slug = `${base}-${n}`;
        note.slug = slug;
        taken.add(slug);
      });
      
      this.originalNotes = notes;
      this.notes = [...this.originalNotes];
      console.log('NoteService - Successfully loaded notes:', this.originalNotes.length);
    } catch (error) {
      console.error('Error loading notes:', error);
      this.originalNotes = [];
      this.notes = [];
    }
  }

  /**
   * Every folder path a note is filed under. Without explicit paths, each of the
   * note's folders is combined with each of its subfolders (and sub-subfolders).
   */
  getFolderPaths(note: Note): string[][] {
    if (note.paths) {
      return note.paths.map((path) => path.filter(Boolean));
    }
    const orEmpty = (list: string[]) => {
      const filled = list.filter(Boolean);
      return filled.length > 0 ? filled : [''];
    };
    const paths: string[][] = [];
    orEmpty(note.folder).forEach((folder) =>
      orEmpty(note.subFolder).forEach((subFolder) =>
        orEmpty(note.subSubFolder).forEach((subSubFolder) =>
          paths.push([folder, subFolder, subSubFolder].filter(Boolean))
        )
      )
    );
    return paths;
  }

  getNotes(): Note[] {
    // Ensure notes are loaded before returning
    if (this.notes.length === 0) {
      this.loadNotes();
    }
    return this.notes;
  }

  getNoteBySlug(slug: string): Note | undefined {
    return this.originalNotes.find((note) => note.slug === slug);
  }

  /** The page a note lives on, e.g. '/nobody-googles-anymore-right' */
  noteUrl(note: Note): string {
    return `/${note.slug}`;
  }

  getNoteById(id: number): Note | undefined {
    // Ensure notes are loaded before searching
    if (this.notes.length === 0) {
      this.loadNotes();
    }
    return this.notes.find((note) => note.id === id);
  }

  /** Every note filed under a quest, matched by quest id or name (case-insensitive, with/without .com) */
  getNotesByQuest(questId: string, questName?: string): Note[] {
    // Ensure notes are loaded before searching
    if (this.notes.length === 0) {
      this.loadNotes();
    }

    const names = new Set([questId.toLowerCase()]);
    if (questName) {
      names.add(questName.toLowerCase());
      names.add(questName.toLowerCase().replace(/\.com$/, ''));
    }
    return this.originalNotes.filter(
      (note) => !!note.quest && names.has(note.quest.toLowerCase().trim())
    );
  }

  filterNotes(folders: string | string[]) {
    // Ensure notes are loaded before filtering
    if (this.notes.length === 0) {
      this.loadNotes();
    }
    
    console.log('NoteService - Filtering notes for folders:', folders);
    console.log('NoteService - Original notes count:', this.originalNotes.length);
    
    // Store the current filter
    this.currentFilter = folders;
    
    // Reset to original list first
    this.notes = [...this.originalNotes];

    // Convert single string to array for consistent handling
    const filterFolders = Array.isArray(folders) ? folders : [folders];

    // Filter notes that have at least one folder matching the filter
    this.notes = this.notes.filter((note) =>
      filterFolders.some(filterFolder => 
        note.folder.includes(filterFolder)
      )
    );
    
    console.log('NoteService - Filtered notes count:', this.notes.length);
  }

  resetToOriginal() {
    this.notes = [...this.originalNotes];
    this.currentFilter = null;
  }

  getCurrentFilter(): string | string[] | null {
    return this.currentFilter;
  }

  applyCurrentFilter() {
    if (this.currentFilter) {
      this.filterNotes(this.currentFilter);
    }
  }
}

