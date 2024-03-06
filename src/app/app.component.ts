import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgFor } from '@angular/common';
import { Future, FutureComponent } from './future/future.component';
import { MaxMinComponent } from './max-min/max-min.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FutureComponent, NgFor, MaxMinComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})

export class AppComponent {
  title = 'testing-futures';

  // all futures
  protected futures: Future[] = [
    {
      title: 'Future 1',
      text: 'This is future number 1',
      store: {},
      newPrice: '',
      newTime: '',
    },
    {
      title: 'Future 2',
      text: 'This is future number 2',
      store: {},
      newPrice: '',
      newTime: '',
    },
    {
      title: 'Future 3',
      text: 'This is future number 3',
      store: {},
      newPrice: '',
      newTime: '',
    },
  ]
}
