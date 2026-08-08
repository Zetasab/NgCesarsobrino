import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgxConnectionBeamComponent } from '@omnedia/ngx-connection-beam';

interface ProjectItem {
	name: string;
	description: string;
	image: string;
	preview?: string;
	url: string;
}

@Component({
	selector: 'app-section-projects',
	imports: [NgxConnectionBeamComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './projects-section.component.html',
	styleUrl: './projects-section.component.css'
})
export class ProjectsSectionComponent {
	protected readonly projects: ProjectItem[] = [
		{
			name: 'Templates',
			description:
				'Proyecto personal de donde se guardan las templates creadas para uso y descarga gratuita.',
			image: 'proyects/front-page/Proyects_animations.webp',
			preview: 'proyects/videos/templates.gif',
			url: 'https://templates.cesarsobrino.es'
		},
		{
			name: 'ZetaMovies',
			description:
				'Proyecto personal para guardar peliculas vistas o pendientes. Frontend en Vue.js y conexion con API de TheMovieDatabase.',
			image: 'proyects/front-page/Proyects_movies.png',
			preview: 'proyects/videos/movies.gif',
			url: 'https://movies.cesarsobrino.es'
		},
		{
			name: 'ZetaGames',
			description:
				'Proyecto personal para organizar juegos jugados o pendientes. Frontend en React.js y conexion con API de RAWG.',
			image: 'proyects/front-page/Proyects_games.png',
			preview: 'proyects/videos/games.gif',
			url: 'https://games.cesarsobrino.es'
		},
		{
			name: 'Mi portfolio web',
			description:
				'Mi portfolio web actual, hecho con html css y js mas librerias externas para animaciones de scroll para dar una funcionalidad y experiencia de usuario moderna.',
			image: 'proyects/front-page/Proyects_cv.png',
			preview: 'proyects/videos/portfolio.gif',
			url: 'https://portfolio.cesarsobrino.es'
		}
	];
}
