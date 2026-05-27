import { Injectable } from '@angular/core';
import { Event } from '../Models/event.model';

@Injectable({
  providedIn: 'root',
})
export class EventService {

  private events: Event[] = [];
  private readonly eventsStorageKey = 'events';
  private readonly seededDefaultEventIds =
    new Set([1, 2, 3, 4]);

  constructor() {

    const parsedEvents =
      this.parseSavedEvents(
        this.getSavedEvents()
      );

    this.events =
      parsedEvents
        ? this.getAdminCreatedEvents(parsedEvents)
        : [];

    this.saveEvents();

  }

  private parseSavedEvents(
    savedEvents: string | null
  ): Partial<Event>[] | undefined {

    if (!savedEvents) {
      return undefined;
    }

    try {
      const parsedEvents =
        JSON.parse(savedEvents) as unknown;

      return Array.isArray(parsedEvents)
        ? parsedEvents as Partial<Event>[]
        : undefined;
    } catch {
      return undefined;
    }

  }

  getActiveEvents(): Event[] {

    return this.events.filter(
      event => event.status === 'Active'
    );

  }

  getUpcomingActiveEvents(): Event[] {

    return this.events
      .filter(
        event =>
          event.status === 'Active' &&
          this.isUpcomingEvent(event)
      )
      .sort(
        (firstEvent, secondEvent) =>
          this.getEventStartTime(firstEvent) -
          this.getEventStartTime(secondEvent)
      );

  }

  getUpcomingActiveEventById(
    id: number
  ): Event | undefined {

    return this.getUpcomingActiveEvents().find(
      event => event.id === id
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
        ? this.normalizeEvent(updatedEvent)
        : event

    );

    this.saveEvents();

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

    if (this.trySaveEvents(this.events)) {
      return;
    }

    // Uploaded data URLs can exceed localStorage limits.
    this.trySaveEvents(
      this.getPersistableEvents()
    );

  }

  private isUpcomingEvent(event: Event): boolean {

    const eventEnd =
      new Date(event.endDateTime || event.date);

    if (Number.isNaN(eventEnd.getTime())) {
      return true;
    }

    return eventEnd >= new Date();

  }

  private getEventStartTime(event: Event): number {

    const eventStart =
      new Date(event.startDateTime || event.date);

    return Number.isNaN(eventStart.getTime())
      ? Number.MAX_SAFE_INTEGER
      : eventStart.getTime();

  }

  private getAdminCreatedEvents(
    savedEvents: Partial<Event>[]
  ): Event[] {

    return savedEvents
      .filter(event =>
        event.id &&
        !this.seededDefaultEventIds.has(Number(event.id))
      )
      .map(event =>
        this.normalizeEvent(event)
      );

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

    const category =
      event.category || 'Workshop';

    const image =
      this.normalizeImagePath(event.image) ||
      this.getFallbackGallery(category)[0];

    const totalSeats =
      Number(event.totalSeats) || 0;

    const gallery =
      this.getGalleryImages(
        image,
        category,
        event.gallery
      );

    return {
      id: Number(event.id) || Date.now(),
      title: event.title || 'Untitled Event',
      category,
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
      gallery,
      totalSeats,
      availableSeats:
        event.availableSeats ?? totalSeats,
      additionalInfo: event.additionalInfo || 'Please carry your booking ID and a valid photo ID.',
      status: event.status || 'Active'
    };

  }

  private getGalleryImages(
    image: string,
    category: string,
    gallery?: string[]
  ): string[] {

    const images = [
      image,
      ...(gallery || []).map(galleryImage =>
        this.normalizeImagePath(galleryImage)
      ),
      ...this.getFallbackGallery(category)
    ];

    return Array.from(
      new Set(
        images.filter(
          (galleryImage): galleryImage is string =>
            Boolean(galleryImage)
        )
      )
    ).slice(0, 3);

  }

  private getFallbackGallery(category: string): string[] {

    const galleries: Record<string, string[]> = {
      Music: [
        'images/music/music-event.jpg',
        'images/music/music-event1.jpg',
        'images/music/musicbg.png'
      ],
      Technology: [
        'images/technology/tech.jpg',
        'images/technology/tech-banner.jpg',
        'images/technology/tech2.jpg'
      ],
      Workshop: [
        'images/technology/tech.jpg',
        'images/technology/tech2.jpg',
        'images/technology/tech-banner.jpg'
      ],
      Comedy: [
        'images/comedy/comedy-show.jpg',
        'images/comedy/comedy-show1.jpg',
        'images/comedy/comedybg.png'
      ],
      Sports: [
        'images/sports/sports-event.jpg',
        'images/sports/sport-event2.jpg',
        'images/sports/football3.jpg'
      ],
      Food: [
        'images/foods/food-festival.jpg',
        'images/foods/feed-festival-event.jpg',
        'images/foods/foodfes.png'
      ]
    };

    return galleries[category] || galleries['Workshop'];

  }

  private normalizeImagePath(
    imagePath: string | undefined
  ): string | undefined {

    if (!imagePath) {
      return undefined;
    }

    return imagePath.replace(/^\/+/, '');

  }

  private getSavedEvents(): string | null {

    try {
      return localStorage.getItem(this.eventsStorageKey);
    } catch {
      return null;
    }

  }

  private trySaveEvents(events: Event[]): boolean {

    try {
      localStorage.setItem(
        this.eventsStorageKey,
        JSON.stringify(events)
      );
      return true;
    } catch {
      return false;
    }

  }

  private getPersistableEvents(): Event[] {

    return this.events.map(event => {
      const image =
        this.getPersistableImage(event.image, event.category);

      return {
        ...event,
        image,
        gallery: this.getPersistableGallery(
          image,
          event.category,
          event.gallery
        )
      };
    });

  }

  private getPersistableGallery(
    image: string,
    category: string,
    gallery: string[]
  ): string[] {

    const persistableGallery =
      gallery.map(galleryImage =>
        this.getPersistableImage(galleryImage, category)
      );

    return this.getGalleryImages(
      image,
      category,
      persistableGallery
    );

  }

  private getPersistableImage(
    imagePath: string,
    category: string
  ): string {

    return (
      imagePath.startsWith('data:') ||
      imagePath.startsWith('blob:')
    )
      ? this.getFallbackGallery(category)[0]
      : imagePath;

  }

}
