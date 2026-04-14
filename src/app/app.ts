import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AboutSectionComponent } from './sections/about/about-section.component';
import { HeaderSectionComponent } from './sections/header/header-section.component';
import { LanguagesSectionComponent } from './sections/languages/languages-section.component';
import { LinksSectionComponent } from './sections/links/links-section.component';
import { TimelineSectionComponent } from './sections/timeline/timeline-section.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    HeaderSectionComponent,
    AboutSectionComponent,
    LanguagesSectionComponent,
    TimelineSectionComponent,
    LinksSectionComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
}
