import { AfterViewInit, Component, ElementRef, OnDestroy, QueryList, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project, PROJECTS } from '../../../data/projects.data';
import { AboutContainerComponent, SkillChip } from '../about-container/about-container.component';

/**
 * Lists every project as a quest. Reuses the character page's project cards
 * (and their helpers), laid out as a grid instead of a stacked deck.
 */
@Component({
  selector: 'app-quests-container',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quests-container.component.html',
  styleUrls: [
    '../about-container/about-container.component.css',
    './quests-container.component.css',
  ],
})
export class QuestsContainerComponent
  extends AboutContainerComponent
  implements AfterViewInit, OnDestroy
{
  @ViewChildren('techText') techTexts!: QueryList<ElementRef<HTMLElement>>;
  private tickerResizeHandler = () => this.updateTechTickers();

  /** Skill chips per project id, built from the skills page subnodes of the project's notes */
  questSkills = new Map<string, SkillChip[]>();
  /** Technologies per project id, collected from the project's notes */
  questTech = new Map<string, string[]>();

  // Featured projects first (in their featured order), then the rest
  override loadFeaturedProjects() {
    this.featuredProjects = [...PROJECTS].sort(
      (a, b) => (a.featuredOrder ?? Infinity) - (b.featuredOrder ?? Infinity)
    );
    this.featuredProjects.forEach((project) => {
      this.questSkills.set(project.id, this.buildQuestSkills(project));
      this.questTech.set(project.id, this.buildQuestTech(project));
    });
  }

  override ngAfterViewInit() {
    super.ngAfterViewInit();
    this.updateTechTickers();
    // Widths change once the web font has loaded
    document.fonts?.ready.then(() => this.updateTechTickers());
    window.addEventListener('resize', this.tickerResizeHandler);
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    window.removeEventListener('resize', this.tickerResizeHandler);
  }

  /**
   * A tech list only moves when it's wider than its card: it slides to the end and back,
   * so every technology is shown once.
   */
  private updateTechTickers() {
    this.techTexts?.forEach(({ nativeElement: text }) => {
      const overflow = text.scrollWidth - (text.parentElement?.clientWidth ?? 0);
      text.classList.toggle('scrolling', overflow > 0);
      text.style.setProperty('--scroll-distance', `${-Math.max(overflow, 0)}px`);
      // About 25px per second, so long lists don't rush past
      text.style.setProperty('--scroll-duration', `${Math.max(overflow / 25, 3)}s`);
    });
  }

  // Most used first
  private buildQuestTech(project: Project): string[] {
    const counts = new Map<string, number>();
    this.articleService.getArticlesByProject(project.id, project.name).forEach((article) =>
      article.technologies
        .filter((tech) => tech && tech.trim() !== '')
        .forEach((tech) => counts.set(tech, (counts.get(tech) ?? 0) + 1))
    );
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([tech]) => tech);
  }

  private buildQuestSkills(project: Project): SkillChip[] {
    return this.buildSkillChips(this.articleService.getArticlesByProject(project.id, project.name));
  }

}
