import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  Input,
} from '@angular/core';

@Component({
  selector: 'app-game-of-life',
  standalone: true,
  template: `
    <div class="game-container">
      <canvas #gameCanvas [width]="width" [height]="height"></canvas>
    </div>
  `,
  styles: [
    `
      .game-container {
        display: flex;
        justify-content: center;
        align-items: center;
      }
    `,
  ],
})
export class GameOfLifeComponent implements OnInit, OnDestroy {
  @ViewChild('gameCanvas', { static: true })
  canvasRef!: ElementRef<HTMLCanvasElement>;
  @Input() width = 300;
  @Input() height = 300;
  @Input() cellSize = 5;
  @Input() updateInterval = 100;

  private ctx!: CanvasRenderingContext2D;
  private grid: boolean[][] = [];
  private intervalId: any;

  ngOnInit() {
    this.ctx = this.canvasRef.nativeElement.getContext('2d')!;
    this.initGrid();
    this.populateRandomCells();
    this.startSimulation();
  }

  ngOnDestroy() {
    this.stopSimulation();
  }

  private initGrid() {
    const cols = Math.floor(this.width / this.cellSize);
    const rows = Math.floor(this.height / this.cellSize);

    this.grid = Array(rows)
      .fill(null)
      .map(() => Array(cols).fill(false));
  }

  private populateRandomCells() {
    const rows = this.grid.length;
    const cols = this.grid[0].length;

    // Initialize with random pattern
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        this.grid[y][x] = Math.random() > 0.8;
      }
    }

    this.drawGrid();
  }

  private drawGrid() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    const rows = this.grid.length;
    const cols = this.grid[0].length;

    this.ctx.fillStyle = '#6fce91';

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        if (this.grid[y][x]) {
          this.ctx.fillRect(
            x * this.cellSize,
            y * this.cellSize,
            this.cellSize - 1,
            this.cellSize - 1
          );
        }
      }
    }
  }

  private updateGrid() {
    const rows = this.grid.length;
    const cols = this.grid[0].length;
    const newGrid = Array(rows)
      .fill(null)
      .map(() => Array(cols).fill(false));

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const neighbors = this.countNeighbors(x, y);

        if (this.grid[y][x]) {
          // Cell is alive
          newGrid[y][x] = neighbors === 2 || neighbors === 3;
        } else {
          // Cell is dead
          newGrid[y][x] = neighbors === 3;
        }
      }
    }

    this.grid = newGrid;
    this.drawGrid();
  }

  private countNeighbors(x: number, y: number): number {
    const rows = this.grid.length;
    const cols = this.grid[0].length;
    let count = 0;

    for (let yOffset = -1; yOffset <= 1; yOffset++) {
      for (let xOffset = -1; xOffset <= 1; xOffset++) {
        if (xOffset === 0 && yOffset === 0) continue;

        const newX = (x + xOffset + cols) % cols;
        const newY = (y + yOffset + rows) % rows;

        if (this.grid[newY][newX]) {
          count++;
        }
      }
    }

    return count;
  }

  private startSimulation() {
    this.intervalId = setInterval(() => {
      this.updateGrid();
    }, this.updateInterval);
  }

  private stopSimulation() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
