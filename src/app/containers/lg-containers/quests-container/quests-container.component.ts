import { AfterViewInit, Component, ElementRef, OnDestroy, QueryList, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Quest, QUESTS } from '../../../data/quests.data';
import { CharacterContainerComponent, SkillChip } from '../character-container/character-container.component';

/**
 * Lists every quest as a quest. Reuses the character page's quest cards
 * (and their helpers), laid out as a grid instead of a stacked deck.
 */
@Component({
  selector: 'app-quests-container',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quests-container.component.html',
  styleUrls: [
    '../character-container/character-container.component.css',
    './quests-container.component.css',
  ],
})
export class QuestsContainerComponent
  extends CharacterContainerComponent
  implements AfterViewInit, OnDestroy
{
  @ViewChildren('techText') techTexts!: QueryList<ElementRef<HTMLElement>>;
  private tickerResizeHandler = () => this.updateTechTickers();

  /** Skill chips per quest id, built from the skills page subnodes of the quest's notes */
  questSkills = new Map<string, SkillChip[]>();
  /** Technologies per quest id, collected from the quest's notes */
  questTech = new Map<string, string[]>();
  /** Cards turned to their front (cards start on their back) */
  private frontCards = new Set<string>();
  /** How many times each card has turned */
  flips = new Map<string, number>();
  /** How many times each card has turned to its front; a new count replays the pixel burst */
  bursts = new Map<string, number>();

  isFront(quest: Quest): boolean {
    return this.frontCards.has(quest.id);
  }

  flipCard(quest: Quest) {
    if (!this.frontCards.delete(quest.id)) {
      this.frontCards.add(quest.id);
      this.bursts.set(quest.id, (this.bursts.get(quest.id) ?? 0) + 1);
    }
    this.flips.set(quest.id, (this.flips.get(quest.id) ?? 0) + 1);
  }

  /** A still frame of the quest's animation (assets/gif/stills), for the card's back */
  getStillPath(quest: Quest): string {
    return quest.animationGif
      ? `/assets/gif/stills/${quest.animationGif.replace(/\.gif$/, '.png')}`
      : '';
  }

  /** Clicking the front turns the card back, unless it was on a link or button */
  onFrontClick(event: MouseEvent, quest: Quest) {
    if ((event.target as HTMLElement).closest('a, button')) return;
    this.flipCard(quest);
  }

  // Featured quests first (in their featured order), then the rest, minus hidden ones
  override loadFeaturedQuests() {
    this.featuredQuests = QUESTS.filter((quest) => !quest.hideCard).sort(
      (a, b) => (a.featuredOrder ?? Infinity) - (b.featuredOrder ?? Infinity)
    );
    this.featuredQuests.forEach((quest) => {
      this.questSkills.set(quest.id, this.buildQuestSkills(quest));
      this.questTech.set(quest.id, this.buildQuestTech(quest));
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
  private buildQuestTech(quest: Quest): string[] {
    const counts = new Map<string, number>();
    this.noteService.getNotesByQuest(quest.id, quest.name).forEach((note) =>
      note.technologies
        .filter((tech) => tech && tech.trim() !== '')
        .forEach((tech) => counts.set(tech, (counts.get(tech) ?? 0) + 1))
    );
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([tech]) => tech);
  }

  private buildQuestSkills(quest: Quest): SkillChip[] {
    return this.buildSkillChips(this.noteService.getNotesByQuest(quest.id, quest.name));
  }

}
