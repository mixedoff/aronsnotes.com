import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about-container',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about-container.component.html',
  styleUrl: './about-container.component.css',
})
export class AboutContainerComponent implements OnInit {
  @Output() closeSubmenuEvent = new EventEmitter<boolean>();
  closeSubmenu() {
    console.log('closeSubmenu');
    this.closeSubmenuEvent.emit(true);
  }
  showAboutText = false;
  aboutText = '';
  private aboutFullText = `
    <h1 class="mt-1">Hey, I'm Aron.</h1>
    <br>
    <p>I am a Front-end Developer / UX and UI designer / Product manager currently working on a startup at <a href="https://careeverz.com" target="_blank" rel="noopener noreferrer">CareeVerz.com</a></p>
    <br>
    <p>Aronsnotes.com is my effort to dive deep into technical topics to make great web designs.</p>
    <br>
    <p>I would love to connect: <a href="mailto:apple.aron@gmail.com">apple.aron@gmail.com</a></p>
    <br>
    <p>The site is designed and developed by me. Check out the code on <a href="https://github.com/mixedoff/aronsnotes.com" target="_blank">Github</a></p>
  `;

  ngOnInit() {
    this.typeText();
  }

  typeText(index: number = 0, interval: number = 20) {
    if (index < this.aboutFullText.length) {
      this.aboutText += this.aboutFullText.charAt(index);
      setTimeout(() => this.typeText(index + 1, interval), interval);
    }
  }
}
