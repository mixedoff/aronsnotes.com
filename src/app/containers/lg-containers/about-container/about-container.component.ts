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

  navigateToProjects() {
    this.router.navigate(['/theory/projects']);
  }

  closeSubmenu() {
    console.log('closeSubmenu');
    this.closeSubmenuEvent.emit(true);
    this.router.navigate(['/quit']);
  }
  isTyping = false;
  currentProfileImage = 'assets/img/profile-picture/blinking-long2.gif';
  isSuperpowerExpanded = false;
  isWeakspotExpanded = false;
  isPowerUpAnimating = false;
  isPowerDownAnimating = false;

  ngOnInit() {
    this.typeText();
  }

  toggleSuperpower() {
    this.isSuperpowerExpanded = !this.isSuperpowerExpanded;
  }

  toggleWeakspot() {
    this.isWeakspotExpanded = !this.isWeakspotExpanded;
  }

  typeText() {
    this.isTyping = true;
    // Duration of typing animation (adjust as needed)
    setTimeout(() => {
      this.isTyping = false;
    }, 3000); // 3 seconds typing effect
  }

  changeProfileImageToPowerUp() {
    this.isPowerUpAnimating = true;
    this.currentProfileImage = 'assets/img/profile-picture/power-up4.gif';

    setTimeout(() => {
      this.currentProfileImage = 'assets/img/profile-picture/blinking-long2.gif';
      this.isPowerUpAnimating = false;
    }, 5700);
  }

  changeProfileImageToPowerDown() {
    this.isPowerDownAnimating = true;
    this.currentProfileImage = 'assets/img/profile-picture/power-down5.gif';
    
    setTimeout(() => {
      this.currentProfileImage = 'assets/img/profile-picture/blinking-long2.gif';
      this.isPowerDownAnimating = false;
    }, 5700);
  }


}
