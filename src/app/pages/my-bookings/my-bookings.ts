import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BookingService } from '../../services/booking';
import { EventService } from '../../services/event';
import { Booking } from '../../Models/booking.model';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [ CommonModule,FormsModule, RouterLink],
  templateUrl: './my-bookings.html',
  styleUrl: './my-bookings.css'
})
export class MyBookings {

  bookings: Booking[] = [];
  bookingToCancel?: Booking;
  currentAttendeeEmail = '';
  lookupEmail = '';
  private readonly attendeeEmailKey =
    'currentAttendeeEmail';

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

    this.lookupEmail =
      localStorage.getItem(this.attendeeEmailKey) || '';
    this.currentAttendeeEmail =
      this.normalizeEmail(this.lookupEmail);
    this.loadBookings();

  }

  findBookings(): void {

    this.currentAttendeeEmail =
      this.normalizeEmail(this.lookupEmail);

    if (this.currentAttendeeEmail) {
      localStorage.setItem(
        this.attendeeEmailKey,
        this.currentAttendeeEmail
      );
    }

    this.loadBookings();

  }

  loadBookings(): void {

    this.bookings =
      this.bookingService.getBookings()
        .filter(
          booking =>
            this.normalizeEmail(booking.email) === this.currentAttendeeEmail
        )
        .sort(
          (firstBooking, secondBooking) =>
            new Date(secondBooking.bookingDate).getTime() -
            new Date(firstBooking.bookingDate).getTime()
        );

  }

  openCancelDialog(booking: Booking): void {

    this.bookingToCancel = booking;

  }

  closeCancelDialog(): void {

    this.bookingToCancel = undefined;

  }

  confirmCancelBooking(): void {

    if (!this.bookingToCancel) {
      return;
    }

    const cancelledBooking =
      this.bookingService.cancelBooking(
        this.bookingToCancel.bookingId
      );

    if (cancelledBooking) {

      this.eventService.releaseSeats(
        cancelledBooking.eventId,
        cancelledBooking.tickets
      );

    }

    this.closeCancelDialog();
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

  private normalizeEmail(email: string): string {

    return email.trim().toLowerCase();

  }

}
