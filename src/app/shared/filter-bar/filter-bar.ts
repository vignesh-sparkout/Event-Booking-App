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
  startDate: string;
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
    startDate: ''
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

  filterCategory() {

    this.categoryChange.emit(
      { ...this.filters }
    );

  }

}
