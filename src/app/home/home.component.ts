import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [NgFor, RouterLink],
})
export class HomeComponent {
  stats = [
    {
      title: 'Movies',
      count: 120,
      description: 'Explore a vast collection of movies from every genre.',
      icon: '🎬',
      path: '/movies',
    },
    {
      title: 'Actors',
      count: 45,
      description: 'Get to know your favorite actors and their roles.',
      icon: '⭐',
      path: '/actors',
    },
    {
      title: 'Directors',
      count: 15,
      description: 'Discover talented directors behind the scenes.',
      icon: '🎥',
      path: '/directors',
    },
  ];
}
