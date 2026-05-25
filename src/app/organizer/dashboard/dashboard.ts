import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Sidebar } from '../../layout/sidebar/sidebar';
import { EventService } from '../../services/event';
import { BookingService } from '../../services/booking';
import { Event } from '../../Models/event.model';
import { Booking } from '../../Models/booking.model';

interface DashboardStat {
  label: string;
  value: string | number;
  note: string;
  tone: string;
}

interface EventSummary {
  event: Event;
  ticketsSold: number;
  revenue: number;
  occupancy: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, Sidebar],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  events: Event[] = [];
  recentBookings: Booking[] = [];
  stats: DashboardStat[] = [];
  eventSummaries: EventSummary[] = [];
  totalEvents = 0;
  totalRevenue = 0;
  ticketsSold = 0;
  seatsRemaining = 0;
  totalSeats = 0;
  categories = 0;
  occupancyRate = 0;
  nextEventTitle = '';
  featuredEvent?: Event;

  constructor(
    private eventService: EventService,
    private bookingService: BookingService
  ) {
    this.events =
      this.eventService.getUpcomingActiveEvents();

    const bookings =
      this.bookingService.getBookings().filter(
        booking => booking.status === 'Confirmed'
      );

    this.totalEvents = this.events.length;
    this.totalRevenue = bookings.reduce(
      (sum, booking) => sum + booking.totalAmount,
      0
    );
    this.ticketsSold = bookings.reduce(
      (sum, booking) => sum + booking.tickets,
      0
    );
    this.seatsRemaining = this.events.reduce(
      (sum, event) => sum + event.availableSeats,
      0
    );
    this.totalSeats = this.events.reduce(
      (sum, event) => sum + event.totalSeats,
      0
    );
    this.categories = new Set(
      this.events.map(event => event.category)
    ).size;
    this.occupancyRate =
      this.totalSeats > 0
        ? Math.round((this.ticketsSold / this.totalSeats) * 100)
        : 0;
    this.featuredEvent = this.events[0];
    this.nextEventTitle = this.featuredEvent?.title ?? 'No events yet';
    this.recentBookings =
      bookings
        .sort(
          (firstBooking, secondBooking) =>
            new Date(secondBooking.bookingDate).getTime() -
            new Date(firstBooking.bookingDate).getTime()
        )
        .slice(0, 4);
    this.eventSummaries =
      this.events
        .slice(0, 4)
        .map(event => this.getEventSummary(event));
    this.stats = [
      {
        label: 'Live Events',
        value: this.totalEvents,
        note: `${this.categories} active categories`,
        tone: 'blue'
      },
      {
        label: 'Revenue',
        value: `Rs. ${this.totalRevenue.toLocaleString('en-IN')}`,
        note: 'Confirmed bookings only',
        tone: 'violet'
      },
      {
        label: 'Tickets Sold',
        value: this.ticketsSold,
        note: `${this.occupancyRate}% seat occupancy`,
        tone: 'green'
      },
      {
        label: 'Seats Open',
        value: this.seatsRemaining,
        note: `${this.totalSeats} total listed seats`,
        tone: 'amber'
      }
    ];
  }

  getEventDate(event: Event): string {

    return new Date(event.startDateTime || event.date).toLocaleDateString(
      'en-IN',
      {
        day: '2-digit',
        month: 'short'
      }
    );

  }

  private getEventSummary(event: Event): EventSummary {

    const ticketsSold =
      this.bookingService.getTicketsSold(event.id);
    const revenue =
      this.bookingService.getRevenueForEvent(event.id);
    const occupancy =
      event.totalSeats > 0
        ? Math.round((ticketsSold / event.totalSeats) * 100)
        : 0;

    return {
      event,
      ticketsSold,
      revenue,
      occupancy
    };

  }

}
