import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-matrix-typing',
  standalone: true,
  imports: [],
  templateUrl: './matrix-typing.component.html',
  styleUrl: './matrix-typing.component.css',
})
export class MatrixTypingComponent implements OnInit {
  wakeUpText = '';
  matrixText = '';
  showMatrixText = false;
  fadeAllText = false;
  private wakeUpFullText = 'Wake up, Neo...';
  private matrixFullText = 'The Matrix has you...';

  ngOnInit() {
    this.typeText('wakeUpText', this.wakeUpFullText, 0, 100);
  }

  private typeText(
    property: 'wakeUpText' | 'matrixText',
    fullText: string,
    index: number,
    delay: number
  ) {
    if (index < fullText.length) {
      this[property] += fullText.charAt(index);
      setTimeout(() => {
        this.typeText(property, fullText, index + 1, delay);
      }, delay);
    } else if (property === 'wakeUpText') {
      setTimeout(() => {
        this.showMatrixText = true;
        this.typeText('matrixText', this.matrixFullText, 0, 100);
      }, 2000);
    } else if (property === 'matrixText') {
      setTimeout(() => {
        this.fadeAllText = true;
      }, 2000);
    }
  }
}
