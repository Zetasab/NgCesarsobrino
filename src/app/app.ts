import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderSectionComponent } from './sections/header-section.component';
import { LinksSectionComponent } from './sections/links-section.component';
import { TimelineSectionComponent } from './sections/timeline-section.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderSectionComponent, TimelineSectionComponent, LinksSectionComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
}
