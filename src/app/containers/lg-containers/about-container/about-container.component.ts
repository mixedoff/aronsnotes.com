import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Project, PROJECTS } from '../../../data/projects.data';

@Component({
  selector: 'app-about-container',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about-container.component.html',
  styleUrl: './about-container.component.css',
})
export class AboutContainerComponent implements OnInit, OnDestroy {
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

  navigateToProjectLink(project: Project) {
    if (project.link) {
      window.open(project.link, '_blank', 'noopener,noreferrer');
    }
  }

  closeSubmenu() {
    console.log('closeSubmenu');
    this.closeSubmenuEvent.emit(true);
    this.router.navigate(['/quit']);
  }
  currentProfileImage = 'assets/img/profile-picture/blinking-long2.gif';
  isSuperpowerExpanded = false;
  isWeakspotExpanded = false;
  isPowerUpAnimating = false;
  isPowerDownAnimating = false;
  featuredProjects: Project[] = [];
  isExpanded = false;
  isLargeScreen = false;
  private resizeHandler = () => this.checkScreenSize();

  ngOnInit() {
    this.loadFeaturedProjects();
    this.checkScreenSize();
    window.addEventListener('resize', this.resizeHandler);
  }

  checkScreenSize() {
    this.isLargeScreen = window.innerWidth >= 1024;
    // If screen becomes small while expanded, collapse it
    if (!this.isLargeScreen && this.isExpanded) {
      this.isExpanded = false;
    }
  }

  toggleFullscreen() {
    if (!this.isLargeScreen) {
      return; // Disabled on small screens
    }
    this.isExpanded = !this.isExpanded;
  }

  loadFeaturedProjects() {
    this.featuredProjects = PROJECTS
      .filter(project => project.isFeatured)
      .sort((a, b) => (a.featuredOrder || 0) - (b.featuredOrder || 0));
  }

  rotateCards() {
    if (this.featuredProjects.length > 1) {
      // Move first card to the end
      const firstCard = this.featuredProjects.shift();
      if (firstCard) {
        this.featuredProjects.push(firstCard);
      }
    }
  }

  onCardClick(event: MouseEvent) {
    // Don't rotate if clicking on a link or button
    const target = event.target as HTMLElement;
    if (target.tagName === 'A' || target.closest('a') || target.tagName === 'BUTTON' || target.closest('button')) {
      return;
    }
    
    // Rotate cards on click
    this.rotateCards();
  }

  getCardIndex(index: number): number {
    return index;
  }

  getCardTransform(index: number): string {
    const offset = index * 10;
    const rotation = index * 1;
    return `translateY(${offset}px) rotate(${rotation}deg)`;
  }

  getCardBackgroundColor(project: Project): string {
    if (!project.category || project.category.length === 0) {
      return '#010689'; // Default color
    }
    
    const firstCategory = project.category[0];
    switch (firstCategory) {
      case 'design':
        return '#3a94de';
      case 'development':
        return '#6ffa1e';
      case 'writing':
        return '#4ecdc4';
      default:
        return '#010689'; // Default color
    }
  }

  shouldUseDarkText(project: Project): boolean {
    const bgColor = this.getCardBackgroundColor(project);
    // Return true if background is green (#6ffa1e) or cyan (#4ecdc4)
    // Design cards (blue #3a94de) always use white text
    return bgColor === '#6ffa1e' || bgColor === '#4ecdc4';
  }

  getCardTextColor(project: Project): string {
    // All cards use black text
    return '#080a19';
  }

  getCardBorderColor(project: Project): string {
    // All cards use black border
    return '#080a19';
  }

  getAllRoles(project: Project): string[] {
    const allRoles: string[] = [];
    if (project.designRoles) allRoles.push(...project.designRoles);
    if (project.developmentRoles) allRoles.push(...project.developmentRoles);
    if (project.writingRoles) allRoles.push(...project.writingRoles);
    if (project.otherRoles) allRoles.push(...project.otherRoles);
    return allRoles;
  }

  getRolesWithClasses(project: Project): Array<{role: string, chipClass: string}> {
    const rolesWithClasses: Array<{role: string, chipClass: string}> = [];
    if (project.designRoles) {
      project.designRoles.forEach(role => rolesWithClasses.push({role, chipClass: 'blue-chip'}));
    }
    if (project.developmentRoles) {
      project.developmentRoles.forEach(role => rolesWithClasses.push({role, chipClass: 'green-chip'}));
    }
    if (project.writingRoles) {
      project.writingRoles.forEach(role => rolesWithClasses.push({role, chipClass: 'cyan-chip'}));
    }
    if (project.otherRoles) {
      project.otherRoles.forEach(role => rolesWithClasses.push({role, chipClass: 'white-chip'}));
    }
    return rolesWithClasses;
  }

  getRolesString(roles: string[]): string {
    return roles.map(role => this.capitalizeFirst(role)).join(', ');
  }

  getTechStackString(techStack?: string[]): string {
    return techStack ? techStack.join(', ') : '';
  }

  capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  getAnimationPath(project: Project): string {
    return project.animationGif ? `/assets/gif/${project.animationGif}` : '';
  }

  toggleSuperpower() {
    this.isSuperpowerExpanded = !this.isSuperpowerExpanded;
  }

  toggleWeakspot() {
    this.isWeakspotExpanded = !this.isWeakspotExpanded;
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

  ngOnDestroy() {
    window.removeEventListener('resize', this.resizeHandler);
  }


}
