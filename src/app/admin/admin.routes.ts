import { Routes } from '@angular/router';
import { AdminDirectorsComponent } from './admin-directors/admin-directors.component';
import { AddDirectorComponent } from './admin-directors/add-director/add-director.component';
import { AdminMoviesComponent } from './admin-movies/admin-movies.component';
import { AddMovieComponent } from './admin-movies/add-movie/add-movie.component';
import { UpdateMovieComponent } from './admin-movies/update-movie/update-movie.component';
import { UpdateDirectorComponent } from './admin-directors/update-director/update-director.component';
import { AdminActorsComponent } from './admin-actors/admin-actors.component';
import { AddActorComponent } from './admin-actors/add-actor/add-actor.component';
import { UpdateActorComponent } from './admin-actors/update-actor/update-actor.component';
export const adminRoutes: Routes = [
  {
    path: 'actors',
    component: AdminActorsComponent,
    title: 'Manage Actors',
  },
  {
    path: 'actors/add',
    component: AddActorComponent,
    title: 'Add Actor',
  },
  {
    path: 'actors/update-actor/:id',
    component: UpdateActorComponent,
    title: 'Update Actor',
  },
  {
    path: 'directors',
    component: AdminDirectorsComponent,
    title: 'Manage Directors',
  },
  {
    path: 'directors/add',
    component: AddDirectorComponent,
    title: 'Add Director',
  },
  {
    path: 'directors/update-director/:id',
    component: UpdateDirectorComponent,
    title: 'Update Director',
  },
  {
    path: 'movies',
    component: AdminMoviesComponent,
    title: 'Manage Movies',
  },
  {
    path: 'movies/add',
    component: AddMovieComponent,
    title: 'Add Movie',
  },
  {
    path: 'movies/update-movie/:id',
    component: UpdateMovieComponent,
    title: 'Update Movie',
  },
];
