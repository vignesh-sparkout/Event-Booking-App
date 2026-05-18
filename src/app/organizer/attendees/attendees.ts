import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';

import { ActivatedRoute } from '@angular/router';

import { Sidebar } from '../../layout/sidebar/sidebar';

import { BookingService } from '../../services/booking';

import { Booking } from '../../Models/booking.model';

@Component({
  selector: 'app-attendees',
  standalone: true,
  imports: [
    Sidebar,
    CommonModule
  ],
  templateUrl: './attendees.html',
  styleUrl: './attendees.css'
})
export class Attendees {

  bookings: Booking[] = [];
  eventId = 0;

  constructor(
    private route: ActivatedRoute,
    private bookingService: BookingService
  ) {

    this.eventId = Number(
      this.route.snapshot.paramMap.get('id')
    );

    const allBookings =
      this.bookingService.getBookings();

    this.bookings =
      this.eventId > 0
        ? allBookings.filter(
            booking => booking.eventId === this.eventId
          )
        : allBookings;

  }

}
