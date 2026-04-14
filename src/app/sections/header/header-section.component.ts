import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, signal } from '@angular/core';
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
export class HeaderSectionComponent implements OnInit, OnDestroy {
  protected readonly welcomeWords = ['Bienvenido a mi portfolio'];
  protected readonly isScrolled = signal(false);
  protected readonly isOnDarkSection = signal(true);
  protected readonly showMouseHint = signal(false);
  protected readonly isMenuOpen = signal(false);

  private inactivityTimer?: ReturnType<typeof setTimeout>;

  ngOnInit(): void {
    this.onWindowScroll();
  }

  ngOnDestroy(): void {
    this.clearInactivityTimer();
  }

  protected onWindowScroll(): void {
    if (typeof window === 'undefined') {
      return;
    }

    const currentScroll = window.scrollY;
    const isInContactSection = this.isInContactSection(currentScroll);

    this.isScrolled.set(currentScroll > 8);
    this.isOnDarkSection.set(currentScroll < window.innerHeight - 120);
    this.clearInactivityTimer();

    if (isInContactSection) {
      this.showMouseHint.set(false);
      return;
    }

    if (currentScroll === 0) {
      this.showMouseHint.set(true);
      return;
    }

    this.showMouseHint.set(false);
    this.inactivityTimer = setTimeout(() => {
      if (typeof window !== 'undefined' && window.scrollY > 0 && !this.isInContactSection(window.scrollY)) {
        this.showMouseHint.set(true);
      }
    }, 4000);
  }

  protected scrollToTop(event?: Event): void {
    event?.preventDefault();

    if (typeof window === 'undefined') {
      return;
    }

    this.showMouseHint.set(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  protected toggleMenu(): void {
    this.isMenuOpen.update((open) => !open);
  }

  protected closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  private clearInactivityTimer(): void {
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
      this.inactivityTimer = undefined;
    }
  }

  private isInContactSection(currentScroll: number): boolean {
    const contactSection = document.querySelector('.section-contact') as HTMLElement | null;

    if (!contactSection) {
      return false;
    }

    return currentScroll >= contactSection.offsetTop - 80;
  }
}
