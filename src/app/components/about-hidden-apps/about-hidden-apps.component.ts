import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-about-hidden-apps',
  standalone: true,
  imports: [],
  templateUrl: './about-hidden-apps.component.html',
  styleUrl: './about-hidden-apps.component.css'
})
export class AboutHiddenAppsComponent {
  constructor(private router: Router) {}

  clickPersonalNotes() {
    this.router.navigate(['/personal']);
  }

}
