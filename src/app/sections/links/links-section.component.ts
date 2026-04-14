import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

interface ResourceLink {
  label: string;
  href: string;
}

@Component({
  selector: 'app-section-links',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './links-section.component.html',
  styleUrl: './links-section.component.css'
})
export class LinksSectionComponent {
  protected readonly links = signal<ResourceLink[]>([
    { label: 'Angular Docs', href: 'https://angular.dev' },
    { label: 'Angular CLI', href: 'https://angular.dev/tools/cli' },
    { label: 'PrimeNG', href: 'https://primeng.org' }
  ]);
}
