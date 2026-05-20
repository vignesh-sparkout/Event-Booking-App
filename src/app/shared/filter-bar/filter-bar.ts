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

  dateRangeOpen = false;
  draftFromDate = '';
  draftToDate = '';
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

  get dateRangeLabel(): string {

    if (this.filters.fromDate && this.filters.toDate) {
      return `${this.formatDisplayDate(this.filters.fromDate)} to ${this.formatDisplayDate(this.filters.toDate)}`;
    }

    if (this.filters.fromDate) {
      return `From ${this.formatDisplayDate(this.filters.fromDate)}`;
    }

    return 'Select Date Range';

  }

  filterCategory() {

    this.categoryChange.emit(
      { ...this.filters }
    );

  }

  toggleDateRange(): void {

    this.draftFromDate = this.filters.fromDate;
    this.draftToDate = this.filters.toDate;
    this.dateRangeOpen = !this.dateRangeOpen;

  }

  applyDateRange(): void {

    if (
      this.draftFromDate &&
      this.draftToDate &&
      this.draftToDate < this.draftFromDate
    ) {
      this.draftToDate = this.draftFromDate;
    }

    this.filters.fromDate = this.draftFromDate;
    this.filters.toDate = this.draftToDate;
    this.dateRangeOpen = false;
    this.filterCategory();

  }

  clearDateRange(): void {

    this.draftFromDate = '';
    this.draftToDate = '';
    this.filters.fromDate = '';
    this.filters.toDate = '';
    this.dateRangeOpen = false;
    this.filterCategory();

  }

  private formatDisplayDate(date: string): string {

    return new Date(date).toLocaleDateString(
      'en-IN',
      {
        day: '2-digit',
        month: 'short'
      }
    );

  }

}
