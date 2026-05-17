import { Injectable } from '@angular/core';
import { Event } from '../Models/event.model';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private events: Event[] = [];
  private readonly defaultEvents: Event[] = [
    {
      id: 1,
      title: 'Angular Conference 2026',
      category: 'Technology',
      description: 'A full-day Angular conference focused on standalone APIs, routing, and production-ready UI patterns.',
      date: '20 June 2026',
      venue: 'Chennai',
      price: 500,
      image: 'images/workshop-event.jpg',
    },
    {
      id: 2,
      title: 'Music Night Festival',
      category: 'Music',
      description: 'An outdoor live music evening featuring indie bands, food stalls, and a city-wide crowd.',
      date: '25 June 2026',
      venue: 'Bangalore',
      price: 1000,
      image: 'images/music-event.jpg',
    },
    {
      id: 3,
      title: 'Champions Sports Carnival',
      category: 'Sports',
      description: 'A high-energy sports festival with live screenings, fan zones, fitness challenges, and family activities.',
      date: '30 June 2026',
      venue: 'Hyderabad',
      price: 750,
      image: 'images/sports-event.jpg',
    },
    {
      id: 4,
      title: 'Street Food Festival',
      category: 'Food',
      description: 'A weekend food celebration packed with regional tasting stalls, chef specials, dessert counters, and live music.',
      date: '05 July 2026',
      venue: 'Mumbai',
      price: 350,
      image: 'images/food-festival.jpg',
    },
  ];

  constructor() {
    const savedEvents = localStorage.getItem('events');

    if (savedEvents) {
      const parsedEvents = JSON.parse(savedEvents) as Event[];
      this.events = this.mergeDefaultEvents(parsedEvents);
    } else {
      this.events = [...this.defaultEvents];
      this.saveEvents();
    }
  }

  getEvents(): Event[] {
    return [...this.events];
  }

  getEventById(id: number): Event | undefined {
    return this.events.find(event => event.id === id);
  }

  addEvent(event: Event): void {
    this.events.push(event);
    this.saveEvents();
  }

  updateEvent(updatedEvent: Event): void {
    this.events = this.events.map(event =>
      event.id === updatedEvent.id ? updatedEvent : event
    );

    this.saveEvents();
  }

  deleteEvent(id: number): void {
    this.events = this.events.filter(event => event.id !== id);
    this.saveEvents();
  }

  private saveEvents(): void {
    localStorage.setItem('events', JSON.stringify(this.events));
  }

  private mergeDefaultEvents(savedEvents: Event[]): Event[] {
    const defaultEventIds = new Set(
      this.defaultEvents.map(event => event.id)
    );

    const customEvents = savedEvents.filter(
      event => !defaultEventIds.has(event.id)
    );

    const mergedEvents = [
      ...this.defaultEvents,
      ...customEvents,
    ];

    localStorage.setItem(
      'events',
      JSON.stringify(mergedEvents)
    );

    return mergedEvents;
  }
}
