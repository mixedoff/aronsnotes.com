import { Component, OnInit, OnDestroy, HostListener, Renderer2, Inject, NgZone, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-custom-cursor',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div #cursorContainer class="custom-cursor" [class.clickable]="isOverClickable" [class.hidden]="!isCursorVisible">
      <img 
        #cursorImage
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
        /* transition: transform 0.1s ease-out; Removed for JS-driven smoothness */
        transform: translate(-50%, -50%);
        background: transparent !important;
        will-change: transform;
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
        cursor: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='1' height='1'><rect width='1' height='1' fill='transparent'/></svg>") 0 0, none !important;
      }

      /* Ensure no cursor shows anywhere - more specific selectors */
      html, body, div, span, button, a, input, textarea, select, img, svg, 
      [class*=""], [id*=""], [data], form, label, p, h1, h2, h3, h4, h5, h6,
      ul, ol, li, table, tr, td, th, thead, tbody, tfoot, nav, header, footer,
      main, section, article, aside, canvas, video, audio, iframe, embed, object {
        cursor: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='1' height='1'><rect width='1' height='1' fill='transparent'/></svg>") 0 0, none !important;
      }

      /* Allow text selection in article body */
      .article-body, .article-body * {
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        -ms-user-select: text !important;
        user-select: text !important;
      }

      /* Force cursor hiding on all interactive elements */
      button:hover, a:hover, input:hover, textarea:hover, select:hover,
      button:focus, a:focus, input:focus, textarea:focus, select:focus,
      button:active, a:active, input:active, textarea:active, select:active {
        cursor: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='1' height='1'><rect width='1' height='1' fill='transparent'/></svg>") 0 0, none !important;
      }

      /* Additional hiding for form elements */
      input[type="text"], input[type="password"], input[type="email"], 
      input[type="number"], input[type="search"], input[type="tel"], 
      input[type="url"], textarea, select {
        cursor: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='1' height='1'><rect width='1' height='1' fill='transparent'/></svg>") 0 0, none !important;
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
  @ViewChild('cursorContainer') cursorContainer!: ElementRef;
  @ViewChild('cursorImage') cursorImage!: ElementRef;

  // Track cursor position
  private mouseX: number = 0;
  private mouseY: number = 0;
  
  // Track interpolated position for smooth movement
  private currentX: number = 0;
  private currentY: number = 0;
  
  isOverClickable: boolean = false;
  isCursorVisible: boolean = true;
  
  private currentFrame: number = 1;
  private readonly totalFrames: number = 4;
  private readonly slurpingFrames: number = 18;
  
  private isMoving: boolean = true;
  private useLegRubbing: boolean = false;
  
  // Animation and loop references
  private animationInterval: any;
  private movementTimer: any;
  private cursorHideInterval: any;
  private removeMouseMoveListener: (() => void) | null = null;
  private removeFocusInListener: (() => void) | null = null;
  private animationFrameId: number | null = null;
  private observer: MutationObserver | null = null;
  
  // Configuration
  private readonly animationSpeed: number = 100;
  private readonly movementTimeout: number = 500;

  constructor(
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
    private ngZone: NgZone
  ) {}

  get currentCursorImage(): string {
    if (this.isOverClickable) {
      const frameNumber = (this.currentFrame - 1).toString().padStart(2, '0');
      return `/assets/img/cursor/fly_slurping_v5_frame_${frameNumber}.png`;
    }
    
    if (!this.isMoving) {
      const frameNumber = (this.currentFrame - 1).toString().padStart(2, '0');
      if (this.useLegRubbing) {
        return `/assets/img/cursor/fly_leg_rubbing_v2_frame_${this.currentFrame - 1}.png`;
      } else {
        return `/assets/img/cursor/fly_rubbing_frame_${frameNumber}.png`;
      }
    }
    
    const frameNumber = (this.currentFrame - 1).toString().padStart(2, '0');
    return `/assets/img/cursor/fly_wing_flap_frame_${frameNumber}.png`;
  }

  ngOnInit() {
    this.mouseX = window.innerWidth / 2;
    this.mouseY = window.innerHeight / 2;
    this.currentX = this.mouseX;
    this.currentY = this.mouseY;
    
    // Run high-frequency updates outside Angular to avoid change detection cycles
    this.ngZone.runOutsideAngular(() => {
      // 1. Mouse move listener
      this.removeMouseMoveListener = this.renderer.listen('document', 'mousemove', (event: MouseEvent) => {
        this.mouseX = event.clientX;
        this.mouseY = event.clientY;
        
        // Logic that was in onMouseMove
        this.isCursorVisible = true;
        const wasMoving = this.isMoving;
        this.isMoving = true;
        if (wasMoving !== this.isMoving) {
          this.currentFrame = 1;
          this.updateCursorImage(); // Manually update image
        }
        this.resetMovementTimer();
      });

      // 2. Animation Loop (60fps) for position
      const loop = () => {
        // Linear interpolation for smooth movement (0.2 factor)
        // Adjust factor: 1.0 = instant, 0.1 = very smooth/slow
        const lerp = 0.2; 
        this.currentX += (this.mouseX - this.currentX) * lerp;
        this.currentY += (this.mouseY - this.currentY) * lerp;
        
        if (this.cursorContainer) {
          // Rounding pixels can prevent sub-pixel blurring, but floats are smoother
          this.cursorContainer.nativeElement.style.transform = 
            `translate(${this.currentX}px, ${this.currentY}px) translate(-50%, -50%)`;
        }
        
        this.animationFrameId = requestAnimationFrame(loop);
      };
      loop();

      // 3. Sprite Animation Interval
      this.animationInterval = setInterval(() => {
        const maxFrames = this.isOverClickable ? this.slurpingFrames : this.totalFrames;
        this.currentFrame = (this.currentFrame % maxFrames) + 1;
        this.updateCursorImage();
      }, this.animationSpeed);
    });

    this.forceHideSystemCursor();
    this.setupCursorHiding();
  }

  // Manually update image source to avoid change detection
  private updateCursorImage() {
    if (this.cursorImage) {
      this.cursorImage.nativeElement.src = this.currentCursorImage;
    }
  }

  @HostListener('document:mouseenter')
  onMouseEnter() {
    this.isCursorVisible = true;
  }

  @HostListener('document:mouseleave')
  onMouseLeave() {
    this.isCursorVisible = false;
  }

  @HostListener('document:mouseover', ['$event'])
  onMouseOver(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const wasOverClickable = this.isOverClickable;
    this.isOverClickable = this.isClickableElement(target);
    
    if (wasOverClickable !== this.isOverClickable) {
      this.currentFrame = 1;
      this.updateCursorImage();
    }
    
    // Ensure animation logic is correct (it runs continuously now, but frame limits change)
  }

  @HostListener('document:mouseout', ['$event'])
  onMouseOut(event: MouseEvent) {
    const wasOverClickable = this.isOverClickable;
    this.isOverClickable = false;
    
    if (wasOverClickable !== this.isOverClickable) {
      this.currentFrame = 1;
      this.updateCursorImage();
    }
  }

  private isClickableElement(element: HTMLElement): boolean {
    const clickableSelectors = [
      'button', 'a', '[role="button"]', '.icon-holder',
      '.traffic-lights-svg', 'input', 'textarea', 'select'
    ];
    return clickableSelectors.some(selector => 
      element.matches(selector) || element.closest(selector)
    );
  }

  private resetMovementTimer() {
    if (this.movementTimer) {
      clearTimeout(this.movementTimer);
    }
    
    this.movementTimer = setTimeout(() => {
      this.ngZone.runOutsideAngular(() => { // Ensure this runs outside too
        const wasMoving = this.isMoving;
        this.isMoving = false;
        
        if (wasMoving !== this.isMoving) {
          this.currentFrame = 1;
          this.useLegRubbing = !this.useLegRubbing;
          this.updateCursorImage();
        }
      });
    }, this.movementTimeout);
  }

  private forceHideSystemCursor() {
    const cursorStyle = 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'1\' height=\'1\'><rect width=\'1\' height=\'1\' fill=\'transparent\'/></svg>") 0 0, none';
    this.renderer.setStyle(this.document.body, 'cursor', cursorStyle);
    this.renderer.setStyle(this.document.documentElement, 'cursor', cursorStyle);
  }

  private setupCursorHiding() {
    const cursorStyle = 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'1\' height=\'1\'><rect width=\'1\' height=\'1\' fill=\'transparent\'/></svg>") 0 0, none';
    
    // 1. Monitor for DOM changes (Optimized: only sets style if needed)
    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as HTMLElement;
              // Only set if not already set (though setting it again is cheap)
              this.renderer.setStyle(element, 'cursor', cursorStyle);
            }
          });
        }
      });
    });

    this.observer.observe(this.document.body, {
      childList: true,
      subtree: true
    });

    // 2. Focus events
    this.ngZone.runOutsideAngular(() => {
        this.removeFocusInListener = this.renderer.listen('document', 'focusin', (event) => {
          const target = event.target as HTMLElement;
          if (target) {
            target.style.cursor = cursorStyle;
          }
        });
    });
  }

  ngOnDestroy() {
    if (this.animationInterval) clearInterval(this.animationInterval);
    if (this.movementTimer) clearTimeout(this.movementTimer);
    if (this.cursorHideInterval) clearInterval(this.cursorHideInterval); // Not used anymore but good practice
    if (this.removeMouseMoveListener) this.removeMouseMoveListener();
    if (this.removeFocusInListener) this.removeFocusInListener();
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    if (this.observer) this.observer.disconnect();
  }
}
