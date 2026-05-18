import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';

import { BookingService } from '../../services/booking';

import { EventService } from '../../services/event';

import { Booking } from '../../Models/booking.model';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-bookings.html',
  styleUrl: './my-bookings.css'
})
export class MyBookings {

  bookings: Booking[] = [];

  constructor(
    private bookingService: BookingService,
    private eventService: EventService
  ) {

    this.loadBookings();

  }

  loadBookings(): void {

    this.bookings =
      this.bookingService.getBookings();

  }

  cancelBooking(bookingId: string): void {

    const cancelledBooking =
      this.bookingService.cancelBooking(bookingId);

    if (cancelledBooking) {

      this.eventService.releaseSeats(
        cancelledBooking.eventId,
        cancelledBooking.tickets
      );

    }

    this.loadBookings();

  }

  canCancel(booking: Booking): boolean {

    return (
      booking.status === 'Confirmed' &&
      new Date(booking.eventDate) > new Date()
    );

  }

  getBookingTiming(booking: Booking): 'Upcoming' | 'Past' {

    return new Date(booking.eventDate) > new Date()
      ? 'Upcoming'
      : 'Past';

  }

}
