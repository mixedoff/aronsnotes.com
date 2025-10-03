import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-about-container',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about-container.component.html',
  styleUrl: './about-container.component.css',
})
export class AboutContainerComponent implements OnInit {
  @Output() closeSubmenuEvent = new EventEmitter<boolean>();

  constructor(private router: Router) {}

  clickHiddenScreen() {
    this.router.navigate(['/hidden']);
  }

  navigateToSkills() {
    this.router.navigate(['/theory']);
  }

  closeSubmenu() {
    console.log('closeSubmenu');
    this.closeSubmenuEvent.emit(true);
    this.router.navigate(['/quit']);
  }
  showAboutText = false;
  aboutText = '';
  private aboutFullText = `
    <h1 class="mt-1">aron kovacs</h1>

<p><strong>creative developer (tank)</strong></p>

<blockquote>
Tanks are designed to absorb damage by forging ahead into the unknown.
</blockquote>

<p><strong>My superpower:</strong> casting visions—novel solutions to complex problems. These visions pull me forward, and I, in turn, pull others along with me.</p>

<p><strong>My weak spot:</strong> underestimating the sheer effort required to bring these visions to life. Perhaps that's why I leap into the unknown so eagerly.</p>

<p><strong>Core competencies:</strong> Product Management, Product Design, Front-end Development, Content Creation</p>

<p><strong>Current tools:</strong>  
Figma, Angular, Hetzner, Cursor IDE, Google Workspace
</p>


<h2>Featured Works</h2>
<h3 class="mt-0"> <a href="https://careeverz.com" target="_blank" rel="noopener noreferrer">CareeVerz.com</a></h3>
<p><strong>Vision:</strong> Gamifying work.</p>
<p><strong>Role:</strong> Founder, Research & Development, Product Manager, Product Designer, Front-end Developer
<p><strong>Milestones:</strong></p>
<p>- Launched a complex AI-driven career counseling app</p>
<p>- Led research & development</p>
<p>- Recruited and led a multidisciplinary team of 4</p>
<p>- Designed and executed the UX/UI process</p>
<p>- Helped to develop the front-end</p>
</p>

<p><strong>Tech stack:</strong>  
Figma, Angular, .NET, Azure, Docker, Harness ML, Hetzner, Google OAuth, Stripe, Brevo  
</p>

<h3> <a href="https://aronsnotes.com" target="_blank" rel="noopener noreferrer">aronsnotes.com</a></h3>
<p><strong>Vision:</strong> Gamifying my character development.</p>
<p><strong>Role:</strong> Solopreneur, Product Designer, Front-end Developer, Back-end Developer, Content Creator
</p>

<p><strong>Tech stack:</strong>  
Figma, Angular, Hetzner Cloud, Nginx  
</p>

<h2>Let's connect</h2>
<p>Feel free to reach out through my <strong>socials</strong> below!</p>

  `;

  ngOnInit() {
    this.typeText();
  }

  typeText(index: number = 0, interval: number = 1, chunkSize: number = 5) {
    if (index < this.aboutFullText.length) {
      const chunk = this.aboutFullText.substr(index, chunkSize);
      this.aboutText += chunk;
      setTimeout(
        () => this.typeText(index + chunkSize, interval, chunkSize),
        interval
      );
    }
  }


}
