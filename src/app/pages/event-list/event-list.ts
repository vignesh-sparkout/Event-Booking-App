import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EventService } from '../../services/event';
import { SearchBar } from '../../shared/search-bar/search-bar';
import { Event } from '../../Models/event.model';
import { FilterBar } from '../../shared/filter-bar/filter-bar';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [RouterLink, CommonModule, SearchBar,FilterBar],
  templateUrl: './event-list.html',
  styleUrl: './event-list.css',
})
export class EventList {
  events: Event[] = [];

  constructor(
    private eventService: EventService
  ) {
    this.events = this.eventService.getEvents();
  }

  searchEvents(searchText: string): void {
    this.events =
      this.eventService.getEvents().filter(
        event =>
          event.title.toLowerCase().includes(
            searchText.toLowerCase()
          )
      );
  }
filterEvents(category: string) {

  if (!category) {

    this.events =
      this.eventService.getEvents();

    return;

  }

  this.events =
    this.eventService.getEvents().filter(
      event =>
        event.category === category
    );

}


}
