import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EventService } from '../../services/event';
import { SearchBar } from '../../shared/search-bar/search-bar';
import { Event } from '../../Models/event.model';
import {
  EventFilters,
  FilterBar
} from '../../shared/filter-bar/filter-bar';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [RouterLink, CommonModule, SearchBar,FilterBar],
  templateUrl: './event-list.html',
  styleUrl: './event-list.css',
})
export class EventList {
  events: Event[] = [];
  private searchText = '';
  private filters: EventFilters = {
    category: '',
    city: '',
    price: '',
    startDate: ''
  };

  constructor(
    private eventService: EventService
  ) {
    this.applyFilters();
  }

  searchEvents(searchText: string): void {

    this.searchText = searchText;
    this.applyFilters();

  }

  filterEvents(filters: EventFilters): void {

    this.filters = filters;
    this.applyFilters();

  }

  getEventTime(event: Event): string {

    return `${this.formatTime(event.startDateTime)} - ${this.formatTime(event.endDateTime)}`;

  }

  private applyFilters(): void {

    const keyword =
      this.searchText.trim().toLowerCase();

    const today =
      new Date();

    today.setHours(0, 0, 0, 0);

    this.events =
      this.eventService.getActiveEvents().filter(event => {

        const matchesKeyword =
          !keyword ||
          [
            event.title,
            event.venue,
            event.city,
            event.organizerName
          ].some(value =>
            value.toLowerCase().includes(keyword)
          );

        const matchesCategory =
          !this.filters.category ||
          event.category === this.filters.category;

        const matchesCity =
          !this.filters.city ||
          event.city.toLowerCase().includes(
            this.filters.city.toLowerCase()
          );

        const matchesPrice =
          this.matchesPriceFilter(event.price);

        const eventDate =
          new Date(event.date);

        const isUpcoming =
          eventDate >= today;

        const matchesStartDate =
          !this.filters.startDate ||
          eventDate >= new Date(this.filters.startDate);

        return (
          isUpcoming &&
          matchesKeyword &&
          matchesCategory &&
          matchesCity &&
          matchesPrice &&
          matchesStartDate
        );

      });

  }

  private matchesPriceFilter(price: number): boolean {

    if (this.filters.price === 'free') {
      return price === 0;
    }

    if (this.filters.price === 'paid') {
      return price > 0;
    }

    if (this.filters.price === 'under-500') {
      return price > 0 && price < 500;
    }

    return true;

  }

  private formatTime(dateTime: string): string {

    return new Date(dateTime).toLocaleTimeString(
      'en-IN',
      {
        hour: '2-digit',
        minute: '2-digit'
      }
    );

  }


}
