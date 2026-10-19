import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  ElementRef,
  ComponentRef,
  ViewContainerRef,
  Injector,
  createComponent,
  EnvironmentInjector,
} from '@angular/core';
import { Note, NoteService } from '../../../note.service';
import { Subscription } from 'rxjs';
import { NoteStateService } from '../../../note.service.state';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../theme.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-note-container',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './note-container.component.html',
  styleUrls: ['./note-container.component.css'],
  host: {
    '[style]': 'getContainerStyles()',
  },
})
export class NoteContainerComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  @Output() goBack = new EventEmitter<string>();
  @ViewChild('innerContainer') innerContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('noteBodyContainer', { read: ViewContainerRef })
  noteBodyContainer!: ViewContainerRef;
  @Input() sourceScreen: 'booknotes' | 'notes' | 'main-menu' | 'character' | 'personal' =
    'notes';

  selectedNote: Note | undefined = undefined;
  /** The note's folder paths; the bottom bar shows one at a time */
  folderPaths: string[][] = [];
  pathIndex = 0;
  private pathInterval: any;
  showNoteContent: boolean = false;
  private subscriptions: Subscription = new Subscription();
  private visualizationComponentRef: ComponentRef<any> | null = null;

  notes: Note[];

  constructor(
    private noteService: NoteService,
    private noteStateService: NoteStateService,
    private router: Router,
    public themeService: ThemeService,
    private injector: EnvironmentInjector
  ) {
    this.notes = [];
  }

  ngOnInit() {
    this.notes = this.noteService.getNotes();

    this.subscriptions.add(
      this.noteStateService.selectedNote$.subscribe((note) => {
        this.selectedNote = note;
        this.startPathCycle(note);
        this.scrollInnerContainerToTop();

        // Check if we need to add a visualization component
        if (note && note.visualizationComponent) {
          this.addVisualizationComponent();
        } else {
          this.removeVisualizationComponent();
        }

        // Process code blocks for comment styling when note changes
        setTimeout(() => {
          this.styleCodeComments();
        }, 0);
      })
    );

    this.subscriptions.add(
      this.noteStateService.showNoteContent$.subscribe((show) => {
        this.showNoteContent = show;
      })
    );
  }

  ngAfterViewInit() {
    // Initial scroll if needed
    this.scrollInnerContainerToTop();

    // If the selected note has a visualization component, add it
    if (this.selectedNote && this.selectedNote.visualizationComponent) {
      setTimeout(() => {
        this.addVisualizationComponent();
      }, 0);
    }

    // Process code blocks to add comment styling
    this.styleCodeComments();
  }

  ngOnDestroy() {
    clearInterval(this.pathInterval);
    this.removeVisualizationComponent();
    this.subscriptions.unsubscribe();
  }

  private startPathCycle(note: Note | undefined) {
    clearInterval(this.pathInterval);
    this.folderPaths = note
      ? this.noteService.getFolderPaths(note).filter((path) => path.length > 0)
      : [];
    this.pathIndex = 0;
    if (this.folderPaths.length > 1) {
      // Same pace as the character page bottom nav messages
      this.pathInterval = setInterval(() => {
        this.pathIndex = (this.pathIndex + 1) % this.folderPaths.length;
      }, 5000);
    }
  }

  private addVisualizationComponent() {
    if (!this.noteBodyContainer || !this.selectedNote?.visualizationComponent) return;

    // Remove any existing component
    this.removeVisualizationComponent();

    // Create a new component
    setTimeout(() => {
      if (this.noteBodyContainer) {
        this.noteBodyContainer.clear();
        this.visualizationComponentRef = createComponent(this.selectedNote!.visualizationComponent, {
          environmentInjector: this.injector,
          hostElement: document.createElement('div'),
        });

        // Configure the component with default dimensions
        // Individual components can override these if they have width/height properties
        if (this.visualizationComponentRef.instance.width !== undefined) {
          this.visualizationComponentRef.instance.width = 400;
        }
        if (this.visualizationComponentRef.instance.height !== undefined) {
          this.visualizationComponentRef.instance.height = 300;
        }

        // Add it to the view
        this.noteBodyContainer.insert(this.visualizationComponentRef.hostView);
      }
    }, 100);
  }

  private removeVisualizationComponent() {
    if (this.visualizationComponentRef) {
      this.visualizationComponentRef.destroy();
      this.visualizationComponentRef = null;
    }

    if (this.noteBodyContainer) {
      this.noteBodyContainer.clear();
    }
  }

  clickClose(sourceScreen?: string) {
    this.goBack.emit(sourceScreen || this.sourceScreen);
    // Only reset the filter if we're closing from the notes or main-menu screens
    // For booknotes, character, personal screens, maintain the filter
    if (this.sourceScreen === 'notes' || this.sourceScreen === 'main-menu') {
      this.noteService.resetToOriginal();
    }
  }

  clickNext() {
    const currentIndex = this.notes.findIndex(
      (a) => a === this.selectedNote
    );
    // Since notes are sorted in descending order (newest first), 
    // "next" chronologically means going to the previous index (higher ID number)
    const nextNote = this.notes[currentIndex - 1] || this.notes[this.notes.length - 1]; // Wrap to last if at beginning

    // Update the state service
    this.noteStateService.setSelectedNote(nextNote);

    // Only navigate via router if we're on the notes screen
    // For other screens (booknotes, character, personal), stay in the overlay
    if (this.sourceScreen === 'notes' || this.sourceScreen === 'main-menu') {
      const route = this.getRouteForNote(nextNote);
      this.router.navigate([route]);
    }
    // For booknotes, character, personal screens, the state update above is enough
    // The note container will automatically update via the observable
  }

  private getRouteForNote(note: Note): string {
    return this.noteService.noteUrl(note);
  }


  private scrollInnerContainerToTop() {
    // Use setTimeout to ensure the view has updated with the new note
    setTimeout(() => {
      if (this.innerContainer && this.innerContainer.nativeElement) {
        this.innerContainer.nativeElement.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      } else {
        console.warn('Inner container not found');
      }
    }, 0);
  }

  // Method to get the container styles based on the component's sourceScreen
  getContainerStyles(): string {
    return this.themeService.getNoteContainerStyles(this.sourceScreen);
  }

  // Automatically style comments in code blocks
  private styleCodeComments() {
    setTimeout(() => {
      if (!this.innerContainer) return;

      const codeBlocks = this.innerContainer.nativeElement.querySelectorAll('code');
      
      codeBlocks.forEach((codeBlock) => {
        // Skip if already processed
        if (codeBlock.hasAttribute('data-comments-styled')) return;
        
        // Get the text content
        let html = codeBlock.innerHTML;
        
        // Skip if there's no # character
        if (!html.includes('#')) return;
        
        // Skip if already has span.comment (manually added)
        if (html.includes('class="comment"')) return;
        
        // Replace text after # with styled span
        // Match # and everything after it until the end of line or end of content
        html = html.replace(/(#[^<]*?)(<|$)/g, '<span class="comment">$1</span>$2');
        
        codeBlock.innerHTML = html;
        codeBlock.setAttribute('data-comments-styled', 'true');
      });
    }, 100);
  }
}
