import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hire-me',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hire-me.component.html',
  styleUrls: ['./hire-me.component.css']
})
export class HireMeComponent implements OnInit, OnDestroy {
  isVisible = false;
  private idleTimer: any;
  private displayTimer: any;
  private readonly IDLE_DURATION = 20000; // 20 seconds
  private readonly DISPLAY_DURATION = 200; // 200ms

  ngOnInit() {
    this.startIdleTimer();
  }

  ngOnDestroy() {
    this.clearTimers();
  }

  @HostListener('document:mousemove', ['$event'])
  @HostListener('document:keypress', ['$event'])
  @HostListener('document:click', ['$event'])
  @HostListener('document:scroll', ['$event'])
  onUserActivity() {
    this.resetIdleTimer();
  }

  private startIdleTimer() {
    this.idleTimer = setTimeout(() => {
      this.showHireMe();
    }, this.IDLE_DURATION);
  }

  private resetIdleTimer() {
    this.clearTimers();
    this.startIdleTimer();
  }

  private showHireMe() {
    this.isVisible = true;
    
    this.displayTimer = setTimeout(() => {
      this.isVisible = false;
      this.startIdleTimer(); // Restart the cycle
    }, this.DISPLAY_DURATION);
  }

  private clearTimers() {
    if (this.idleTimer) {
      clearTimeout(this.idleTimer);
      this.idleTimer = null;
    }
    if (this.displayTimer) {
      clearTimeout(this.displayTimer);
      this.displayTimer = null;
    }
  }
}



