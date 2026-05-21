import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Event } from '../../Models/event.model';
import { EventService } from '../../services/event';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

  events: Event[] = [];

  benefits = [
    { title: 'Easy Booking', text: 'Book tickets in just a few simple steps', icon: '01' },
    { title: 'Secure Booking', text: 'Choose the events you would like and book with confidence', icon: '02' },
    { title: 'Best Events', text: 'Handpicked events across Indian cities', icon: '03' },
    { title: '24/7 Support', text: 'Helpful support whenever you need it', icon: '04' }
  ];

  constructor(
    private eventService: EventService
  ) {
    this.events = this.eventService.getUpcomingActiveEvents();
  }

}
