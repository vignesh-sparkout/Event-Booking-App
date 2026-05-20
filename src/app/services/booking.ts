import { Injectable } from '@angular/core';

import { Booking } from '../Models/booking.model';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  private bookings: Booking[] = [];

  constructor() {

    const savedBookings =
      localStorage.getItem('bookings');
    const parsedBookings =
      this.parseSavedBookings(savedBookings);

    if (parsedBookings) {

      this.bookings =
        parsedBookings.map(booking =>
          this.normalizeBooking(booking)
        );

    }

  }

  private parseSavedBookings(
    savedBookings: string | null
  ): Partial<Booking>[] | undefined {

    if (!savedBookings) {
      return undefined;
    }

    try {
      const parsedBookings =
        JSON.parse(savedBookings) as unknown;

      return Array.isArray(parsedBookings)
        ? parsedBookings as Partial<Booking>[]
        : undefined;
    } catch {
      return undefined;
    }

  }

  getBookings(): Booking[] {

    return [...this.bookings];

  }

  addBooking(booking: Booking): void {

    this.bookings.push(
      this.normalizeBooking(booking)
    );

    this.saveBookings();

  }

  cancelBooking(bookingId: string): Booking | undefined {

    let cancelledBooking: Booking | undefined;

    this.bookings = this.bookings.map(booking => {

      if (
        booking.bookingId === bookingId &&
        booking.status === 'Confirmed'
      ) {

        cancelledBooking = booking;

        return {
          ...booking,
          status: 'Cancelled'
        };

      }

      return booking;

    });

    this.saveBookings();

    return cancelledBooking;

  }

  getBookingsByEvent(eventId: number): Booking[] {

    return this.bookings.filter(
      booking =>
        booking.eventId === eventId &&
        booking.status === 'Confirmed'
    );

  }

  getTicketsSold(eventId: number): number {

    return this.getBookingsByEvent(eventId).reduce(
      (total, booking) => total + booking.tickets,
      0
    );

  }

  getRevenueForEvent(eventId: number): number {

    return this.getBookingsByEvent(eventId).reduce(
      (total, booking) => total + booking.totalAmount,
      0
    );

  }

  private saveBookings(): void {

    localStorage.setItem(
      'bookings',
      JSON.stringify(this.bookings)
    );

  }

  private normalizeBooking(booking: Partial<Booking>): Booking {

    return {
      bookingId:
        booking.bookingId ||
        `BK${Date.now()}`,
      eventId: Number(booking.eventId) || 0,
      eventTitle: booking.eventTitle || 'Untitled Event',
      eventDate: booking.eventDate || '',
      name: booking.name || '',
      email: booking.email || '',
      phone: booking.phone || '',
      tickets: Number(booking.tickets) || 1,
      totalAmount: Number(booking.totalAmount) || 0,
      bookingDate:
        booking.bookingDate ||
        new Date().toISOString(),
      status: booking.status || 'Confirmed'
    };

  }

}
