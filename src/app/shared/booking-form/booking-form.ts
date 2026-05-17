import { Component, Input } from '@angular/core';

import { FormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';

import { BookingService } from '../../services/booking';

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

  name = '';

  email = '';

  phone = '';

  tickets = 1;

  bookingSuccess = false;

  bookingId = '';

  constructor(
    private bookingService: BookingService
  ) {}

  confirmBooking() {

    this.bookingId =
      'BK' + Math.floor(Math.random() * 100000);

    const booking = {

      bookingId: this.bookingId,

      eventTitle: this.eventTitle,

      name: this.name,

      email: this.email,

      phone: this.phone,

      tickets: this.tickets,

      status: 'Confirmed'

    };

    this.bookingService.addBooking(booking);

    this.bookingSuccess = true;

  }

}