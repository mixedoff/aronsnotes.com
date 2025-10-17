import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  Input,
} from '@angular/core';

declare const p5: any;

@Component({
  selector: 'app-singularity-visualization',
  standalone: true,
  template: `
    <div class="visualization-container">
      <div #p5Container></div>
    </div>
  `,
  styles: [
    `
      .visualization-container {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 2rem 0;
      }
    `,
  ],
})
export class SingularityVisualizationComponent implements OnInit, OnDestroy {
  @ViewChild('p5Container', { static: true })
  p5Container!: ElementRef<HTMLDivElement>;
  @Input() width = 400;
  @Input() height = 300;
  @Input() updateInterval = 50;

  private p5Instance: any;
  private secondsRadius: number = 0;
  private minutesRadius: number = 0;
  private hoursRadius: number = 0;
  private clockDiameter: number = 0;

  ngOnInit() {
    this.loadP5Script();
  }

  ngOnDestroy() {
    this.stopVisualization();
  }

  private loadP5Script() {
    if (typeof p5 !== 'undefined') {
      this.initP5();
    } else {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.7.0/p5.min.js';
      script.onload = () => this.initP5();
      document.head.appendChild(script);
    }
  }

  private initP5() {
    this.p5Instance = new p5((p: any) => {
      p.setup = () => {
        const canvas = p.createCanvas(this.width, this.height);
        canvas.parent(this.p5Container.nativeElement);
        p.stroke(111, 250, 30);
        p.angleMode(p.DEGREES);

        // Set radius for each shape based on canvas dimensions
        const radius = Math.min(this.width, this.height) / 2;
        this.secondsRadius = radius * 0.71;
        this.minutesRadius = radius * 0.6;
        this.hoursRadius = radius * 0.5;
        this.clockDiameter = radius * 1.7;
      };

      p.draw = () => {
        this.drawClock(p);
      };
    });
  }

  private drawClock(p: any) {

    // Move origin to center of canvas
    p.translate(this.width / 2, this.height / 2);

    // Draw the clock background with singularity-themed colors
    p.noStroke();
    // p.fill(244, 122, 158); // Outer ring
    p.ellipse(0, 0, this.clockDiameter + 25, this.clockDiameter + 25);
    // p.fill(237, 34, 93); // Inner circle
    p.fill(9, 21, 34); // Inner circle
    p.ellipse(0, 0, this.clockDiameter, this.clockDiameter);

    // Calculate angle for each hand (backwards and fast)
    const fastTime = p.millis() * 0.001; // Speed multiplier for fast movement
    const secondAngle = p.map((fastTime * 60) % 60, 0, 60, 0, 360);
    const minuteAngle = p.map((fastTime * 15 + p.sin(fastTime * 0.5) * 10) % 60, 0, 60, 0, 360); // Wavy movement
    const hourAngle = p.map((fastTime * 2) % 12, 0, 12, 0, 360);

    p.stroke(111, 250, 30);

    // Second hand (fastest - represents accelerating change)
    p.push();
    p.rotate(-secondAngle); // Negative angle for backwards rotation
    p.strokeWeight(1);
    p.line(0, 0, 0, -this.secondsRadius);
    p.pop();

    // Minute hand (medium speed)
    p.push();
    p.strokeWeight(2);
    p.rotate(-minuteAngle); // Negative angle for backwards rotation
    p.line(0, 0, 0, -this.minutesRadius);
    p.pop();

    // Hour hand (slowest - represents long-term trends)
    p.push();
    p.strokeWeight(4);
    p.rotate(-hourAngle); // Negative angle for backwards rotation
    p.line(0, 0, 0, -this.hoursRadius);
    p.pop();

    // Tick markers around perimeter of clock (representing time progression)
    p.push();
    p.strokeWeight(2);
    for (let ticks = 0; ticks < 60; ticks += 1) {
      p.point(0, -this.secondsRadius);
      p.rotate(6);
    }
    p.pop();

    // Add "2049" text in the center with bottom margin
    p.push();
    p.fill(111, 250, 30); // Same green color as the hands
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(this.clockDiameter * 0.10); // Scale text size with clock
    p.text("2049", 0, this.clockDiameter * -0.175); // Move text down by 5% of clock diameter
    p.pop();
    p.textFont("IBM Plex Mono");
  }

  private stopVisualization() {
    if (this.p5Instance) {
      this.p5Instance.remove();
    }
  }
}
