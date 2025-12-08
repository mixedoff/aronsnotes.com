import {
  Component,
  EventEmitter,
  HostListener,
  Output,
  Input,
  OnInit,
  ChangeDetectionStrategy,
  ElementRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ArticleStateService } from '../../article.service.state';
import { Article } from '../../article.service';
import { Subscription } from 'rxjs';
import { ThemeService } from '../../theme.service';

@Component({
  selector: 'app-article-top-nav',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './article-top-nav.component.html',
  styleUrl: './article-top-nav.component.css',
  host: {
    '[style]': 'navStyles',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleTopNavComponent implements OnInit {
  @Output() clickConnect = new EventEmitter<boolean>();
  @Output() clickMenu = new EventEmitter<boolean>();
  @Output() clickQuit = new EventEmitter<boolean>();
  @Output() clickArticles = new EventEmitter<boolean>();
  @Output() clickReads = new EventEmitter<boolean>();
  @Output() shiftC = new EventEmitter<boolean>();
  @Output() shiftM = new EventEmitter<boolean>();

  private subscriptions: Subscription = new Subscription();
  private currentArticle?: Article;

  private _sourceScreen: 'booknotes' | 'articles' | 'main-menu' | 'about' | 'personal' =
    'articles';
  private _navStyles: string = '';

  @Input()
  set sourceScreen(value: 'booknotes' | 'articles' | 'main-menu' | 'about' | 'personal') {
    if (this._sourceScreen !== value) {
      this._sourceScreen = value;
      // Update styles only when sourceScreen changes
      this._navStyles = this.themeService.getTopNavStyles(this._sourceScreen);
    }
  }

  get sourceScreen(): 'booknotes' | 'articles' | 'main-menu' | 'about' | 'personal' {
    return this._sourceScreen;
  }

  // Use a getter for styles instead of a method
  get navStyles(): string {
    return this._navStyles;
  }

  constructor(
    private router: Router,
    private articleStateService: ArticleStateService,
    public themeService: ThemeService,
    private elementRef: ElementRef
  ) {}

  ngOnInit() {}

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.code === 'KeyA') {
      console.log('KeyA');
      this.onConnect();
    } else if (event.code === 'KeyW') {
      console.log('KeyW');
      this.onMenu();
    } else if (event.code === 'KeyP') {
      console.log('KeyP');
      this.onArticles();
    } else if (event.code === 'KeyT') {
      console.log('KeyT');
      this.onReads();
    } else if (event.code === 'KeyQ') {
      console.log('KeyQ');
      this.onQuit();
    }
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    // Ensure cursor remains hidden when leaving the nav
    document.body.style.cursor = 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'1\' height=\'1\'><rect width=\'1\' height=\'1\' fill=\'transparent\'/></svg>") 0 0, none';
  }

  onConnect() {
    this.clickConnect.emit(true);
    console.log('clickConnect emitted');
    this.sourceScreen = 'about';
    this.router.navigate(['/about']);
    // Force cursor to none for the host element after 300ms
    setTimeout(() => {
    const hostElement = this.elementRef.nativeElement;
      if (hostElement) {
        (hostElement as HTMLElement).style.cursor = 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'1\' height=\'1\'><rect width=\'1\' height=\'1\' fill=\'transparent\'/></svg>") 0 0, none';
      }
    }, 300);
  }

  onMenu() {
    this.clickMenu.emit(true);
    console.log('clickMenu emitted');
    this.sourceScreen = 'main-menu';
    this.router.navigate(['/main-menu']);
  }

  onArticles() {
    this.clickArticles.emit(true);
    console.log('Articles clicked');
    this.sourceScreen = 'articles';
    this.router.navigate(['/practice']);
  }

  onQuit() {
    this.clickQuit.emit(true);
    console.log('Quit clicked');
    this.router.navigate(['/quit']);
  }

  onReads() {
    this.clickReads.emit(true);
    console.log('Reads clicked');
    this.sourceScreen = 'booknotes';
    this.router.navigate(['/theory']);
  }
}
