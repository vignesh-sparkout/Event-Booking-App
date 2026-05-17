import { Injectable } from '@angular/core';
import { Event } from '../Models/event.model';

@Injectable({
  providedIn: 'root',
})
export class EventService {
 
  events: Event[] = [];

  constructor() {

    const savedEvents =
      localStorage.getItem('events');

    if (savedEvents) {

      this.events = JSON.parse(savedEvents);

    }
    else {

      this.events = [

        {
          id: 1,
          title: 'Angular Conference 2026',
          category: 'Technology',
          date: '20 June 2026',
          venue: 'Chennai',
          price: 500,
          image: 'assets/images/tech-banner.jpg'
        },

        {
          id: 2,
          title: 'Music Night Festival',
          category: 'Music',
          date: '25 June 2026',
          venue: 'Bangalore',
          price: 1000,
          image: 'assets/images/music-banner.jpg'
        }

      ];

      localStorage.setItem(
        'events',
        JSON.stringify(this.events)
      );

    }

  }

  getEvents() {
    return this.events;
  }

  getEventById(id: number) {

    return this.events.find(
      event => event.id === id
    );

  }

  addEvent(event: Event) {

    this.events.push(event);

    localStorage.setItem(
      'events',
      JSON.stringify(this.events)
    );

  }
  deleteEvent(id: number) {

  this.events = this.events.filter(
    event => event.id !== id
  );

  localStorage.setItem(
    'events',
    JSON.stringify(this.events)
  );

}
updateEvent(updatedEvent: Event) {

  this.events = this.events.map(event =>

    event.id === updatedEvent.id
      ? updatedEvent
      : event

  );

  localStorage.setItem(
    'events',
    JSON.stringify(this.events)
  );

}

}
