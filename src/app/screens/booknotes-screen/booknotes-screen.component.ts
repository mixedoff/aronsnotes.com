import { Component, EventEmitter, Output } from '@angular/core';
import { TopNavComponent } from '../../nav/top-nav/top-nav.component';
import { BottomNavComponent } from '../../nav/bottom-nav/bottom-nav.component';

interface Book {
  name: string;
  title: string;
  subtitle: string;
  type: string[];
  size: string;
  date: string;
  author: string;
  published: string;
  content: string;
}

@Component({
  selector: 'app-booknotes-screen',
  standalone: true,
  imports: [TopNavComponent, BottomNavComponent],
  templateUrl: './booknotes-screen.component.html',
  styleUrl: './booknotes-screen.component.css',
})
export class BooknotesScreenComponent {
  selectedBook: Book | null = null;
  books: Book[] = [
    {
      name: 'Soros on Soros.txt',
      title: '"I am fallible"',
      subtitle: 'George Soros philosophy on life',
      type: ['philosophy', 'business'],
      size: '1KB',
      date: '12-10-2024',
      author: 'George Soros',
      published: '2024',
      content: `This book is basically a dialog on Soros' philosophy, rather than on his personal story, even though it does contain his story. His contrarian idea based on he built his empire is twofold. First that the world is imperfect and therefore everything is fallible. Duh… He built his own value system on top of this idea. What?! This is the cornerstone of his philosophy: “I am fallible” which sounds like a good new age, pc poilicy but in my experience that is really hard to contend with. Second that things are reflexive. “We are accustomed to think of events as a sequence of facts: one set of facts follows another in a never-ending chain. When a situation has thinking participants. the chain does not lead directly from fact to fact. It links a fact to the participants' thinking to the next set of facts.”`,
    },
    // ... add other books
  ];

  closeSubmenu() {
    throw new Error('Method not implemented.');
  }
  @Output() menuClickedOnChild = new EventEmitter<boolean>();

  clickMenuOnChild() {
    this.menuClickedOnChild.emit(true);
    console.log('menuClickedOnChild emitted');
  }

  selectBook(book: Book) {
    this.selectedBook = book;
  }

  closeNote() {
    this.selectedBook = null;
  }
}
