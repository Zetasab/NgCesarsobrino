import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnDestroy, QueryList, ViewChildren } from '@angular/core';

@Component({
  selector: 'app-section-about',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './about-section.component.html',
  styleUrl: './about-section.component.css'
})
export class AboutSectionComponent implements AfterViewInit, OnDestroy {
  @ViewChildren('revealLine', { read: ElementRef })
  private readonly revealLines!: QueryList<ElementRef<HTMLElement>>;

  private intersectionObserver?: IntersectionObserver;

  protected readonly aboutLines: string[] = [
    'Buenas,',
    'Soy Cesar Sobrino, desarrollador Full Stack con mas de tres años de experiencia construyendo aplicaciones web y multiplataforma.',
    'Trabajo principalmente con Blazor y Angular en el frontend, donde me enfoco en crear interfaces limpias, eficientes y centradas en la experiencia de usuario. En el backend desarrollo APIs con .NET y C#, priorizando la escalabilidad, el rendimiento y una arquitectura bien estructurada.',
    'Me gusta entender el problema antes de escribir codigo. Busco soluciones mantenibles, claras y pensadas a largo plazo. Disfruto optimizando procesos, mejorando la calidad del software y aportando criterio tecnico en cada proyecto en el que participo.'
  ];

  protected readonly stack: string[] = [
    'Angular',
    'Blazor',
    '.NET',
    'C#',
    'TypeScript',
    'SQL'
  ];

  protected readonly quickStats: Array<{ label: string; value: string }> = [
    { label: 'Experiencia', value: '3+ años' },
    { label: 'Rol', value: 'Full Stack' },
    { label: 'Foco', value: 'UX + APIs' }
  ];

  ngAfterViewInit(): void {
    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') {
      this.revealLines.forEach((lineRef) => lineRef.nativeElement.classList.add('is-visible'));
      return;
    }

    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            this.intersectionObserver?.unobserve(entry.target);
          }
        }
      },
      {
        threshold: 0.3,
        rootMargin: '0px 0px -8% 0px'
      }
    );

    this.revealLines.forEach((lineRef, index) => {
      lineRef.nativeElement.style.setProperty('--reveal-delay', `${index * 110}ms`);
      this.intersectionObserver?.observe(lineRef.nativeElement);
    });
  }

  ngOnDestroy(): void {
    this.intersectionObserver?.disconnect();
  }
}
