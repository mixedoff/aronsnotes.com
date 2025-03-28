import {
  Component,
  EventEmitter,
  Output,
  Input,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../theme.service';

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bottom-nav.component.html',
  styleUrl: './bottom-nav.component.css',
  host: {
    '[style]': 'getNavStyles()',
  },
})
export class BottomNavComponent implements OnInit, OnDestroy {
  @Output() menuClicked = new EventEmitter<boolean>();
  @Input() sourceScreen: 'booknotes' | 'articles' | 'main-menu' | 'about' =
    'articles';
  displayText: string = 'aronsnotes.com';
  private textInterval: any;

  constructor(public themeService: ThemeService) {}

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
          ? 'embrace your weirdness'
          : 'aronsnotes.com';
    }, 5000); // Changes every 5 seconds
  }

  clickMenu() {
    this.menuClicked.emit(true);
  }

  // Method to get the nav styles based on the component's sourceScreen
  getNavStyles(): string {
    console.log(
      'Getting bottom nav styles for sourceScreen:',
      this.sourceScreen
    );
    return this.themeService.getBottomNavStyles(this.sourceScreen);
  }
}
