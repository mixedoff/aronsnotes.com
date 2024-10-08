import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about-container',
  standalone: true,
  imports: [],
  templateUrl: './about-container.component.html',
  styleUrl: './about-container.component.css',
})
export class AboutContainerComponent implements OnInit {
  showAboutText = false;
  aboutText = '';
  private aboutFullText = `
Hey, my name is Aron. I am a Creative Developer / UX and UI designer / Product manager currently working on my own startup at CareeVerz.com. 

Aronsnotes.com is my effort to dive deep in technical topics on making great WebApps.

Hit me up with an email at: apple.aron@gmail.com`;

  ngOnInit() {
    this.typeText('aboutText', this.aboutFullText, 0, 30);
  }

  typeText(
    aboutText: string,
    aboutFullText: string,
    index: number = 0,
    interval: number = 30
  ) {
    if (index < aboutFullText.length) {
      const element = document.getElementById('about-text');
      if (element) {
        element.innerHTML += aboutFullText.charAt(index);
        setTimeout(
          () => this.typeText(aboutText, aboutFullText, index + 1, interval),
          interval
        );
      }
    }
  }
}
