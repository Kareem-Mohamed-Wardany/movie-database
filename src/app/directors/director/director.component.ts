import { Component, input } from '@angular/core';
import { Director } from '../directors.model';

@Component({
  selector: 'app-director',
  standalone: true,
  imports: [],
  templateUrl: './director.component.html',
  styleUrl: './director.component.css',
})
export class DirectorComponent {
  director = input.required<Director>();
}
