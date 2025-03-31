import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  EventEmitter,
  Output,
  HostListener,
} from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-quit-bottom-nav',
  standalone: true,
  imports: [],
  templateUrl: './quit-bottom-nav.component.html',
  styleUrls: ['./quit-bottom-nav.component.css'],
})
export class QuitBottomNavComponent implements AfterViewInit {
  constructor(private router: Router) {}
  @Output() menuClicked = new EventEmitter<boolean>();
  @ViewChild('flickerText', { static: false }) flickerText!: ElementRef;
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.code === 'KeyA') {
      console.log('KeyA');
      this.clickMenu();
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.startFlicker();
    }, 1000); // Changed to 1 second for testing
  }
  startFlicker() {
    if (this.flickerText && this.flickerText.nativeElement) {
      this.flickerText.nativeElement.classList.add('flicker');
    } else {
      console.error('flickerText element not found');
    }
  }

  clickMenu() {
    this.menuClicked.emit(true);
    console.log('menuClicked has been emitted');
    this.router.navigate(['/practice']);
  }
}
