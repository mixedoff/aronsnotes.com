import { Component, OnInit, OnDestroy, HostListener, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bezier-screensaver',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="screensaver-overlay" [class.active]="isActive" (click)="deactivate()">
      <canvas #screensaverCanvas class="screensaver-canvas"></canvas>
      <div class="screensaver-text">
        <p>wake up Neo</p>
      </div>
      <!-- Flickering aronsnotes title at bottom -->
      <div class="bottom-nav-holder">
        <div class="bottom-nav">
          <p class="flicker">aronsnotes.com</p>
        </div>
      </div>
      <!-- Test indicator -->
      <div class="test-indicator" *ngIf="!isActive">
        Screensaver Ready (will activate in {{ INACTIVITY_TIMEOUT / 1000 }}s)
      </div>
    </div>
  `,
  styles: [
    `
      .screensaver-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: #f0f0f0;
        z-index: 99999;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.5s ease-in-out, visibility 0.5s ease-in-out;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        cursor: none;
        animation: crtFlicker 0.15s infinite;
        pointer-events: none;
        backdrop-filter: blur(0px);
      }

      .screensaver-overlay.active {
        opacity: 1;
        visibility: visible;
        pointer-events: auto;
        background: #f0f0f0;
        backdrop-filter: blur(0px);
      }

      /* Solid background layer to completely block previous content */
      .screensaver-overlay.active::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #f0f0f0;
        z-index: 1;
        pointer-events: none;
      }

      .screensaver-canvas {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 2;
        filter: contrast(1.1) brightness(1.05) saturate(1.2);
      }

      .screensaver-text {
        position: relative;
        z-index: 7;
        text-align: center;
        color: var(--text-color, #080a19);
        background: none;
        pointer-events: none;
        animation: textFloat 4s ease-in-out infinite;
      }

      .screensaver-text p {
        font-family: "IBM Plex Mono";
        font-size: 1.5rem;
        font-weight: 500;
        margin: 2rem 0 0 0;
        opacity: 0.8;
        text-transform: lowercase;
        letter-spacing: 0.05rem;
        animation: textPulse 2s ease-in-out infinite;
      }

      /* Bottom nav styling matching quit page */
      .bottom-nav-holder {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        z-index: 8;
        pointer-events: none;
        background: none;
      }

      .bottom-nav {
        display: flex;
        height: 40px;
        padding: 10px 20px;
        justify-content: center;
        align-items: center;
        background: none;
      }

      .bottom-nav p {
        color: #6ffa1e;
        font-family: "IBM Plex Mono";
        font-size: 1rem;
        margin: 0;
        text-transform: lowercase;
        cursor: pointer;
        pointer-events: auto;
      }

      @keyframes flicker {
        0% {
          opacity: 0.4;
          text-shadow: none;
        }
        19.9%, 22%, 62.9%, 64%, 64.9%, 70%, 100% {
          opacity: 0.99;
          text-shadow: 
            -1px -1px 0 rgba(111, 250, 30, 0.4), 
            1px -1px 0 rgba(111, 250, 30, 0.4), 
            -1px 1px 0 rgba(111, 250, 30, 0.4), 
            1px 1px 0 rgba(111, 250, 30, 0.4), 
            0 -2px 8px #6ffa1e,
            0 0 2px #6ffa1e,
            0 0 5px #6ffa1e, 
            0 0 15px #6ffa1e, 
            0 0 2px #6ffa1e, 
            0 2px 3px #000;
        }
        20%, 21.9%, 63%, 63.9%, 65%, 69.9% {
          opacity: 0.4;
          text-shadow: none;
        }
      }

      .flicker {
        animation: flicker 3s infinite;
        animation-delay: 6s;
        animation-fill-mode: both;
        transition: color 0.15s cubic-bezier(0.36, 2.09, 0.07, -1.52);
      }

      .flicker:hover {
        animation: flicker 2s infinite;
        animation-delay: 0s;
      }

      @keyframes textFloat {
        0%, 100% {
          transform: translateY(0px);
        }
        50% {
          transform: translateY(-10px);
        }
      }

      @keyframes textPulse {
        0%, 100% {
          opacity: 0.8;
        }
        50% {
          opacity: 1;
        }
      }

      @keyframes crtFlicker {
        0%, 100% {
          opacity: 1;
          filter: brightness(1) contrast(1.1);
        }
        50% {
          opacity: 0.98;
          filter: brightness(1.05) contrast(1.15);
        }
        25%, 75% {
          opacity: 0.99;
          filter: brightness(1.02) contrast(1.12);
        }
      }

      /* Add retro scanlines overlay */
      .screensaver-overlay::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: repeating-linear-gradient(
          0deg,
          transparent,
          transparent 2px,
          rgba(0, 0, 0, 0.03) 2px,
          rgba(0, 0, 0, 0.03) 4px
        );
        pointer-events: none;
        z-index: 5;
        animation: scanlineMove 10s linear infinite;
      }

      /* Add subtle white light flash overlay for CRT effect */
      .screensaver-overlay::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: radial-gradient(
          circle at 50% 50%,
          rgba(255, 255, 255, 0.02) 0%,
          rgba(255, 255, 255, 0.01) 30%,
          rgba(255, 255, 255, 0.005) 60%,
          transparent 100%
        );
        pointer-events: none;
        z-index: 6;
        animation: whiteLightFlicker 0.15s infinite;
        mix-blend-mode: screen;
      }

      @keyframes whiteLightFlicker {
        0%, 100% {
          opacity: 0.3;
          transform: scale(1);
        }
        50% {
          opacity: 0.6;
          transform: scale(1.02);
        }
        25%, 75% {
          opacity: 0.4;
          transform: scale(1.01);
        }
      }

      @keyframes scanlineMove {
        0% {
          transform: translateY(0);
        }
        100% {
          transform: translateY(4px);
        }
      }

      /* Mobile responsiveness */
      @media (max-width: 768px) {
        .screensaver-text h1 {
          font-size: 4rem;
        }
        
        .screensaver-text p {
          font-size: 1.25rem;
        }
      }

      .test-indicator {
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(8, 10, 25, 0.9);
        color: white;
        padding: 10px 15px;
        border-radius: 5px;
        font-family: "IBM Plex Mono";
        font-size: 0.9rem;
        z-index: 9;
        pointer-events: none;
        border: 2px solid #4a90e2;
      }
    `
  ]
})
export class BezierScreensaverComponent implements OnInit, OnDestroy {
  @ViewChild('screensaverCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private animationId: number = 0;
  private inactivityTimer: any;
  readonly INACTIVITY_TIMEOUT = 20000*60; // 20 seconds * 60 = 1200 seconds
  
  isActive = false;
  
  // Bezier curve properties
  private curves: Array<{
    points: Array<{ x: number; y: number }>;
    color: string;
    thickness: number;
    speed: number;
    phase: number;
    age: number;
    maxAge: number;
    replicationTimer: number;
    children: Array<{
      points: Array<{ x: number; y: number }>;
      color: string;
      thickness: number;
      speed: number;
      phase: number;
      age: number;
      maxAge: number;
    }>;
  }> = [];
  
  private readonly COLORS = [
    '#080a19', // Your app's text color (black)
    '#32cd32'  // Lime green for the special curve
  ];

  private readonly CURVE_LIFESPAN = 15000; // 15 seconds per curve
  private readonly REPLICATION_INTERVAL = 8000; // 8 seconds between replications

  constructor(private renderer: Renderer2) {
    console.log('BezierScreensaver constructor called');
  }

  ngOnInit() {
    console.log('BezierScreensaver ngOnInit called');
    this.setupCanvas();
    this.initializeCurves();
    this.startInactivityTimer();
    this.startAnimation();
    
    // Test code removed
  }

  ngOnDestroy() {
    console.log('BezierScreensaver ngOnDestroy called');
    this.stopInactivityTimer();
    this.stopAnimation();
  }

  @HostListener('document:mousemove')
  @HostListener('document:keydown')
  @HostListener('document:click')
  @HostListener('document:scroll')
  @HostListener('document:touchstart')
  onActivity() {
    if (this.isActive) {
      this.deactivate();
    }
    this.resetInactivityTimer();
  }

  private setupCanvas() {
    console.log('Setting up canvas');
    this.canvas = this.canvasRef.nativeElement;
    this.ctx = this.canvas.getContext('2d')!;
    
    if (!this.ctx) {
      console.error('Failed to get canvas context');
      return;
    }
    
    console.log('Canvas context obtained successfully');
    
    // Set canvas size to match viewport
    this.resizeCanvas();
    
    // Handle window resize
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  private resizeCanvas() {
    console.log('Resizing canvas to', window.innerWidth, 'x', window.innerHeight);
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  private initializeCurves() {
    this.curves = [];
    
    // Create multiple bezier curves with different properties
    for (let i = 0; i < 6; i++) {
      // Make the first curve green, rest black
      const isGreenCurve = i === 0;
      const curveColor = isGreenCurve ? '#32cd32' : '#080a19';
      
      this.curves.push({
        points: this.generateComplexPoints(),
        color: curveColor,
        thickness: isGreenCurve ? Math.random() * 2 + 1 : Math.random() * 2 + 0.5, // Green curve slightly thicker
        speed: Math.random() * 0.005 + 0.002, // Much slower movement
        phase: Math.random() * Math.PI * 2,
        age: 0,
        maxAge: this.CURVE_LIFESPAN,
        replicationTimer: 0,
        children: []
      });
    }
  }

  private generateComplexPoints(): Array<{ x: number; y: number }> {
    const points = [];
    const numPoints = Math.floor(Math.random() * 4) + 6; // 6-9 points for more complex curves
    
    // Create a more organic, flowing pattern
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const radius = Math.min(window.innerWidth, window.innerHeight) * 0.3;
    
    for (let i = 0; i < numPoints; i++) {
      const angle = (i / (numPoints - 1)) * Math.PI * 2;
      const randomRadius = radius * (0.5 + Math.random() * 0.5);
      
      points.push({
        x: centerX + Math.cos(angle) * randomRadius + (Math.random() - 0.5) * 200,
        y: centerY + Math.sin(angle) * randomRadius + (Math.random() - 0.5) * 200
      });
    }
    
    return points;
  }

  private startInactivityTimer() {
    console.log('Starting inactivity timer for', this.INACTIVITY_TIMEOUT, 'ms');
    this.inactivityTimer = setTimeout(() => {
      console.log('Inactivity timeout reached, activating screensaver');
      this.activate();
    }, this.INACTIVITY_TIMEOUT);
  }

  private resetInactivityTimer() {
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
    }
    this.startInactivityTimer();
  }

  private stopInactivityTimer() {
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
    }
  }

  private activate() {
    console.log('Activating screensaver');
    this.isActive = true;
    this.initializeCurves(); // Reset curves for new session
  }

  deactivate() {
    console.log('Deactivating screensaver');
    this.isActive = false;
    this.resetInactivityTimer();
  }

  private startAnimation() {
    console.log('Starting animation loop');
    const animate = () => {
      if (this.isActive) {
        this.updateCurves();
        this.draw();
      }
      this.animationId = requestAnimationFrame(animate);
    };
    animate();
  }

  private updateCurves() {
    const currentTime = Date.now();
    
    this.curves.forEach((curve, index) => {
      // Update age
      curve.age += 16; // 60fps = ~16ms per frame
      
      // Check if curve should replicate
      curve.replicationTimer += 16;
      if (curve.replicationTimer >= this.REPLICATION_INTERVAL) {
        this.replicateCurve(curve);
        curve.replicationTimer = 0;
      }
      
      // Remove old curves and their children
      if (curve.age >= curve.maxAge) {
        this.curves.splice(index, 1);
        return;
      }
      
      // Update children
      curve.children.forEach((child, childIndex) => {
        child.age += 16;
        if (child.age >= child.maxAge) {
          curve.children.splice(childIndex, 1);
        }
      });
    });
    
    // Add new curves if we have too few
    if (this.curves.length < 4) {
      this.addNewCurve();
    }
  }

  private replicateCurve(parentCurve: any) {
    // Children inherit the parent's color to maintain the theme
    const child = {
      points: this.generateChildPoints(parentCurve.points),
      color: parentCurve.color, // Inherit parent color
      thickness: Math.max(0.2, parentCurve.thickness * (0.7 + Math.random() * 0.6)),
      speed: parentCurve.speed * (0.8 + Math.random() * 0.4),
      phase: parentCurve.phase + Math.random() * Math.PI,
      age: 0,
      maxAge: this.CURVE_LIFESPAN * 0.7 // Children live shorter lives
    };
    
    parentCurve.children.push(child);
  }

  private generateChildPoints(parentPoints: Array<{ x: number; y: number }>): Array<{ x: number; y: number }> {
    const childPoints = [];
    const numPoints = Math.floor(Math.random() * 3) + 4;
    
    for (let i = 0; i < numPoints; i++) {
      const parentIndex = Math.floor((i / (numPoints - 1)) * (parentPoints.length - 1));
      const parentPoint = parentPoints[parentIndex];
      
      childPoints.push({
        x: parentPoint.x + (Math.random() - 0.5) * 100,
        y: parentPoint.y + (Math.random() - 0.5) * 100
      });
    }
    
    return childPoints;
  }

  private addNewCurve() {
    // Maintain color balance: mostly black curves with occasional green
    const shouldBeGreen = Math.random() < 0.2; // 20% chance of green
    const curveColor = shouldBeGreen ? '#32cd32' : '#080a19';
    
    this.curves.push({
      points: this.generateComplexPoints(),
      color: curveColor,
      thickness: shouldBeGreen ? Math.random() * 2 + 1 : Math.random() * 2 + 0.5,
      speed: Math.random() * 0.005 + 0.002,
      phase: Math.random() * Math.PI * 2,
      age: 0,
      maxAge: this.CURVE_LIFESPAN,
      replicationTimer: 0,
      children: []
    });
  }

  private stopAnimation() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }

  private draw() {
    if (!this.ctx) {
      console.error('No canvas context available for drawing');
      return;
    }
    
    // Clear canvas with semi-transparent background for trail effect
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw each bezier curve and its children
    this.curves.forEach((curve, index) => {
      this.drawBezierCurve(curve, index);
      
      // Draw children
      curve.children.forEach((child, childIndex) => {
        this.drawBezierCurve(child, childIndex, true);
      });
    });
    
    // Add 90s-style scanlines effect
    this.drawScanlines();
    
    // Add CRT glow effect
    this.drawCRTEffect();
  }

  private drawBezierCurve(curve: any, index: number, isChild: boolean = false) {
    const time = Date.now() * curve.speed + curve.phase;
    const ageProgress = curve.age / curve.maxAge;
    
    // Create complex, organic movement patterns
    const animatedPoints = curve.points.map((point: any, i: number) => {
      const baseX = point.x;
      const baseY = point.y;
      
      // Multiple layers of movement for organic feel
      const layer1 = Math.sin(time * 0.3 + i * 0.5) * 60;
      const layer2 = Math.cos(time * 0.2 + i * 0.3) * 40;
      const layer3 = Math.sin(time * 0.1 + i * 0.7) * 30;
      const layer4 = Math.cos(time * 0.15 + i * 0.4) * 25;
      
      // Add spiral-like movement
      const spiralRadius = 20 + Math.sin(time * 0.05 + i) * 15;
      const spiralAngle = time * 0.02 + i * 0.8;
      const spiralX = Math.cos(spiralAngle) * spiralRadius;
      const spiralY = Math.sin(spiralAngle) * spiralRadius;
      
      // Combine all movement layers
      return {
        x: baseX + layer1 + layer2 + layer3 + layer4 + spiralX,
        y: baseY + layer2 + layer3 + layer1 + layer4 + spiralY
      };
    });
    
    // Calculate opacity based on age and child status
    const opacity = isChild ? 
      Math.max(0.3, 1 - ageProgress) * 0.7 : 
      Math.max(0.5, 1 - ageProgress);
    
    // Draw bezier curve with enhanced styling
    this.ctx.beginPath();
    this.ctx.strokeStyle = this.hexToRgba(curve.color, opacity);
    this.ctx.lineWidth = curve.thickness;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    
    if (animatedPoints.length === 4) {
      // Cubic bezier curve
      this.ctx.moveTo(animatedPoints[0].x, animatedPoints[0].y);
      this.ctx.bezierCurveTo(
        animatedPoints[1].x, animatedPoints[1].y,
        animatedPoints[2].x, animatedPoints[2].y,
        animatedPoints[3].x, animatedPoints[3].y
      );
    } else if (animatedPoints.length === 3) {
      // Quadratic bezier curve
      this.ctx.moveTo(animatedPoints[0].x, animatedPoints[0].y);
      this.ctx.quadraticCurveTo(
        animatedPoints[1].x, animatedPoints[1].y,
        animatedPoints[2].x, animatedPoints[2].y
      );
    } else {
      // Complex curve through multiple points
      this.ctx.moveTo(animatedPoints[0].x, animatedPoints[0].y);
      
      // Use quadratic curves between points for smoother flow
      for (let i = 1; i < animatedPoints.length - 1; i++) {
        const current = animatedPoints[i];
        const next = animatedPoints[i + 1];
        const midX = (current.x + next.x) / 2;
        const midY = (current.y + next.y) / 2;
        
        this.ctx.quadraticCurveTo(current.x, current.y, midX, midY);
      }
      
      // Connect to the last point
      if (animatedPoints.length > 1) {
        this.ctx.lineTo(animatedPoints[animatedPoints.length - 1].x, animatedPoints[animatedPoints.length - 1].y);
      }
    }
    
    // Add glow effect before stroke
    this.ctx.shadowColor = curve.color;
    this.ctx.shadowBlur = 20;
    this.ctx.stroke();
    this.ctx.shadowBlur = 0;
    
    // Draw control points with pulsing effect (only for parent curves)
    if (!isChild) {
      animatedPoints.forEach((point: any, i: number) => {
        const pulseSize = 1.5 + Math.sin(time * 1.5 + i) * 1.5;
        this.ctx.beginPath();
        this.ctx.fillStyle = this.hexToRgba(curve.color, opacity * 0.8);
        this.ctx.arc(point.x, point.y, pulseSize, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Add inner highlight
        this.ctx.beginPath();
        this.ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.6})`;
        this.ctx.arc(point.x - pulseSize * 0.3, point.y - pulseSize * 0.3, pulseSize * 0.4, 0, Math.PI * 2);
        this.ctx.fill();
      });
    }
    
    // Draw connecting lines between control points with fade effect
    this.ctx.strokeStyle = this.hexToRgba(curve.color, opacity * 0.2);
    this.ctx.lineWidth = 0.5;
    this.ctx.setLineDash([3, 3]);
    this.ctx.lineDashOffset = time * 0.05;
    
    this.ctx.beginPath();
    this.ctx.moveTo(animatedPoints[0].x, animatedPoints[0].y);
    animatedPoints.forEach((point: any) => {
      this.ctx.lineTo(point.x, point.y);
    });
    this.ctx.stroke();
    this.ctx.setLineDash([]);
  }

  private drawScanlines() {
    this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
    this.ctx.lineWidth = 1;
    
    for (let y = 0; y < this.canvas.height; y += 3) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.canvas.width, y);
      this.ctx.stroke();
    }
  }

  private drawCRTEffect() {
    // Add subtle vignette effect
    const gradient = this.ctx.createRadialGradient(
      this.canvas.width / 2, this.canvas.height / 2, 0,
      this.canvas.width / 2, this.canvas.height / 2, Math.max(this.canvas.width, this.canvas.height) / 2
    );
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.2)');
    
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  private hexToRgba(hex: string, alpha: number): string {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result) {
      const r = parseInt(result[1], 16);
      const g = parseInt(result[2], 16);
      const b = parseInt(result[3], 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    return `rgba(0, 0, 0, ${alpha})`;
  }
}
