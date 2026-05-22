import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

import {
  FormsModule,
  NgForm
} from '@angular/forms';

import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { BookingService } from '../../services/booking';

import { EventService } from '../../services/event';

import { Booking } from '../../Models/booking.model';

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    RouterLink
  ],
  templateUrl: './booking-form.html',
  styleUrl: './booking-form.css'
})
export class BookingForm {

  @Input()
  eventTitle = '';

  @Input()
  eventDate = '';

  @Input()
  ticketPrice = 0;

  @Input()
  eventId = 0;

  @Input()
  availableSeats = 0;

  @Input()
  backLink: string | unknown[] = '';

  @Output()
  bookingCompleted = new EventEmitter<string>();

  name = '';
  email = '';
  countryCode = '+91';
  phone = '';
  tickets: number | null = null;
  bookingSuccess = false;
  bookingId = '';
  seatError = '';
  formError = '';
  readonly countryCodes = [
    {
      label: 'India',
      code: '+91'
    },
    {
      label: 'United States',
      code: '+1'
    },
    {
      label: 'United Kingdom',
      code: '+44'
    },
    {
      label: 'Australia',
      code: '+61'
    },
    {
      label: 'Canada',
      code: '+1'
    },
    {
      label: 'Singapore',
      code: '+65'
    },
    {
      label: 'United Arab Emirates',
      code: '+971'
    }
  ];
  readonly phonePattern =
    '^[0-9]{6,14}$';

  constructor(
    private bookingService: BookingService,
    private eventService: EventService
  ) {}

  get totalAmount(): number {

    return this.ticketPrice * this.selectedTickets;

  }

  private get selectedTickets(): number {

    return Number(this.tickets || 0);

  }

  confirmBooking(form: NgForm): void {

    if (form.invalid) {
      this.formError = '';
      this.seatError = '';
      form.control.markAllAsTouched();
      return;
    }

    if (this.selectedTickets < 1) {

      this.formError =
        'Please select at least 1 ticket.';

      return;

    }

    if (this.selectedTickets > this.availableSeats) {

      this.seatError =
        'Not enough seats available.';

      return;

    }

    this.formError = '';
    this.seatError = '';
    this.bookingId =
      `BK${Date.now().toString().slice(-6)}`;

    const attendeeEmail =
      this.email.trim().toLowerCase();

    const booking: Booking = {
      bookingId: this.bookingId,
      eventId: this.eventId,
      eventTitle: this.eventTitle,
      eventDate: this.eventDate,
      name: this.name.trim(),
      email: attendeeEmail,
      phone: `${this.countryCode} ${this.phone.trim()}`,
      tickets: this.selectedTickets,
      totalAmount: this.totalAmount,
      bookingDate: new Date().toISOString(),
      status: 'Confirmed'
    };

    this.bookingService.addBooking(booking);

    this.eventService.reduceSeats(
      this.eventId,
      this.selectedTickets
    );

    this.availableSeats =
      this.availableSeats - this.selectedTickets;
    this.bookingSuccess = true;
    this.bookingCompleted.emit(this.bookingId);

  }

}
