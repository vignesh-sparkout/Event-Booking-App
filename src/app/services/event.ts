import { Injectable } from '@angular/core';

import { Event } from '../Models/event.model';

@Injectable({
  providedIn: 'root',
})
export class EventService {

  private events: Event[] = [];
  private readonly eventsStorageKey = 'events';

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
      image: 'images/technology/tech.jpg',
      gallery: [
        'images/technology/tech.jpg',
        'images/technology/tech-banner.jpg',
        'images/technology/tech2.jpg'
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
      date: '2026-05-30',
      startDateTime: '2026-06-25T18:30',
      endDateTime: '2026-06-25T22:30',
      venue: 'Palace Grounds',
      city: 'Bangalore',
      address: 'Jayamahal Road, Bangalore',
      organizerName: 'SoundStage Live',
      organizerEmail: 'hello@soundstage.in',
      price: 1000,
      image: 'images/music/music1.png',
      gallery: [
        'images/music/music 2.png',
        'images/music/music3.png',
        'images/music/music-event.jpg'
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
      image: 'images/sports/sports-event.jpg',
      gallery: [
        'images/sports/sports-event.jpg',
        'images/sports/sport-event2.jpg',
        'images/sports/football3.jpg'
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
      image: 'images/foods/food-festival.jpg',
      gallery: [
        'images/foods/food-festival.jpg',
        'images/foods/feed-festival-event.jpg',
        'images/foods/foodfes.png'
      ],
      totalSeats: 120,
      availableSeats: 120,
      additionalInfo: 'Entry includes access to all public tasting counters.',
      status: 'Active'
    }
  ];

  constructor() {

    const savedEvents =
      this.getSavedEvents();
    const parsedEvents =
      this.parseSavedEvents(savedEvents);

    if (parsedEvents) {

      this.events = this.mergeDefaultEvents(parsedEvents);

    }

    else {

      this.events = [...this.defaultEvents];

      this.saveEvents();

    }

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

  getEvents(): Event[] {

    return [...this.events];

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

    if (!this.trySaveEvents(mergedEvents)) {
      this.trySaveEvents(
        this.getPersistableEvents(mergedEvents)
      );
    }

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

    const category =
      event.category || 'Workshop';

    const image =
      this.normalizeImagePath(event.image, category) ||
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
        this.normalizeImagePath(galleryImage, category)
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
    imagePath: string | undefined,
    category: string
  ): string | undefined {

    if (!imagePath) {
      return undefined;
    }

    if (
      imagePath.startsWith('data:') ||
      imagePath.startsWith('blob:') ||
      imagePath.startsWith('http://') ||
      imagePath.startsWith('https://')
    ) {
      return imagePath;
    }

    const normalizedPath =
      imagePath.replace(/^\/+/, '');

    if (!normalizedPath.startsWith('images/')) {
      return normalizedPath;
    }

    const legacyImagePaths: Record<string, string> = {
      'images/baseketball.png': 'images/sports/baseketball.png',
      'images/baseketball1.png': 'images/sports/baseketball1.png',
      'images/baseketball2.png': 'images/sports/baseketball2.png',
      'images/comedy-show.jpg': 'images/comedy/comedy-show.jpg',
      'images/comedy-show1.jpg': 'images/comedy/comedy-show1.jpg',
      'images/comedy1.png': 'images/comedy/comedy1.png',
      'images/comedy2.png': 'images/comedy/comedy2.png',
      'images/comedybg.png': 'images/comedy/comedybg.png',
      'images/dashboard.jpg': 'images/home/dashboard.jpg',
      'images/eventsexample.png': 'images/home/eventsexample.png',
      'images/example.png': 'images/home/eventsexample.png',
      'images/feed-festival-event.jpg': 'images/foods/feed-festival-event.jpg',
      'images/food-festival.jpg': 'images/foods/food-festival.jpg',
      'images/food1.png': 'images/foods/food1.png',
      'images/food2.png': 'images/foods/food2.png',
      'images/foodfes.png': 'images/foods/foodfes.png',
      'images/football.png': 'images/sports/football.png',
      'images/football1.png': 'images/sports/football1.png',
      'images/football2.png': 'images/sports/football2.png',
      'images/football3.jpg': 'images/sports/football3.jpg',
      'images/homebg.png': 'images/home/eventsexample.png',
      'images/homepage.png': 'images/home/eventsexample.png',
      'images/homepage1.png': 'images/home/eventsexample.png',
      'images/music 2.png': 'images/music/music 2.png',
      'images/music-event.jpg': 'images/music/music-event.jpg',
      'images/music-event1.jpg': 'images/music/music-event1.jpg',
      'images/music1.png': 'images/music/music1.png',
      'images/music2.png': 'images/music/music 2.png',
      'images/music3.png': 'images/music/music3.png',
      'images/music4.png': 'images/music/music4.png',
      'images/musicbg.png': 'images/music/musicbg.png',
      'images/sport-event2.jpg': 'images/sports/sport-event2.jpg',
      'images/sports-event.jpg': 'images/sports/sports-event.jpg',
      'images/sports.png': 'images/sports/sports.png',
      'images/sportsbg.png': 'images/sports/sportsbg.png',
      'images/tech-banner.jpg': 'images/technology/tech-banner.jpg',
      'images/tech.jpg': 'images/technology/tech.jpg',
      'images/tech2.jpg': 'images/technology/tech2.jpg',
      'images/workshop-event.jpg': 'images/technology/tech.jpg',
      'images/workshop-event1.jpg': 'images/technology/tech2.jpg'
    };

    if (legacyImagePaths[normalizedPath]) {
      return legacyImagePaths[normalizedPath];
    }

    if (normalizedPath === 'images/banner.jpg') {
      return this.getCategoryBanner(category);
    }

    return normalizedPath;

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

  private getPersistableEvents(
    events = this.events
  ): Event[] {

    return events.map(event => {
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

    return this.isUploadedImageData(imagePath)
      ? this.getFallbackGallery(category)[0]
      : imagePath;

  }

  private isUploadedImageData(imagePath: string): boolean {

    return (
      imagePath.startsWith('data:') ||
      imagePath.startsWith('blob:')
    );

  }

  private getCategoryBanner(category: string): string {

    const categoryBanners: Record<string, string> = {
      Music: 'images/music/musicbg.png',
      Technology: 'images/technology/tech-banner.jpg',
      Workshop: 'images/technology/tech-banner.jpg',
      Comedy: 'images/comedy/comedybg.png',
      Sports: 'images/sports/sportsbg.png',
      Food: 'images/foods/foodfes.png'
    };

    return categoryBanners[category] || categoryBanners['Workshop'];

  }

}
