import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TimelineModule } from 'primeng/timeline';

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-section-timeline',
  imports: [TimelineModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './timeline-section.component.html',
  styleUrl: './timeline-section.component.css'
})
export class TimelineSectionComponent {
  protected readonly events = signal<TimelineEvent[]>([
    {
      year: '2022',
      title: 'Inicio profesional',
      description: 'Comienzo en desarrollo frontend con foco en Angular y TypeScript.'
    },
    {
      year: '2024',
      title: 'Arquitectura modular',
      description: 'Implementación de apps divididas por secciones reutilizables.'
    },
    {
      year: '2026',
      title: 'PrimeNG + Angular 21',
      description: 'UI consistente, componentes modernos y performance con OnPush.'
    }
  ]);
}
