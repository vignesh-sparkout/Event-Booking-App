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
  readonly phonePattern =
    '^\\+[1-9][0-9]{0,3}[\\s-]?[0-9]{6,14}$';

  constructor(
    private bookingService: BookingService,
    private eventService: EventService
  ) {}

  get totalAmount(): number {

    return this.ticketPrice * this.tickets;

  }

  confirmBooking(form: NgForm): void {

    if (form.invalid) {
      this.formError = '';
      this.seatError = '';
      form.control.markAllAsTouched();
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
      name: this.name.trim(),
      email: this.email.trim(),
      phone: this.phone.trim(),
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
