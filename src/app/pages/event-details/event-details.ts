import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BookingForm } from '../../shared/booking-form/booking-form';
import { EventService } from '../../services/event';
import { Event } from '../../Models/event.model';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [
    BookingForm,
    CommonModule
  ],
  templateUrl: './event-details.html',
  styleUrl: './event-details.css',
})
export class EventDetails {
  event?: Event;
  private eventId = 0;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService
  ) {
    this.eventId = Number(
      this.route.snapshot.paramMap.get('id')
    );

    this.loadEvent();

  }

  loadEvent(): void {

    this.event =
      this.eventService.getUpcomingActiveEventById(this.eventId);

  }

  getEventTime(event: Event): string {

    return `${this.formatTime(event.startDateTime)} - ${this.formatTime(event.endDateTime)}`;

  }

  getMapUrl(event: Event): string {

    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${event.venue}, ${event.address}, ${event.city}`
    )}`;

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
