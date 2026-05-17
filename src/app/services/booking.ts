import { Injectable } from '@angular/core';

import { Booking } from '../Models/booking.model';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  bookings: Booking[] = [];

  constructor() {

    const savedBookings =
      localStorage.getItem('bookings');

    if (savedBookings) {

      this.bookings =
        JSON.parse(savedBookings);

    }

  }

  getBookings() {

    return this.bookings;

  }

  addBooking(booking: Booking) {

    this.bookings.push(booking);

    localStorage.setItem(
      'bookings',
      JSON.stringify(this.bookings)
    );

  }
  cancelBooking(bookingId: string) {

  this.bookings = this.bookings.map(
    booking =>

      booking.bookingId === bookingId
        ? {
            ...booking,
            status: 'Cancelled'
          }
        : booking

  );

  localStorage.setItem(
    'bookings',
    JSON.stringify(this.bookings)
  );

}

}