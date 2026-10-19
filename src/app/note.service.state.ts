import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Note } from './note.service';

@Injectable({
  providedIn: 'root',
})
export class NoteStateService {
  private selectedNoteSubject = new BehaviorSubject<Note | undefined>(
    undefined
  );
  private showNoteContentSubject = new BehaviorSubject<boolean>(false);

  selectedNote$: Observable<Note | undefined> =
    this.selectedNoteSubject.asObservable();
  showNoteContent$: Observable<boolean> =
    this.showNoteContentSubject.asObservable();

  setSelectedNote(note: Note | undefined) {
    this.selectedNoteSubject.next(note);
  }

  setShowNoteContent(show: boolean) {
    this.showNoteContentSubject.next(show);
  }
}
