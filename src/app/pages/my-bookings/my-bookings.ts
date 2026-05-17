import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';

import { BookingService } from '../../services/booking';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-bookings.html',
  styleUrl: './my-bookings.css'
})
export class MyBookings {

  bookings: any[] = [];

  constructor(
    private bookingService: BookingService
  ) {

    this.loadBookings();

  }

  loadBookings() {

    this.bookings =
      this.bookingService.getBookings();

  }

  cancelBooking(bookingId: string) {

    this.bookingService.cancelBooking(
      bookingId
    );

    this.loadBookings();

  }

}