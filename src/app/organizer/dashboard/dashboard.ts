import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sidebar } from '../../layout/sidebar/sidebar';
import { EventService } from '../../services/event';
import { BookingService } from '../../services/booking';
import { Event } from '../../Models/event.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    Sidebar
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  totalEvents = 0;
  totalRevenue = 0;
  ticketsSold = 0;
  seatsRemaining = 0;
  categories = 0;
  nextEventTitle = '';
  featuredEvent?: Event;

  constructor(
    private eventService: EventService,
    private bookingService: BookingService
  ) {
    const events = this.eventService.getEvents();
    const bookings =
      this.bookingService.getBookings().filter(
        booking => booking.status === 'Confirmed'
      );

    this.totalEvents = events.length;
    this.totalRevenue = bookings.reduce(
      (sum, booking) => sum + booking.totalAmount,
      0
    );
    this.ticketsSold = bookings.reduce(
      (sum, booking) => sum + booking.tickets,
      0
    );
    this.seatsRemaining = events.reduce(
      (sum, event) => sum + event.availableSeats,
      0
    );
    this.categories = new Set(
      events.map(event => event.category)
    ).size;
    this.featuredEvent = events[0];
    this.nextEventTitle = this.featuredEvent?.title ?? 'No events yet';
  }
}
