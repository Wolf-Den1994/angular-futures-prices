import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { format } from 'date-fns';

export interface Future {
  title: string
  text: string,
  store: Record<string,number>,
  newPrice: string,
  newTime: string,
}

@Component({
  selector: 'app-future',
  standalone: true,
  imports: [NgIf],
  templateUrl: './future.component.html',
  styleUrl: './future.component.scss'
})

// component future
export class FutureComponent {
  @Input() future!: Future
  @Input() index!: number

  protected errorSave = false; // for show error
  protected maxPrice = 0; // for show max price
  protected minPrice = 0; // for show min price
  protected maxTime = ''; // for show time max price
  protected minTime = ''; // for show time min price

  protected inputPriceHandle (value: string) {
    this.future.newPrice = value;
  }

  protected inputTimeHandle (value: string) {
    this.future.newTime = value;
  }

  protected onSave() { // save in store
    try {
      this.errorSave = false;

      const { newPrice, newTime, store } = this.future; 

      if (!newPrice || !newTime) { // if not exists some data, not save
        this.errorSave = true;
        return;
      }

      const time = format(newTime, 'yyyy/MMMM/dd - kk:mm');
      this.future.store = { // save
        ...store,
        [time]: parseInt(newPrice),
      }

      // clean
      this.future.newPrice = '';
      this.future.newTime = '';
      this.maxPrice = 0;
      this.minPrice = 0;
    } catch (err) {
      this.errorSave = true;
    }
  }

  protected getMaxMin() { // find max and min price and time
    const { store } = this.future;
    const prices = Object.values(store);

    const max = Math.max(...prices);
    const min = Math.min(...prices);
    const maxTime = Object.keys(store).find((key) => store[key] === max);
    const minTime = Object.keys(store).find((key) => store[key] === min);

    if (max !== -Infinity && maxTime) {
      this.maxPrice = max;
      this.maxTime = maxTime;
    }
    if (min !== Infinity && minTime) {
      this.minPrice = min;
      this.minTime = minTime;
    }
  }
}
