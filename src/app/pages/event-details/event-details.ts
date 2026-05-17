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

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService
  ) {
    const eventId = Number(
      this.route.snapshot.paramMap.get('id')
    );

    this.event =
      this.eventService.getEventById(eventId);
  }
}
