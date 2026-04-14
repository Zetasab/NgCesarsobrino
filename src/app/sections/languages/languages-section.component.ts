import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  QueryList,
  ViewChildren
} from '@angular/core';
import { NgxMarqueeComponent, OmMarqueeItemDirective } from '@omnedia/ngx-marquee';

interface LanguageItem {
  icon: string;
  logo?: string;
  name: string;
  description: string;
}

interface MarqueeItem {
  icon: string;
  label: string;
  logo?: string;
}

interface LanguageGroup {
  title: string;
  items: LanguageItem[];
}

@Component({
  selector: 'app-section-languages',
  imports: [NgxMarqueeComponent, OmMarqueeItemDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './languages-section.component.html',
  styleUrl: './languages-section.component.css'
})
export class LanguagesSectionComponent implements AfterViewInit, OnDestroy {
  @ViewChildren('revealBlock', { read: ElementRef })
  private readonly revealBlocks!: QueryList<ElementRef<HTMLElement>>;

  @ViewChildren('trackLogo', { read: ElementRef })
  private readonly trackLogos!: QueryList<ElementRef<HTMLElement>>;

  private intersectionObserver?: IntersectionObserver;

  protected readonly marqueeItems: MarqueeItem[] = [
    { icon: 'H5', label: 'HTML5', logo: 'logos/languages/HTML_logo.png' },
    { icon: 'C3', label: 'CSS3', logo: 'logos/languages/CSS3_logo.png' },
    { icon: 'JS', label: 'JavaScript', logo: 'logos/languages/Js_logo.png' },
    { icon: 'C#', label: 'C#', logo: 'logos/languages/Csharp_logo.png' },
    { icon: 'NG', label: 'Angular', logo: 'logos/languages/Angular_logo.png' },
    { icon: 'BZ', label: 'Blazor', logo: 'logos/languages/Blazor_logo.png' },
    { icon: 'RC', label: 'React', logo: 'logos/languages/React_logo.png' },
    { icon: 'VU', label: 'Vue.js', logo: 'logos/languages/Vue_logo.png' },
    { icon: 'JV', label: 'Java', logo: 'logos/languages/Java_logo.png' },
    { icon: 'PY', label: 'Python', logo: 'logos/languages/Python_logo.png' },
    { icon: 'PHP', label: 'PHP', logo: 'logos/languages/Php_logo.png' },
    { icon: 'SQL', label: 'MySQL', logo: 'logos/languages/MySQL_logo.png' }
  ];

  protected readonly groups: LanguageGroup[] = [
    {
      title: 'Base',
      items: [
        {
          icon: 'H5',
          logo: 'logos/languages/HTML_logo.png',
          name: 'HTML5',
          description: 'Estructura semantica y accesible.'
        },
        {
          icon: 'C3',
          logo: 'logos/languages/CSS3_logo.png',
          name: 'CSS3',
          description: 'Estilos modernos, Grid, Flexbox y animaciones.'
        },
        {
          icon: 'JS',
          logo: 'logos/languages/Js_logo.png',
          name: 'JavaScript',
          description: 'Interactividad y logica del lado del cliente.'
        }
      ]
    },
    {
      title: 'Profesional',
      items: [
        {
          icon: 'C#',
          logo: 'logos/languages/Csharp_logo.png',
          name: 'C# & .NET',
          description: 'Backend solido, APIs y arquitectura empresarial.'
        },
        {
          icon: 'NG',
          logo: 'logos/languages/Angular_logo.png',
          name: 'Angular',
          description: 'Aplicaciones escalables y robustas.'
        },
        {
          icon: 'BZ',
          logo: 'logos/languages/Blazor_logo.png',
          name: 'Blazor',
          description: 'Desarrollo web full-stack con C#.'
        }
      ]
    },
    {
      title: 'Hobby',
      items: [
        {
          icon: 'RC',
          logo: 'logos/languages/React_logo.png',
          name: 'React',
          description: 'Interfaces interactivas y componentes reutilizables.'
        },
        {
          icon: 'VU',
          logo: 'logos/languages/Vue_logo.png',
          name: 'Vue.js',
          description: 'Desarrollo agil y reactivo.'
        },
        {
          icon: 'ND',
          logo: 'logos/languages/Node_logo.png',
          name: 'Node.js',
          description: 'Entorno de ejecucion para JavaScript en el servidor.'
        }
      ]
    }
  ];

  ngAfterViewInit(): void {
    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') {
      this.revealBlocks.forEach((block) => block.nativeElement.classList.add('is-visible'));
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
        threshold: 0.22,
        rootMargin: '0px 0px -10% 0px'
      }
    );

    this.revealBlocks.forEach((blockRef, index) => {
      blockRef.nativeElement.style.setProperty('--reveal-delay', `${index * 90}ms`);
      this.intersectionObserver?.observe(blockRef.nativeElement);
    });
  }

  protected onSectionMouseMove(event: MouseEvent): void {
    const maxOffset = 15;

    this.trackLogos.forEach((logoRef) => {
      const logoEl = logoRef.nativeElement;
      const rect = logoEl.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (event.clientX - centerX) * 0.08;
      const deltaY = (event.clientY - centerY) * 0.08;

      const offsetX = Math.max(-maxOffset, Math.min(maxOffset, deltaX));
      const offsetY = Math.max(-maxOffset, Math.min(maxOffset, deltaY));

      logoEl.style.setProperty('--logo-float-x', `${offsetX}px`);
      logoEl.style.setProperty('--logo-float-y', `${offsetY}px`);
    });
  }

  protected onSectionMouseLeave(): void {
    this.trackLogos.forEach((logoRef) => {
      logoRef.nativeElement.style.setProperty('--logo-float-x', '0px');
      logoRef.nativeElement.style.setProperty('--logo-float-y', '0px');
    });
  }

  ngOnDestroy(): void {
    this.intersectionObserver?.disconnect();
  }
}
