import { Component } from '@angular/core';
import { LabelContainerComponent } from '../../containers/lg-containers/label-container/label-container.component';
import { StartContainerComponent } from '../../containers/sm-containers/start-container/start-container.component';
import { Router } from '@angular/router';
@Component({
  selector: 'app-welcome-screen',
  standalone: true,
  imports: [LabelContainerComponent, StartContainerComponent],
  templateUrl: './welcome-screen.component.html',
  styleUrl: './welcome-screen.component.css',
})
export class WelcomeScreenComponent {
  constructor(private router: Router) {}
  goToAbout() {
    this.router.navigate(['/about']);
  }
}
