import {
  Component,
  EventEmitter,
  Output,
  OnInit,
  OnDestroy,
} from '@angular/core';

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [],
  templateUrl: './bottom-nav.component.html',
  styleUrl: './bottom-nav.component.css',
})
export class BottomNavComponent implements OnInit, OnDestroy {
  @Output() menuClicked = new EventEmitter<boolean>();
  displayText: string = 'aronsnotes.com';
  private textInterval: any;

  ngOnInit() {
    this.startTextCycle();
  }

  ngOnDestroy() {
    if (this.textInterval) {
      clearInterval(this.textInterval);
    }
  }

  private startTextCycle() {
    this.textInterval = setInterval(() => {
      this.displayText =
        this.displayText === 'aronsnotes.com'
          ? 'stay awhile and read'
          : 'aronsnotes.com';
    }, 5000); // Changes every 5 seconds
  }

  clickMenu() {
    this.menuClicked.emit(true);
  }
}
