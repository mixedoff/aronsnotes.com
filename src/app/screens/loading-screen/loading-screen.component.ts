import { Component, Output, HostBinding } from '@angular/core';
import { InfoContainerComponent } from '../../containers/sm-containers/info-container/info-container.component';
import { LabelContainerComponent } from '../../containers/lg-containers/label-container/label-container.component';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { DissolveToBlackComponent } from '../../animations/dissolve-to-black/dissolve-to-black.component';
import { TopNavComponent } from '../../nav/top-nav/top-nav.component';

@Component({
  selector: 'app-loading-screen',
  standalone: true,
  imports: [
    InfoContainerComponent,
    LabelContainerComponent,
    DissolveToBlackComponent,
    TopNavComponent,
  ],
  templateUrl: './loading-screen.component.html',
  styleUrl: './loading-screen.component.css',
})
export class LoadingScreenComponent {
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
  @Output() currentMessage: string = this.loadingMessages[0];
  private intervalId: any;

  ngOnInit(): void {
    let messageIndex = 0;
    this.intervalId = setInterval(() => {
      messageIndex = (messageIndex + 1) % this.loadingMessages.length;
      this.currentMessage = this.loadingMessages[messageIndex];
    }, 300);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId); // Clear the interval to prevent memory leaks
    }
  }
}
