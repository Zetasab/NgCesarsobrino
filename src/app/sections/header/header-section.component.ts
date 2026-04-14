import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { NgxAuroraComponent } from '@omnedia/ngx-aurora';
import { NgxTypewriterComponent } from '@omnedia/ngx-typewriter';

@Component({
  selector: 'app-section-header',
  imports: [NgxAuroraComponent, NgxTypewriterComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(window:scroll)': 'onWindowScroll()'
  },
  templateUrl: './header-section.component.html',
  styleUrl: './header-section.component.css'
})
export class HeaderSectionComponent implements OnInit {
  protected readonly welcomeWords = ['Bienvenido a mi portfolio'];
  protected readonly isScrolled = signal(false);
  protected readonly isOnDarkSection = signal(true);

  ngOnInit(): void {
    this.onWindowScroll();
  }

  protected onWindowScroll(): void {
    if (typeof window === 'undefined') {
      return;
    }

    const currentScroll = window.scrollY;
    this.isScrolled.set(currentScroll > 8);
    this.isOnDarkSection.set(currentScroll < window.innerHeight - 120);
  }
}
