import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PasswordContainerComponent } from '../../containers/lg-containers/password-container/password-container.component';

@Component({
  selector: 'app-about-hidden-apps',
  standalone: true,
  imports: [PasswordContainerComponent],
  templateUrl: './about-hidden-apps.component.html',
  styleUrl: './about-hidden-apps.component.css'
})
export class AboutHiddenAppsComponent {
  showPassword = false;

  constructor(private router: Router) {}

  clickPersonalNotes() {
    this.showPassword = true;
  }

  onPasswordSuccess() {
    this.showPassword = false;
    this.router.navigate(['/creative']);
  }

  onClosePasswordContainer() {
    this.showPassword = false;
  }
}
