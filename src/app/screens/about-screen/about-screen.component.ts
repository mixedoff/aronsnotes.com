import { Component, EventEmitter, Output } from '@angular/core';
import { TopNavComponent } from '../../nav/top-nav/top-nav.component';
import { BottomNavComponent } from '../../nav/bottom-nav/bottom-nav.component';
import { LabelContainerComponent } from '../../containers/lg-containers/label-container/label-container.component';
import { AboutContainerComponent } from '../../containers/lg-containers/about-container/about-container.component';

@Component({
  selector: 'app-about-screen',
  standalone: true,
  imports: [
    TopNavComponent,
    BottomNavComponent,
    LabelContainerComponent,
    AboutContainerComponent,
  ],
  templateUrl: './about-screen.component.html',
  styleUrl: './about-screen.component.css',
})
export class AboutScreenComponent {
  @Output() menuClickedOnChild = new EventEmitter<boolean>();
  clickMenuOnChild() {
    this.menuClickedOnChild.emit(true);
    console.log('menuClickedOnChild emitted');
  }
}
