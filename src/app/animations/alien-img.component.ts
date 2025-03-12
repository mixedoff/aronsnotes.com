import { Component } from '@angular/core';

@Component({
  selector: 'app-alien-image',
  standalone: true,
  template: ` <div class="alien-container"></div> `,
  styles: [
    `
      .alien-container {
        width: 300px; /* adjust to your image size */
        height: 300px; /* adjust to your image size */
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        animation: changeAlien 3s infinite steps(1);
      }

      @keyframes changeAlien {
        0% {
          background-image: url('/assets/img/article15/alien1.png');
        }
        33.33% {
          background-image: url('/assets/img/article15/alien2.png');
        }
        66.66% {
          background-image: url('/assets/img/article15/alien3.png');
        }
      }
    `,
  ],
})
export class AlienImageComponent {}
