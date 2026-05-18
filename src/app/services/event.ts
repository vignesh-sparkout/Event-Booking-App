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
      description:
        'A full-day Angular conference focused on standalone APIs, routing, and production-ready UI patterns.',
      date: '2026-06-20',
      startDateTime: '2026-06-20T10:00',
      endDateTime: '2026-06-20T17:00',
      venue: 'Chennai Trade Centre',
      city: 'Chennai',
      address: 'Nandambakkam, Chennai',
      organizerName: 'Tech Circle India',
      organizerEmail: 'events@techcircle.in',
      price: 500,
      image: 'images/workshop-event.jpg',
      gallery: [
        'images/workshop-event.jpg',
        'images/tech-banner.jpg',
        'images/workshop-event1.jpg'
      ],
      totalSeats: 100,
      availableSeats: 100,
      additionalInfo: 'Bring your laptop and a valid ticket confirmation.',
      status: 'Active'
    },
    {
      id: 2,
      title: 'Music Night Festival',
      category: 'Music',
      description:
        'An outdoor live music evening featuring indie bands, food stalls, and a city-wide crowd.',
      date: '2026-06-25',
      startDateTime: '2026-06-25T18:30',
      endDateTime: '2026-06-25T22:30',
      venue: 'Palace Grounds',
      city: 'Bangalore',
      address: 'Jayamahal Road, Bangalore',
      organizerName: 'SoundStage Live',
      organizerEmail: 'hello@soundstage.in',
      price: 1000,
      image: 'images/music-event.jpg',
      gallery: [
        'images/music-event.jpg',
        'images/music-event1.jpg',
        'images/banner.jpg'
      ],
      totalSeats: 200,
      availableSeats: 200,
      additionalInfo: 'Outside food is not allowed. Gates open at 5:30 PM.',
      status: 'Active'
    },
    {
      id: 3,
      title: 'Champions Sports Carnival',
      category: 'Sports',
      description:
        'A high-energy sports festival with live screenings, fan zones, fitness challenges, and family activities.',
      date: '2026-06-30',
      startDateTime: '2026-06-30T09:00',
      endDateTime: '2026-06-30T19:00',
      venue: 'Gachibowli Stadium',
      city: 'Hyderabad',
      address: 'Gachibowli, Hyderabad',
      organizerName: 'Arena Sports Club',
      organizerEmail: 'bookings@arenasports.in',
      price: 750,
      image: 'images/sports-event.jpg',
      gallery: [
        'images/sports-event.jpg',
        'images/sport-event2.jpg',
        'images/dashboard.jpg'
      ],
      totalSeats: 150,
      availableSeats: 150,
      additionalInfo: 'Wear comfortable shoes for activity zones.',
      status: 'Active'
    },
    {
      id: 4,
      title: 'Street Food Festival',
      category: 'Food',
      description:
        'A weekend food celebration packed with regional tasting stalls, chef specials, dessert counters, and live music.',
      date: '2026-07-05',
      startDateTime: '2026-07-05T12:00',
      endDateTime: '2026-07-05T21:00',
      venue: 'Jio World Garden',
      city: 'Mumbai',
      address: 'Bandra Kurla Complex, Mumbai',
      organizerName: 'Fork Trail Events',
      organizerEmail: 'care@forktrail.in',
      price: 350,
      image: 'images/food-festival.jpg',
      gallery: [
        'images/food-festival.jpg',
        'images/feed-festival-event.jpg',
        'images/banner.jpg'
      ],
      totalSeats: 120,
      availableSeats: 120,
      additionalInfo: 'Entry includes access to all public tasting counters.',
      status: 'Active'
    }
  ];

  constructor() {

    const savedEvents =
      localStorage.getItem('events');

    if (savedEvents) {

      const parsedEvents = JSON.parse(savedEvents) as Partial<Event>[];
      this.events = this.mergeDefaultEvents(parsedEvents);

    }

    else {

      this.events = [...this.defaultEvents];

      this.saveEvents();

    }

  }

  getEvents(): Event[] {

    return [...this.events];

  }

  getActiveEvents(): Event[] {

    return this.events.filter(
      event => event.status === 'Active'
    );

  }

  getEventById(
    id: number
  ): Event | undefined {

    return this.events.find(
      event => event.id === id
    );

  }

  addEvent(event: Event): void {

    this.events.push(
      this.normalizeEvent(event)
    );

    this.saveEvents();

  }

  updateEvent(
    updatedEvent: Event
  ): void {

    this.events = this.events.map(event =>

      event.id === updatedEvent.id
        ? updatedEvent
        : event

    );

    this.saveEvents();

  }

  deleteEvent(id: number): void {

    this.cancelEvent(id);

  }

  cancelEvent(id: number): void {

    this.events =
      this.events.map(
        event =>
          event.id === id
            ? {
                ...event,
                status: 'Cancelled'
              }
            : event
      );

    this.saveEvents();

  }

  reduceSeats(
    eventId: number,
    bookedTickets: number
  ): void {

    this.events = this.events.map(event => {

      if (event.id === eventId) {

        return {

          ...event,

          availableSeats:
            Math.max(
              event.availableSeats - bookedTickets,
              0
            )

        };

      }

      return event;

    });

    this.saveEvents();

  }

  releaseSeats(
    eventId: number,
    tickets: number
  ): void {

    this.events = this.events.map(event => {

      if (event.id === eventId) {

        return {
          ...event,
          availableSeats: Math.min(
            event.availableSeats + tickets,
            event.totalSeats
          )
        };

      }

      return event;

    });

    this.saveEvents();

  }

  private saveEvents(): void {

    localStorage.setItem(
      'events',
      JSON.stringify(this.events)
    );

  }

  private mergeDefaultEvents(
    savedEvents: Partial<Event>[]
  ): Event[] {

    const defaultEventIds = new Set(
      this.defaultEvents.map(
        event => event.id
      )
    );

    const savedById = new Map(
      savedEvents
        .filter(event => event.id)
        .map(event => [
          Number(event.id),
          event
        ])
    );

    const mergedDefaults =
      this.defaultEvents.map(defaultEvent =>
        this.normalizeEvent({
          ...defaultEvent,
          ...savedById.get(defaultEvent.id)
        })
      );

    const customEvents =
      savedEvents
        .filter(
          event =>
            event.id &&
            !defaultEventIds.has(event.id)
        )
        .map(event =>
          this.normalizeEvent(event)
        );

    const mergedEvents = [
      ...mergedDefaults,
      ...customEvents,
    ];

    localStorage.setItem(
      'events',
      JSON.stringify(mergedEvents)
    );

    return mergedEvents;

  }

  private normalizeEvent(event: Partial<Event>): Event {

    const rawDate =
      event.date ||
      event.startDateTime?.slice(0, 10) ||
      new Date().toISOString().slice(0, 10);

    const parsedDate =
      new Date(rawDate);

    const date =
      Number.isNaN(parsedDate.getTime())
        ? new Date().toISOString().slice(0, 10)
        : parsedDate.toISOString().slice(0, 10);

    const image =
      event.image ||
      'images/workshop-event.jpg';

    const totalSeats =
      Number(event.totalSeats) || 0;

    return {
      id: Number(event.id) || Date.now(),
      title: event.title || 'Untitled Event',
      category: event.category || 'Workshop',
      description: event.description || '',
      date,
      startDateTime:
        event.startDateTime ||
        `${date}T10:00`,
      endDateTime:
        event.endDateTime ||
        `${date}T18:00`,
      venue: event.venue || 'Venue to be announced',
      city: event.city || event.venue || 'City to be announced',
      address: event.address || event.venue || 'Address to be announced',
      organizerName: event.organizerName || 'Event Organizer',
      organizerEmail: event.organizerEmail || 'organizer@example.com',
      price: Number(event.price) || 0,
      image,
      gallery:
        event.gallery && event.gallery.length > 0
          ? event.gallery
          : [image],
      totalSeats,
      availableSeats:
        event.availableSeats ?? totalSeats,
      additionalInfo: event.additionalInfo || 'Please carry your booking ID and a valid photo ID.',
      status: event.status || 'Active'
    };

  }

}
