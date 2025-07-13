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
import { Router } from '@angular/router';

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
  @Input() sourceScreen: 'booknotes' | 'articles' | 'main-menu' | 'about' | 'personal' =
    'articles';
  displayText: string = 'aronsnotes.com';
  private textInterval: any;

  constructor(public themeService: ThemeService, private router: Router) {}

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
      if (this.displayText === 'follow the flow') {
        this.displayText = 'embrace your weirdness';
      } else if (this.displayText === 'embrace your weirdness') {
        this.displayText = 'be kind to yourself';
      } else {
        this.displayText = 'follow the flow';
      }
    }, 5000); // Changes every 5 seconds
  }

  clickMenu() {
    this.menuClicked.emit(true);
    this.router.navigate(['/practice']);
  }

  // Method to get the nav styles based on the component's sourceScreen
  getNavStyles(): string {
    return this.themeService.getBottomNavStyles(this.sourceScreen);
  }
}
