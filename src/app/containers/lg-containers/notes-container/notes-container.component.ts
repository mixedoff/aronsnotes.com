import { Component, EventEmitter, Output, Input } from '@angular/core';
import { RouterModule, Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Note, NoteService } from '../../../note.service';
import { NoteStateService } from '../../../note.service.state';
import { OnInit, OnDestroy } from '@angular/core';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-notes-container',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './notes-container.component.html',
  styleUrl: './notes-container.component.css',
})
export class NotesContainerComponent implements OnInit, OnDestroy {
  @Input() sourceScreen: 'booknotes' | 'notes' | 'main-menu' | 'character' | 'personal' =
    'notes';
  @Output() noteClicked = new EventEmitter<Note>();
  @Output() closeNotesClicked = new EventEmitter<void>();
  @Input() containerTitle: string = 'notes'; // default value is 'notes'
  notes: Note[];
  private navigatingToNote = false;
  private routerSubscription: Subscription | null = null;

  constructor(
    private noteService: NoteService,
    private noteStateService: NoteStateService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.notes = [];

    // Subscribe to router events to track navigation
    this.routerSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        // Check if we're navigating to a note page
        this.navigatingToNote = !!this.noteService.getNoteBySlug(
          event.urlAfterRedirects.split(/[?#]/)[0].slice(1)
        );
      });
  }

  ngOnInit() {
    // Check if we're on a specific route and apply appropriate filtering
    this.checkRouteAndApplyFilter();
  }

  private checkRouteAndApplyFilter() {
    const currentUrl = this.router.url;
    console.log('NotesContainerComponent - Current URL:', currentUrl);
    
    if (currentUrl.includes('/skills')) {
      // We're on the skills (booknotes) screen - show writing notes
      console.log('Filtering for writing notes...');
      this.noteService.filterNotes('content');
    } else if (currentUrl.includes('/notes')) {
      // We're on the notes screen - show all notes
      console.log('Resetting to original notes...');
      this.noteService.resetToOriginal();
    } else if (currentUrl.includes('/creative')) {
      // We're on the creative/personal screen - show writing notes (creative writing)
      console.log('Filtering for writing notes...');
      this.noteService.filterNotes('content');
    } else if (currentUrl.includes('/design')) {
      // We're on a design screen - show design notes
      console.log('Filtering for design notes...');
      this.noteService.filterNotes('product');
    } else {
      // Default fallback - show all notes
      console.log('Default fallback - resetting to original notes...');
      this.noteService.resetToOriginal();
    }
    
    // Update the notes array after filtering
    this.notes = this.noteService.getNotes();
    console.log('NotesContainerComponent - Loaded notes:', this.notes.length);
  }

  selectNote(note: Note) {
    // First, emit the event for any parent components that need it
    this.noteClicked.emit(note);

    // Set the selected note in the state service
    this.noteStateService.setSelectedNote(note);
    this.noteStateService.setShowNoteContent(true);

    // Set flag that we're navigating to a note
    this.navigatingToNote = true;

    this.router.navigateByUrl(this.noteService.noteUrl(note));
  }

  getNoteColor(note: Note): string {
    if (note.folder.includes('product')) {
      return '#3A94DE'; // blue
    } else if (note.folder.includes('engineering')) {
      return '#6ffa1e'; // green
    } else if (note.folder.includes('growth')) {
      return '#ffe415'; // yellow
    } else if (note.folder.includes('content')) {
      return '#4ECDC4'; // teal
    } else if (note.folder.includes('marketing')) {
      return '#8AB8FF'; // light blue
    }
    return '#ffffff'; // Default: white
  }

  closeNotes() {
    this.closeNotesClicked.emit();
    this.router.navigate(['/quit']);
  }

  ngOnDestroy() {
    // Only reset the filter if we're not navigating to a note page
    if (!this.navigatingToNote) {
      // Reset to show all notes by default (practice screen)
      this.noteService.resetToOriginal();
    }

    // Clean up subscription
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
}
