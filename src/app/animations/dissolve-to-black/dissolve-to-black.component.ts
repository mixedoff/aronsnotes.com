import { Component } from '@angular/core';

@Component({
  selector: 'app-dissolve-to-black',
  standalone: true,
  imports: [],
  templateUrl: './dissolve-to-black.component.html',
  styleUrl: './dissolve-to-black.component.css',
})
export class DissolveToBlackComponent {
  ngOnInit(): void {
    setTimeout(() => {
      this.triggerDissolve();
    }, 3000); // Delay of 500ms before starting the dissolve animation
  }

  triggerDissolve() {
    const overlay = document.getElementById('black-overlay');
    if (overlay) {
      overlay.classList.add('dissolve-active');
      setTimeout(() => {}, 500); // Navigate after the dissolve animation completes (500ms duration)
    }
  }
}
