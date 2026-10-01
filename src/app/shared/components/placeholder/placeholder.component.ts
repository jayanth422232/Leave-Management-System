import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-placeholder',
  standalone: true,
  imports: [AsyncPipe],
  template: `<h2>{{ (route.data | async)?.['title'] }}</h2><p>Coming soon...</p>`,
})
export class PlaceholderComponent {
  route = inject(ActivatedRoute);
}