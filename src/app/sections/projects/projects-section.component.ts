import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { NgxConnectionBeamComponent } from '@omnedia/ngx-connection-beam';

interface ProjectItem {
  name: string;
  description: string;
  image: string;
}

@Component({
  selector: 'app-section-projects',
  imports: [NgxConnectionBeamComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './projects-section.component.html',
  styleUrl: './projects-section.component.css'
})
export class ProjectsSectionComponent {
  protected readonly projects = signal<ProjectItem[]>([
    {
      name: 'ZetaDashboard',
      description:
        'Un proyecto personal para manejar en tablas y cruds los usuarios, datos etc. Esta hecho con Blazor de frontend y llamadas a una API REST mia con C#.',
      image: 'logos/languages/Csharp_logo.png'
    },
    {
      name: 'ZetaMovies',
      description:
        'Es un proyecto personal para guardar peliculas como vistas o previstas para ver. Esta hecho con Vue.js de frontend y hace llamadas a la API de TheMovieDatabase.',
      image: 'logos/languages/Vue_logo.png'
    },
    {
      name: 'ZetaGames',
      description:
        'Es un proyecto personal para guardar juegos como jugados o previstos por jugar. Esta hecho con React.js de frontend y hace llamadas a la API de RAWG.',
      image: 'logos/languages/React_logo.png'
    },
    {
      name: 'Antiguo Portfolio',
      description: 'Es mi antiguo portfolio que hice en 2022.',
      image: 'logos/languages/HTML_logo.png'
    }
  ]);

  protected readonly projectOne = computed(() => this.projects()[0]);
  protected readonly projectTwo = computed(() => this.projects()[1]);
  protected readonly projectThree = computed(() => this.projects()[2]);
  protected readonly projectFour = computed(() => this.projects()[3]);
}
