import { AfterViewInit, Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Project, PROJECTS } from '../../../data/projects.data';
import { Article, ArticleService } from '../../../article.service';
import {
  FOLDER_CHIP_CLASSES,
  FOLDER_COLORS,
  HIDDEN_FOLDERS,
  MAIN_FOLDERS,
  ROOT_FOLDER,
  skillLabel,
} from '../../../data/skills.data';

export interface SkillChip {
  label: string;
  chipClass: string;
}

@Component({
  selector: 'app-about-container',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about-container.component.html',
  styleUrl: './about-container.component.css',
})
export class AboutContainerComponent implements OnInit, AfterViewInit, OnDestroy {
  @Output() closeSubmenuEvent = new EventEmitter<boolean>();

  constructor(
    private router: Router,
    protected articleService: ArticleService,
    private route: ActivatedRoute
  ) {}

  clickHiddenScreen() {
    this.router.navigate(['/hidden']);
  }

  navigateToSkills() {
    this.router.navigate(['/skills']);
  }

  navigateToProjects() {
    this.router.navigate(['/quests']);
  }

  navigateToProjectLink(project: Project) {
    if (project.buttonRoute) {
      const [path, fragment] = project.buttonRoute.split('#');
      if (this.router.url.split('#')[0] === path) {
        // Already on that page: just scroll to the section
        this.scrollToSection(fragment);
      } else {
        this.router.navigate([path], { fragment });
      }
    } else if (project.link) {
      window.open(project.link, '_blank', 'noopener,noreferrer');
    }
  }

  /** The skills page, showing only the quest's notes */
  navigateToQuestNotes(project: Project) {
    this.router.navigate(['/skills'], { queryParams: { quest: project.id } });
  }

  hasQuestNotes(project: Project): boolean {
    return this.articleService.getArticlesByProject(project.id, project.name).length > 0;
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
  /** Skill chips on the character card, built from every note */
  characterSkills: SkillChip[] = [];
  isExpanded = false;
  isLargeScreen = false;
  private resizeHandler = () => this.checkScreenSize();

  ngAfterViewInit() {
    // e.g. /about#connect opens the page at the socials
    const fragment = this.route.snapshot.fragment;
    if (fragment) {
      // The section only lands in its final place once the page's images have loaded
      this.imagesLoaded().then(() => this.scrollToSection(fragment));
    }
  }

  private imagesLoaded(): Promise<void> {
    const pending = Array.from(document.images)
      .filter((img) => !img.complete)
      .map((img) => new Promise((resolve) => {
        img.addEventListener('load', resolve, { once: true });
        img.addEventListener('error', resolve, { once: true });
      }));
    // Don't wait forever on a slow image
    const timeout = new Promise((resolve) => setTimeout(resolve, 2000));
    return Promise.race([Promise.all(pending), timeout]).then(() => undefined);
  }

  private scrollToSection(id: string | undefined) {
    if (id) {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  ngOnInit() {
    this.loadFeaturedProjects();
    this.characterSkills = this.buildSkillChips(this.articleService.originalArticles);
    // Start in fullscreen
    this.isExpanded = true;
    this.checkScreenSize();
    window.addEventListener('resize', this.resizeHandler);
  }

  checkScreenSize() {
    this.isLargeScreen = window.innerWidth >= 1024;
    // Smaller screens (tablet, mobile) are always fullscreen; the green button is greyed out
    if (!this.isLargeScreen) {
      this.isExpanded = true;
    }
  }

  toggleFullscreen() {
    if (!this.isLargeScreen) {
      return; // Disabled on small screens
    }
    this.isExpanded = !this.isExpanded;
  }

  /**
   * One chip per skills page subnode the notes are filed under, in the subnode's main
   * folder color. Grouped by main folder in skills page order, most notes first within a group.
   */
  protected buildSkillChips(articles: Article[]): SkillChip[] {
    const mainOrder = [ROOT_FOLDER, ...MAIN_FOLDERS];
    const skills = new Map<string, { folder: string; subFolder: string; notes: number }>();

    articles.forEach((article) => {
      this.articleService.getFolderPaths(article).forEach(([folder, subFolder]) => {
        if (!folder || !subFolder || HIDDEN_FOLDERS.has(subFolder)) return;
        const key = `${folder}/${subFolder}`;
        const skill = skills.get(key) ?? { folder, subFolder, notes: 0 };
        skill.notes++;
        skills.set(key, skill);
      });
    });

    return Array.from(skills.values())
      .sort(
        (a, b) =>
          mainOrder.indexOf(a.folder) - mainOrder.indexOf(b.folder) || b.notes - a.notes
      )
      .map((skill) => ({
        label: skillLabel(skill.subFolder),
        chipClass: FOLDER_CHIP_CLASSES[skill.folder] ?? 'white-chip',
      }));
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

  private cardColors = new Map<string, string>();

  /** The color of the main folder most of the quest's notes are filed under */
  getCardBackgroundColor(project: Project): string {
    if (!this.cardColors.has(project.id)) {
      const counts = new Map<string, number>();
      this.articleService.getArticlesByProject(project.id, project.name).forEach((article) =>
        article.folder
          .filter((folder) => FOLDER_COLORS[folder])
          .forEach((folder) => counts.set(folder, (counts.get(folder) ?? 0) + 1))
      );
      const [top] = Array.from(counts.entries()).sort((x, y) => y[1] - x[1]);
      this.cardColors.set(project.id, top ? FOLDER_COLORS[top[0]] : '#010689');
    }
    return this.cardColors.get(project.id)!;
  }

  getCardTextColor(project: Project): string {
    // All cards use black text
    return '#080a19';
  }

  getCardBorderColor(project: Project): string {
    // All cards use black border
    return '#080a19';
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
