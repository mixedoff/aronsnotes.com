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
    <h1 class="mt-1">Hey, I'm Aron</h1>
    <br>
    <p>I am a Creative Developer [ Front-end Developer, Product Designer ] currently working on my startup @ <a href="https://careeverz.com" target="_blank" rel="noopener noreferrer">CareeVerz.com</a></p>
    <br>
    <p>aronsnotes.com is my effort to nerd deep into making great web designs.</p>
    <br>
    <p>My best Product Design is <a href="https://careeverz.com" target="_blank" rel="noopener noreferrer">CareeVerz.com</a> an AI career counselling web-app. Check out the live site.</p>
    <br>
    <p>My best front-end is this site. I have designed, developed and deployed it from scratch using Figma, Angular and deployed it using Hetzner Cloud and Nginx. Check out the code by clicking on the Github icon below.</p>
    <br>
    <p>Or connect with me through my socials below.</p>
    <br>
  `;

  ngOnInit() {
    this.typeText();
  }

  typeText(index: number = 0, interval: number = 1) {
    if (index < this.aboutFullText.length) {
      this.aboutText += this.aboutFullText.charAt(index);
      setTimeout(() => this.typeText(index + 1, interval), interval);
    }
  }
}
