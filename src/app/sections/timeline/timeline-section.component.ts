import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NgxTimelineComponent, NgxTimelineEntryComponent } from '@omnedia/ngx-timeline';

interface TimelineEvent {
  period: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-section-timeline',
  imports: [NgxTimelineComponent, NgxTimelineEntryComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './timeline-section.component.html',
  styleUrl: './timeline-section.component.css'
})
export class TimelineSectionComponent {
  protected readonly events = signal<TimelineEvent[]>([
    {
      period: '2019',
      title: 'Grado medio',
      description: 'Graduado en Grado medio de sistemas microinformaticos en red.'
    },
    {
      period: '2021',
      title: 'Grado Superior DAM',
      description: 'Graduado en el Grado Superior de Programacion de Aplicaciones Multiplataforma (DAM).'
    },
    {
      period: '2022',
      title: 'Grado Superior DAW',
      description: 'Graduado en el Grado Superior de Programacion de Aplicaciones Web (DAW).'
    },
    {
      period: 'Octubre 2021 - marzo 2022',
      title: 'VisibleSoft',
      description: 'Desarrollador de Software de Aplicaciones .NET Core con Angular en VisibleSoft.'
    },
    {
      period: 'Diciembre 2022 - actualmente',
      title: 'Excem Technologies',
      description: 'Desarrollador de Software de Aplicaciones .NET Core con Angular/Blazor en Excem Technologies.'
    }
  ]);
}
