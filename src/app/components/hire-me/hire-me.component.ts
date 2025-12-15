import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter, Subscription } from 'rxjs';

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
  private routerSubscription?: Subscription;
  private readonly IDLE_DURATION = 20000; // 20 seconds
  private readonly DISPLAY_DURATION = 200; // 200ms

  constructor(private router: Router) {}

  ngOnInit() {
    // Reset visibility state on init
    this.isVisible = false;
    this.startIdleTimer();
    
    // Listen to route changes and reset state when navigating
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.resetState();
      });
  }

  ngOnDestroy() {
    this.clearTimers();
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
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
    // Reset visibility when clearing timers
    this.isVisible = false;
  }

  private resetState() {
    // Reset visibility and restart idle timer when route changes
    this.clearTimers();
    this.startIdleTimer();
  }
}



