import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BookingService } from '../../services/booking';
import { EventService } from '../../services/event';
import { Booking } from '../../Models/booking.model';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './my-bookings.html',
  styleUrl: './my-bookings.css'
})
export class MyBookings {

  bookings: Booking[] = [];
  bookingToCancel?: Booking;
  currentAttendeeEmail = '';

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
    private eventService: EventService,
    private authService: AuthService
  ) {

    const currentUser =
      this.authService.currentUser;

    this.currentAttendeeEmail =
      this.normalizeEmail(currentUser?.email || '');

    this.loadBookings();

  }

  loadBookings(): void {

    if (!this.currentAttendeeEmail) {
      this.bookings = [];
      return;
    }

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

    if (!this.isCurrentUserBooking(booking)) {
      return;
    }

    this.bookingToCancel = booking;

  }

  closeCancelDialog(): void {

    this.bookingToCancel = undefined;

  }

  confirmCancelBooking(): void {

    if (
      !this.bookingToCancel ||
      !this.isCurrentUserBooking(this.bookingToCancel)
    ) {
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
      this.isCurrentUserBooking(booking) &&
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

  private isCurrentUserBooking(booking: Booking): boolean {

    return (
      Boolean(this.currentAttendeeEmail) &&
      this.normalizeEmail(booking.email) === this.currentAttendeeEmail
    );

  }

}
