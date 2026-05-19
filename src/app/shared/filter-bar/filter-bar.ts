import {
  Component,
  EventEmitter,
  Output
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface EventFilters {
  category: string;
  city: string;
  price: string;
  fromDate: string;
  toDate: string;
}

@Component({
  selector: 'app-filter-bar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './filter-bar.html',
  styleUrl: './filter-bar.css'
})
export class FilterBar {

  filters: EventFilters = {
    category: '',
    city: '',
    price: '',
    fromDate: '',
    toDate: ''
  };

  categories = [
    'Music',
    'Technology',
    'Workshop',
    'Comedy',
    'Sports',
    'Food'
  ];

  priceOptions = [
    {
      label: 'All Prices',
      value: ''
    },
    {
      label: 'Free',
      value: 'free'
    },
    {
      label: 'Paid',
      value: 'paid'
    },
    {
      label: 'Under Rs. 500',
      value: 'under-500'
    }
  ];

  @Output()
  categoryChange =
    new EventEmitter<EventFilters>();

  get minimumToDate(): string | undefined {

    return this.filters.fromDate || undefined;

  }

  filterCategory() {

    if (
      this.filters.fromDate &&
      this.filters.toDate &&
      this.filters.toDate < this.filters.fromDate
    ) {
      this.filters.toDate = this.filters.fromDate;
    }

    this.categoryChange.emit(
      { ...this.filters }
    );

  }

}
