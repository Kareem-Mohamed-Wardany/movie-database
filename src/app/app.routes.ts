import { Routes } from '@angular/router';
import { MoviesComponent } from './movies/movies.component';
import { ActorsComponent } from './actors/actors.component';
import { DirectorsComponent } from './directors/directors.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AdminComponent } from './admin/admin.component';
import { adminRoutes } from './admin/admin.routes';
import { HomeComponent } from './home/home.component';
import { FavoritesComponent } from './favorites/favorites.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Movie DB',
  },
  {
    path: 'favorites',
    component: FavoritesComponent,
    title: 'Your Favorites',
  },
  {
    path: 'movies',
    component: MoviesComponent,
    title: 'All Movies',
  },
  {
    path: 'actors',
    component: ActorsComponent,
    title: 'All Actors',
  },
  {
    path: 'directors',
    component: DirectorsComponent,
    title: 'All Directors',
  },
  {
    path: 'admin',
    component: AdminComponent,
    title: 'Admin Panel',
    children: adminRoutes,
  },
  {
    path: 'auth/login',
    component: LoginComponent,
    title: 'Login',
  },
  {
    path: 'auth/signup',
    component: SignupComponent,
    title: 'Signup',
  },
];
