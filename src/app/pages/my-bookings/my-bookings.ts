import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';

import { RouterLink } from '@angular/router';

import { BookingService } from '../../services/booking';

import { EventService } from '../../services/event';

import { Booking } from '../../Models/booking.model';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './my-bookings.html',
  styleUrl: './my-bookings.css'
})
export class MyBookings {

  bookings: Booking[] = [];

  get confirmedBookingsCount(): number {

    return this.bookings.filter(
      booking => booking.status === 'Confirmed'
    ).length;

  }

  get upcomingBookingsCount(): number {

    return this.bookings.filter(
      booking =>
        booking.status === 'Confirmed' &&
        this.getBookingTiming(booking) === 'Upcoming'
    ).length;

  }

  get totalTickets(): number {

    return this.bookings
      .filter(booking => booking.status === 'Confirmed')
      .reduce(
        (sum, booking) => sum + booking.tickets,
        0
      );

  }

  constructor(
    private bookingService: BookingService,
    private eventService: EventService
  ) {

    this.loadBookings();

  }

  loadBookings(): void {

    this.bookings =
      this.bookingService.getBookings().sort(
        (firstBooking, secondBooking) =>
          new Date(secondBooking.bookingDate).getTime() -
          new Date(firstBooking.bookingDate).getTime()
      );

  }

  cancelBooking(bookingId: string): void {

    const confirmed =
      window.confirm(
        'Are you sure you want to cancel this booking?'
      );

    if (!confirmed) {
      return;
    }

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
