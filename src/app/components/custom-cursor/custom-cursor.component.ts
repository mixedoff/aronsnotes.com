import { Component, OnInit, OnDestroy, HostListener, Renderer2, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-custom-cursor',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="custom-cursor" [class.clickable]="isOverClickable">
      <img 
        [src]="currentCursorImage" 
        alt="cursor"
        class="cursor-image"
        [class.animated]="!isOverClickable"
      />
    </div>
  `,
  styles: [`
    .custom-cursor {
      position: fixed;
      top: -20px;
      left: 0px;
      width: 32px;
      height: 32px;
      pointer-events: none;
      z-index: 9999;
      transition: transform 0.1s ease-out;
      transform: translate(-50%, -50%);
      background: transparent !important;
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

    /* Hide the default cursor globally */
    * {
      cursor: none !important;
    }

    /* Ensure no cursor shows anywhere */
    html, body, div, span, button, a, input, textarea, select, img, svg {
      cursor: none !important;
    }
  `]
})
export class CustomCursorComponent implements OnInit, OnDestroy {
  cursorX: number = 0;
  cursorY: number = 0;
  targetX: number = 0;
  targetY: number = 0;
  isOverClickable: boolean = false;
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

  constructor(
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {}

  get currentCursorImage(): string {
    if (this.isOverClickable) {
      // Use slurping animation when over clickable elements (frames 00-14)
      const frameNumber = (this.currentFrame - 1).toString().padStart(2, '0');
      return `/assets/img/cursor/fly_slurping_frame_${frameNumber}.png`;
    }
    
    if (!this.isMoving) {
      // Use alternating rubbing animations when not moving
      const frameNumber = (this.currentFrame - 1).toString().padStart(2, '0');
      if (this.useLegRubbing) {
        return `/assets/img/cursor/fly_leg_rubbing_frame_${this.currentFrame - 1}.png`;
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
    this.targetX = event.clientX;
    this.targetY = event.clientY;
    
    // Reset movement timer
    const wasMoving = this.isMoving;
    this.isMoving = true;
    
    // Reset frame if switching from stopped to moving
    if (wasMoving !== this.isMoving) {
      this.currentFrame = 1;
    }
    
    this.resetMovementTimer();
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
    // Apply delay using lerp (linear interpolation)
    const lerp = (start: number, end: number, factor: number) => {
      return start + (end - start) * factor;
    };

    const factor = 0.1; // Adjust this value to change delay sensitivity (0.05 = more delay, 0.2 = less delay)
    
    this.cursorX = lerp(this.cursorX, this.targetX, factor);
    this.cursorY = lerp(this.cursorY, this.targetY, factor);

    // Update the cursor element position
    const cursorElement = this.document.querySelector('.custom-cursor') as HTMLElement;
    if (cursorElement) {
      this.renderer.setStyle(cursorElement, 'transform', `translate(${this.cursorX}px, ${this.cursorY}px) translate(-50%, -50%)`);
    }
  }

  ngOnInit() {
    // Initialize cursor position to center of screen
    this.cursorX = window.innerWidth / 2;
    this.cursorY = window.innerHeight / 2;
    this.targetX = this.cursorX;
    this.targetY = this.cursorY;
    
    // Start the animated cursor
    this.startAnimation();
    
    // Start movement timer
    this.resetMovementTimer();

    // Start the position update loop
    this.updateCursorPosition();
    setInterval(() => {
      this.updateCursorPosition();
    }, 16); // ~60fps update rate
  }

  ngOnDestroy() {
    // Stop animation when component is destroyed
    this.stopAnimation();
  }
} 