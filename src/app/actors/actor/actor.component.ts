import { Component, input } from '@angular/core';
import { Actor } from '../actors.model';

@Component({
  selector: 'app-actor',
  standalone: true,
  imports: [],
  templateUrl: './actor.component.html',
  styleUrl: './actor.component.css',
})
export class ActorComponent {
  actor = input.required<Actor>();
}
