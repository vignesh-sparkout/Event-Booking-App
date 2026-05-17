import { Component } from '@angular/core';
import { Sidebar } from '../../layout/sidebar/sidebar';
import { EventService } from '../../services/event';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [Sidebar],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  totalEvents = 0;
  totalRevenue = 0;
  categories = 0;
  nextEventTitle = '';

  constructor(
    private eventService: EventService
  ) {
    const events = this.eventService.getEvents();

    this.totalEvents = events.length;
    this.totalRevenue = events.reduce(
      (sum, event) => sum + event.price,
      0
    );
    this.categories = new Set(
      events.map(event => event.category)
    ).size;
    this.nextEventTitle = events[0]?.title ?? 'No events yet';
  }
}
