import { CommonModule } from '@angular/common';
import {Component} from '@angular/core';
import {ActivatedRoute,RouterLink} from '@angular/router';
import { Event } from '../../Models/event.model';
import { BookingForm } from '../../shared/booking-form/booking-form';
import { EventService } from '../../services/event';

@Component({
  selector: 'app-ticket-booking',
  standalone: true,
  imports: [CommonModule,RouterLink,BookingForm],
  templateUrl: './ticket-booking.html',
  styleUrl: './ticket-booking.css'
})
export class TicketBooking {

  event?: Event;
  showSuccessModal = false;
  successBookingId = '';
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

  completeBooking(bookingId: string): void {

    this.loadEvent();
    this.successBookingId = bookingId;
    this.showSuccessModal = true;

  }

  getEventTime(event: Event): string {

    return `${this.formatTime(event.startDateTime)} - ${this.formatTime(event.endDateTime)}`;

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
