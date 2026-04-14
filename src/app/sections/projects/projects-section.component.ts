import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgxConnectionBeamComponent } from '@omnedia/ngx-connection-beam';

interface ProjectItem {
	name: string;
	description: string;
	image: string;
	video?: string;
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
			name: 'ZetaDashboard',
			description:
				'Proyecto personal para gestionar usuarios y datos con tablas y CRUDs. Frontend en Blazor y consumo de API REST propia en C#.',
			image: 'proyects/front-page/Proyects_dashboard.png',
			video: 'proyects/videos/dashboard.mp4'
		},
		{
			name: 'ZetaMovies',
			description:
				'Proyecto personal para guardar peliculas vistas o pendientes. Frontend en Vue.js y conexion con API de TheMovieDatabase.',
			image: 'proyects/front-page/Proyects_movies.png',
			video: 'proyects/videos/movies.mp4'
		},
		{
			name: 'ZetaGames',
			description:
				'Proyecto personal para organizar juegos jugados o pendientes. Frontend en React.js y conexion con API de RAWG.',
			image: 'proyects/front-page/Proyects_games.png',
			video: 'proyects/videos/games.mp4'
		},
		{
			name: 'Antiguo Portfolio',
			description: 'Mi portfolio anterior, creado en 2022.',
			image: 'proyects/front-page/Proyects_cv.png'
		}
	];

	protected onCardEnter(video?: HTMLVideoElement): void {
		if (!video) {
			return;
		}

		video.muted = true;
		video.playsInline = true;
		video.autoplay = true;
		video.setAttribute('autoplay', '');
		video.currentTime = 0;
		void video.play().catch(() => {
			video.load();
			void video.play();
		});
	}

	protected onCardLeave(video?: HTMLVideoElement): void {
		if (!video) {
			return;
		}

		video.pause();
		video.currentTime = 0;
		video.autoplay = false;
		video.removeAttribute('autoplay');
	}
}
