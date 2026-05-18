import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

import { FormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';

import { BookingService } from '../../services/booking';

import { EventService } from '../../services/event';

import { Booking } from '../../Models/booking.model';

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
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

  @Output()
  bookingCompleted = new EventEmitter<void>();

  name = '';
  email = '';
  phone = '';
  tickets = 1;
  bookingSuccess = false;
  bookingId = '';
  seatError = '';
  formError = '';

  constructor(
    private bookingService: BookingService,
    private eventService: EventService
  ) {}

  get totalAmount(): number {

    return this.ticketPrice * this.tickets;

  }

  confirmBooking(): void {

    if (!this.name || !this.email || !this.phone) {

      this.formError =
        'Please enter name, email, and phone number.';

      return;

    }

    if (this.tickets < 1) {

      this.formError =
        'Please select at least 1 ticket.';

      return;

    }

    if (this.tickets > this.availableSeats) {

      this.seatError =
        'Not enough seats available.';

      return;

    }

    this.formError = '';
    this.seatError = '';
    this.bookingId =
      `BK${Date.now().toString().slice(-6)}`;

    const booking: Booking = {
      bookingId: this.bookingId,
      eventId: this.eventId,
      eventTitle: this.eventTitle,
      eventDate: this.eventDate,
      name: this.name,
      email: this.email,
      phone: this.phone,
      tickets: this.tickets,
      totalAmount: this.totalAmount,
      bookingDate: new Date().toISOString(),
      status: 'Confirmed'
    };

    this.bookingService.addBooking(booking);

    this.eventService.reduceSeats(
      this.eventId,
      this.tickets
    );

    this.availableSeats =
      this.availableSeats - this.tickets;
    this.bookingSuccess = true;
    this.bookingCompleted.emit();

  }

}
