import { Component } from '@angular/core';
import { BottomNavComponent } from '../../nav/bottom-nav/bottom-nav.component';
import { ArticleTopNavComponent } from '../../nav/article-top-nav/article-top-nav.component';
import { QuestsContainerComponent } from '../../containers/lg-containers/quests-container/quests-container.component';

@Component({
  selector: 'app-quests-screen',
  standalone: true,
  imports: [BottomNavComponent, ArticleTopNavComponent, QuestsContainerComponent],
  templateUrl: './quests-screen.component.html',
  styleUrl: '../about-screen/about-screen.component.css',
})
export class QuestsScreenComponent {}
