import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sidebar } from '../../layout/sidebar/sidebar';
import { EventService } from '../../services/event';
import { BookingService } from '../../services/booking';
import { RouterLink } from '@angular/router';
import { Event } from '../../Models/event.model';
@Component({
  selector: 'app-manage-events',
  standalone: true,
  imports: [
    Sidebar,
    CommonModule,
    RouterLink
  ],
  templateUrl: './manage-events.html',
  styleUrl: './manage-events.css'
})
export class ManageEvents {

  events: Event[] = [];

  constructor(
    private eventService: EventService,
    private bookingService: BookingService
  ) {

    this.events =
      this.eventService.getEvents();

  }

  cancelEvent(id: number): void {

    this.eventService.cancelEvent(id);

    this.events =
      this.eventService.getEvents();

  }

  getTicketsSold(eventId: number): number {

    return this.bookingService.getTicketsSold(eventId);

  }

  getRevenue(eventId: number): number {

    return this.bookingService.getRevenueForEvent(eventId);

  }

}
