import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about-container',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about-container.component.html',
  styleUrl: './about-container.component.css',
})
export class AboutContainerComponent implements OnInit {
  showAboutText = false;
  aboutText = '';
  private aboutFullText = `
    <h1 class="mt-1">Hey, my name is Aron.</h1>
    <br>
    <p>I am a Front-end Developer / UX and UI designer / Product manager currently working on my own startup at CareeVerz.com.</p>
    <br>
    <p>Aronsnotes.com is my effort to dive deep in technical topics on making great WebApps.</p>
    <br>
    <p>I would love to connect: <a href="mailto:apple.aron@gmail.com">apple.aron@gmail.com</a></p>
    <br>
    <p>The site is designed and developed by me. Check out the code on <a href="https://github.com/mixedoff/aronsnotes.com" target="_blank">Github</a></p>
  `;

  ngOnInit() {
    this.typeText();
  }

  typeText(index: number = 0, interval: number = 30) {
    if (index < this.aboutFullText.length) {
      this.aboutText += this.aboutFullText.charAt(index);
      setTimeout(() => this.typeText(index + 1, interval), interval);
    }
  }
}
