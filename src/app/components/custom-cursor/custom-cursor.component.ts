import { Component, OnInit, OnDestroy, HostListener, Renderer2, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-custom-cursor',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="custom-cursor" [class.clickable]="isOverClickable" [class.hidden]="!isCursorVisible">
      <img 
        [src]="currentCursorImage" 
        alt="cursor"
        class="cursor-image"
        [class.animated]="!isOverClickable"
      />
    </div>
  `,
  styles: [
    `
      .custom-cursor {
        position: fixed;
        top: -15px;
        left: 15px;
        width: 32px;
        height: 32px;
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.1s ease-out;
        transform: translate(-50%, -50%);
        background: transparent !important;
      }

      .custom-cursor.hidden {
        opacity: 0;
        pointer-events: none;
      }

      .custom-cursor:not(.hidden) {
        opacity: 1;
      }

      .cursor-image {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }

      .custom-cursor.animated .cursor-image {
        animation: wingFlap 0.4s infinite steps(1);
      }

      @keyframes wingFlap {
        0% { content: url('/assets/img/cursor/fly_wing_flap_frame_1.png'); }
        25% { content: url('/assets/img/cursor/fly_wing_flap_frame_2.png'); }
        50% { content: url('/assets/img/cursor/fly_wing_flap_frame_3.png'); }
        75% { content: url('/assets/img/cursor/fly_wing_flap_frame_4.png'); }
      }

      /* Enhanced cursor hiding for screen recording compatibility */
      * {
        cursor: none !important;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }

      /* Ensure no cursor shows anywhere - more specific selectors */
      html, body, div, span, button, a, input, textarea, select, img, svg, 
      [class*=""], [id*=""], [data], form, label, p, h1, h2, h3, h4, h5, h6,
      ul, ol, li, table, tr, td, th, thead, tbody, tfoot, nav, header, footer,
      main, section, article, aside, canvas, video, audio, iframe, embed, object {
        cursor: none !important;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }

      /* Force cursor hiding on all interactive elements */
      button:hover, a:hover, input:hover, textarea:hover, select:hover,
      button:focus, a:focus, input:focus, textarea:focus, select:focus,
      button:active, a:active, input:active, textarea:active, select:active {
        cursor: none !important;
      }

      /* Additional hiding for form elements */
      input[type="text"], input[type="password"], input[type="email"], 
      input[type="number"], input[type="search"], input[type="tel"], 
      input[type="url"], textarea, select {
        cursor: none !important;
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
      }

      /* Disable custom cursor on mobile devices */
      @media (max-width: 768px) {
        .custom-cursor {
          display: none !important;
        }
        
        /* Show default cursor on mobile */
        html, body, div, span, button, a, input, textarea, select, img, svg {
          cursor: auto !important;
          -webkit-user-select: auto;
          -moz-user-select: auto;
          -ms-user-select: auto;
          user-select: auto;
        }
      }
    `
  ]
})
export class CustomCursorComponent implements OnInit, OnDestroy {
  cursorX: number = 0;
  cursorY: number = 0;
  targetX: number = 0;
  targetY: number = 0;
  isOverClickable: boolean = false;
  isCursorVisible: boolean = true;
  private animationTimer: any;
  private currentFrame: number = 1;
  private readonly totalFrames: number = 4;
  private readonly slurpingFrames: number = 18;
  private readonly animationSpeed: number = 100; // milliseconds between frames
  private readonly cursorDelay: number = 0.15; // seconds of delay
  private isMoving: boolean = true;
  private movementTimer: any;
  private readonly movementTimeout: number = 500; // milliseconds before switching to rubbing
  private useLegRubbing: boolean = false; // Toggle between regular and leg rubbing
  private cursorHideInterval: any;

  constructor(
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {}

  get currentCursorImage(): string {
    if (this.isOverClickable) {
      // Use slurping animation when over clickable elements (frames 00-14)
      const frameNumber = (this.currentFrame - 1).toString().padStart(2, '0');
      return `/assets/img/cursor/fly_slurping_v5_frame_${frameNumber}.png`;
    }
    
    if (!this.isMoving) {
      // Use alternating rubbing animations when not moving
      const frameNumber = (this.currentFrame - 1).toString().padStart(2, '0');
      if (this.useLegRubbing) {
        return `/assets/img/cursor/fly_leg_rubbing_v2_frame_${this.currentFrame - 1}.png`;
      } else {
        return `/assets/img/cursor/fly_rubbing_frame_${frameNumber}.png`;
      }
    }
    
    // Use wing flap animation when moving (frames 00-03)
    const frameNumber = (this.currentFrame - 1).toString().padStart(2, '0');
    return `/assets/img/cursor/fly_wing_flap_frame_${frameNumber}.png`;
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    this.cursorX = event.clientX;
    this.cursorY = event.clientY;
    
    // Show cursor when mouse moves
    this.isCursorVisible = true;
    
    // Reset movement timer
    const wasMoving = this.isMoving;
    this.isMoving = true;
    
    // Reset frame if switching from stopped to moving
    if (wasMoving !== this.isMoving) {
      this.currentFrame = 1;
    }
    
    this.resetMovementTimer();
  }

  @HostListener('document:mouseenter')
  onMouseEnter() {
    // Show cursor when mouse enters the page
    this.isCursorVisible = true;
  }

  @HostListener('document:mouseleave')
  onMouseLeave() {
    // Hide cursor when mouse leaves the page
    this.isCursorVisible = false;
  }

  @HostListener('document:mouseover', ['$event'])
  onMouseOver(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const wasOverClickable = this.isOverClickable;
    this.isOverClickable = this.isClickableElement(target);
    
    // Reset frame if switching between different animation states
    if (wasOverClickable !== this.isOverClickable) {
      this.currentFrame = 1;
    }
    
    // Always start animation, it will handle the correct frame count based on isOverClickable
    this.startAnimation();
  }

  @HostListener('document:mouseout', ['$event'])
  onMouseOut(event: MouseEvent) {
    const wasOverClickable = this.isOverClickable;
    this.isOverClickable = false;
    
    // Reset frame if switching from clickable to non-clickable
    if (wasOverClickable !== this.isOverClickable) {
      this.currentFrame = 1;
    }
    
    this.startAnimation();
  }

  private isClickableElement(element: HTMLElement): boolean {
    const clickableSelectors = [
      'button',
      'a',
      '[role="button"]',
      '.icon-holder',
      '.traffic-lights-svg',
      'input',
      'textarea',
      'select'
    ];
    
    return clickableSelectors.some(selector => 
      element.matches(selector) || element.closest(selector)
    );
  }

  private startAnimation() {
    this.stopAnimation();
    this.animationTimer = setInterval(() => {
      const maxFrames = this.isOverClickable ? this.slurpingFrames : this.totalFrames;
      this.currentFrame = (this.currentFrame % maxFrames) + 1;
    }, this.animationSpeed);
  }

  private resetMovementTimer() {
    if (this.movementTimer) {
      clearTimeout(this.movementTimer);
    }
    
    this.movementTimer = setTimeout(() => {
      const wasMoving = this.isMoving;
      this.isMoving = false;
      
      // Reset frame if switching from moving to stopped
      if (wasMoving !== this.isMoving) {
        this.currentFrame = 1;
        // Toggle between regular and leg rubbing
        this.useLegRubbing = !this.useLegRubbing;
      }
    }, this.movementTimeout);
  }

  private stopAnimation() {
    if (this.animationTimer) {
      clearInterval(this.animationTimer);
      this.animationTimer = null;
    }
    if (this.movementTimer) {
      clearTimeout(this.movementTimer);
      this.movementTimer = null;
    }
  }

  private updateCursorPosition() {
    // Update the cursor element position directly without delay
    const cursorElement = this.document.querySelector('.custom-cursor') as HTMLElement;
    if (cursorElement) {
      this.renderer.setStyle(cursorElement, 'transform', `translate(${this.cursorX}px, ${this.cursorY}px) translate(-50%, -50%)`);
    }
  }

  private forceHideSystemCursor() {
    // Aggressively hide system cursor on all elements
    const allElements = this.document.querySelectorAll('*');
    allElements.forEach((element: Element) => {
      const htmlElement = element as HTMLElement;
      if (htmlElement.style) {
        this.renderer.setStyle(htmlElement, 'cursor', 'none');
        this.renderer.setStyle(htmlElement, '-webkit-user-select', 'none');
        this.renderer.setStyle(htmlElement, '-moz-user-select', 'none');
        this.renderer.setStyle(htmlElement, '-ms-user-select', 'none');
        this.renderer.setStyle(htmlElement, 'user-select', 'none');
      }
    });

    // Also set on document body and html
    this.renderer.setStyle(this.document.body, 'cursor', 'none');
    this.renderer.setStyle(this.document.documentElement, 'cursor', 'none');
  }

  private setupCursorHiding() {
    // Set up multiple layers of cursor hiding
    
    // 1. Continuous monitoring
    this.cursorHideInterval = setInterval(() => {
      this.forceHideSystemCursor();
    }, 50); // Check every 50ms for maximum effectiveness

    // 2. Monitor for DOM changes and hide cursor on new elements
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as HTMLElement;
              this.renderer.setStyle(element, 'cursor', 'none');
              this.renderer.setStyle(element, '-webkit-user-select', 'none');
              this.renderer.setStyle(element, '-moz-user-select', 'none');
              this.renderer.setStyle(element, '-ms-user-select', 'none');
              this.renderer.setStyle(element, 'user-select', 'none');
              
              // Also hide cursor on all child elements
              const childElements = element.querySelectorAll('*');
              childElements.forEach((child) => {
                const childElement = child as HTMLElement;
                if (childElement.style) {
                  this.renderer.setStyle(childElement, 'cursor', 'none');
                  this.renderer.setStyle(childElement, '-webkit-user-select', 'none');
                  this.renderer.setStyle(childElement, '-moz-user-select', 'none');
                  this.renderer.setStyle(childElement, '-ms-user-select', 'none');
                  this.renderer.setStyle(childElement, 'user-select', 'none');
                }
              });
            }
          });
        }
      });
    });

    // Start observing
    observer.observe(this.document.body, {
      childList: true,
      subtree: true
    });

    // 3. Monitor for focus events and ensure cursor stays hidden
    this.document.addEventListener('focusin', (event) => {
      const target = event.target as HTMLElement;
      if (target) {
        this.renderer.setStyle(target, 'cursor', 'none');
        this.renderer.setStyle(target, '-webkit-user-select', 'none');
        this.renderer.setStyle(target, '-moz-user-select', 'none');
        this.renderer.setStyle(target, '-ms-user-select', 'none');
        this.renderer.setStyle(target, 'user-select', 'none');
      }
    });

    // 4. Monitor for mouse events and ensure cursor stays hidden
    this.document.addEventListener('mouseover', (event) => {
      const target = event.target as HTMLElement;
      if (target) {
        this.renderer.setStyle(target, 'cursor', 'none');
        this.renderer.setStyle(target, '-webkit-user-select', 'none');
        this.renderer.setStyle(target, '-moz-user-select', 'none');
        this.renderer.setStyle(target, '-ms-user-select', 'none');
        this.renderer.setStyle(target, 'user-select', 'none');
      }
    });
  }

  ngOnInit() {
    // Initialize cursor position to center of screen
    this.cursorX = window.innerWidth / 2;
    this.cursorY = window.innerHeight / 2;
    
    // Start the animated cursor
    this.startAnimation();
    
    // Start movement timer
    this.resetMovementTimer();

    // Start the position update loop
    this.updateCursorPosition();
    setInterval(() => {
      this.updateCursorPosition();
    }, 16); // ~60fps update rate

    // Force hide system cursor immediately
    this.forceHideSystemCursor();

    // Set up continuous cursor hiding to prevent system cursor from reappearing
    this.setupCursorHiding();
  }

  ngOnDestroy() {
    // Stop animation when component is destroyed
    this.stopAnimation();
    
    // Clear the cursor hiding interval
    if (this.cursorHideInterval) {
      clearInterval(this.cursorHideInterval);
    }
  }
} 