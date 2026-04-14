import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AboutSectionComponent } from './sections/about/about-section.component';
import { HeaderSectionComponent } from './sections/header/header-section.component';
import { LanguagesSectionComponent } from './sections/languages/languages-section.component';
import { ContactSectionComponent } from './sections/contact/contact-section.component';
import { ProjectsSectionComponent } from './sections/projects/projects-section.component';
import { TimelineSectionComponent } from './sections/timeline/timeline-section.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    HeaderSectionComponent,
    AboutSectionComponent,
    LanguagesSectionComponent,
    TimelineSectionComponent,
    ProjectsSectionComponent,
    ContactSectionComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
}
