import { Component, Input, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { parse, subMinutes, isWithinInterval, subHours, subDays } from 'date-fns';
import { interval } from 'rxjs';
import { Future } from '../future/future.component';

type Interval = {
  start: Date;
  end: Date;
}

@Component({
  selector: 'app-max-min',
  standalone: true,
  imports: [NgIf],
  templateUrl: './max-min.component.html',
  styleUrl: './max-min.component.scss'
})

// max and min component
export class MaxMinComponent implements OnInit {
  @Input() futures!: Future[]

  // for view
  protected maxPrice = 0;
  protected minPrice = 0;
  protected maxPrice5min = 0;
  protected minPrice5min = 0;
  protected maxPrice15min = 0;
  protected minPrice15min = 0;
  protected maxPrice1h = 0;
  protected minPrice1h = 0;
  protected maxPrice4h = 0;
  protected minPrice4h = 0;
  protected maxPrice1d = 0;
  protected minPrice1d = 0;

  // intervals 5min, 15min, 1h, 4h, 1d
  private readonly FIVE_MIN_INTERVAL: Interval = { start: subMinutes(new Date(), 5), end: new Date() };
  private readonly FIFTEEN_MIN_INTERVAL: Interval = { start: subMinutes(new Date(), 15), end: new Date() };
  private readonly ONE_H_INTERVAL: Interval = { start: subHours(new Date(), 1), end: new Date() };
  private readonly FOUR_H_INTERVAL: Interval = { start: subHours(new Date(), 4), end: new Date() };
  private readonly ONE_DAY_INTERVAL: Interval = { start: subDays(new Date(), 1), end: new Date() };

  public ngOnInit(): void { // life cycle for start interval
    this.startInterval();
  }

  private startInterval() {
    const SECOND_IN_MS = 1000;
    const interval$ = interval(5 * SECOND_IN_MS); // interval every 5 sec

    interval$.subscribe(() => {
      this.getMaxMin(this.FIVE_MIN_INTERVAL, '5min');
      this.getMaxMin(this.FIFTEEN_MIN_INTERVAL, '15min');
      this.getMaxMin(this.ONE_H_INTERVAL, '1h');
      this.getMaxMin(this.FOUR_H_INTERVAL, '4h');
      this.getMaxMin(this.ONE_DAY_INTERVAL, '1d');
    })
  }

  private getMaxMin(interval: Interval, suffix: string) { // call every 5 sec, for show max and min prices
    const filteredFutures = this.filterFutures(interval);
    const [max, min] = this.getMaxMinValues(filteredFutures);

    if (max !== -Infinity) {
      (this as any)[`maxPrice${suffix}`] = max;
    }
    if (min !== Infinity) {
      (this as any)[`minPrice${suffix}`] = min;
    }
  }

  protected getMaxMinAllTime() { // when click on button "Get Max&Min for all futures and time"
    const [max, min] = this.getMaxMinValues(this.futures);

    if (max !== -Infinity) {
      this.maxPrice = max;
    }
    if (min !== Infinity) {
      this.minPrice = min;
    }
  }

  private getMaxMinValues(futures: Future[]): [number, number] { // find max and min prices
    const maxAllStore = futures.map(({ store }) => Math.max(...Object.values(store)));
    const mimAllStore = futures.map(({ store }) => Math.min(...Object.values(store)));

    return [Math.max(...maxAllStore), Math.min(...mimAllStore)];
  }

  private filterFutures(interval: Interval): Future[] { // filter store, for every future, leaves only between interval
    return this.futures.map((future) => {
      const filteredStore = Object.entries(future.store)
        .filter(([dateString]) => {
          const dateObj = parse(dateString, 'yyyy/MMMM/dd - kk:mm', new Date());
          return isWithinInterval(dateObj, interval);
        })
        .reduce((acc: Record<string, number>, [dateString, value]) => {
          acc[dateString] = value;
          return acc;
        }, {})

      return {
        ...future,
        store: filteredStore,
      }
    })
  }
}
