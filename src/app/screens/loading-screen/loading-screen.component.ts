import {
  Component,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { Router } from '@angular/router';
import { InfoContainerComponent } from '../../containers/sm-containers/info-container/info-container.component';
import { LabelContainerComponent } from '../../containers/lg-containers/label-container/label-container.component';
import { DissolveToBlackComponent } from '../../animations/dissolve-to-black/dissolve-to-black.component';

@Component({
  selector: 'app-loading-screen',
  standalone: true,
  imports: [
    InfoContainerComponent,
    LabelContainerComponent,
    DissolveToBlackComponent,
  ],
  templateUrl: './loading-screen.component.html',
  styleUrl: './loading-screen.component.css',
})
export class LoadingScreenComponent implements OnInit, OnDestroy {
  @Output() skipLoadingScreenEvent = new EventEmitter<boolean>();
  loadingMessages: string[] = [
    'Please wait! Codes are being generated...',
    'Please wait! Data are being generated...',
    'Please wait! Indexes are being generated...',
    'Please wait! Concern with AGI is being generated...',
    'Please wait! A hot cup of cofee is being generated...',
    'Please wait! Mild anxiety is being generated...',
    'Please wait! A career change is being generated...',
    'Please wait! Existential angst is being generated...',
    'Please wait! Slight OCD is being generated...',
  ];
  currentMessage: string = this.loadingMessages[0];
  private intervalId: any;
  private loadingTimeout: any;

  constructor(private router: Router) {}

  forwardToMainMenuScreen() {
    this.skipLoadingScreenEvent.emit(true);
    this.router.navigate(['/welcome']);
  }

  ngOnInit(): void {
    let messageIndex = 0;
    this.intervalId = setInterval(() => {
      messageIndex = (messageIndex + 1) % this.loadingMessages.length;
      this.currentMessage = this.loadingMessages[messageIndex];
    }, 300);

    // Auto-navigate to welcome screen after 4 seconds
    this.loadingTimeout = setTimeout(() => {
      this.router.navigate(['/welcome']);
    }, 4000);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    if (this.loadingTimeout) {
      clearTimeout(this.loadingTimeout);
    }
  }
}
