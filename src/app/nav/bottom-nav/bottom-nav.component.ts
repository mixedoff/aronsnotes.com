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
import { NoteStateService } from '../../note.service.state';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bottom-nav.component.html',
  styleUrl: './bottom-nav.component.css',
  host: {
    '[style]': 'getNavStyles()',
    '[class.note-open]': 'isNoteOpen',
  },
})
export class BottomNavComponent implements OnInit, OnDestroy {
  @Output() menuClicked = new EventEmitter<boolean>();
  @Input() sourceScreen: 'booknotes' | 'notes' | 'main-menu' | 'character' | 'personal' =
    'notes';
  /** The rotating messages are shown on the character page; everywhere else the bottom nav shows the socials */
  @Input() showMessages = false;
  displayText: string = 'aronsnotes.com';
  // Same links as on the character page
  socials = [
    { id: 'email', href: 'mailto:aron.peter.kovacs@gmail.com', title: 'shoot me an email for general inquiries or to hire me' },
    { id: 'instagram', href: 'https://www.instagram.com/misterkovax/', title: 'i post my pretty visuals and some personal stuff here' },
    { id: 'github', href: 'https://github.com/mixedoff', title: 'check out my github' },
    { id: 'linkedin', href: 'https://www.linkedin.com/in/aronpeterkovacs/', title: 'connect with me on linkedin' },
  ];
  private textInterval: any;
  isNoteOpen: boolean = false;
  private noteContentSubscription?: Subscription;

  constructor(
    public themeService: ThemeService,
    private router: Router,
    private noteStateService: NoteStateService
  ) {}

  ngOnInit() {
    if (this.showMessages) {
      this.startTextCycle();
    }
    this.noteContentSubscription = this.noteStateService.showNoteContent$.subscribe(
      (show) => {
        this.isNoteOpen = show;
      }
    );
  }

  ngOnDestroy() {
    if (this.textInterval) {
      clearInterval(this.textInterval);
    }
    if (this.noteContentSubscription) {
      this.noteContentSubscription.unsubscribe();
    }
  }

  private startTextCycle() {
    this.textInterval = setInterval(() => {
      if (this.displayText === 'follow the flow') {
        this.displayText = 'embrace your weirdness';
      } else if (this.displayText === 'embrace your weirdness') {
        this.displayText = 'be kind to yourself';
      } else if (this.displayText === 'be kind to yourself') {
        this.displayText = 'underpromise and overdeliver';
      } else {
        this.displayText = 'follow the flow';
      }
    }, 5000); // Changes every 5 seconds
  }

  clickMenu() {
    this.menuClicked.emit(true);
    this.router.navigate(['/character']);
  }

  // Method to get the nav styles based on the component's sourceScreen
  getNavStyles(): string {
    return this.themeService.getBottomNavStyles(this.sourceScreen);
  }
}
