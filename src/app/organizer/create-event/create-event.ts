import { Component } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { Sidebar } from '../../layout/sidebar/sidebar';
import { EventService } from '../../services/event';
import { Event } from '../../Models/event.model';

@Component({
  selector: 'app-create-event',
  standalone: true,
  imports: [
    Sidebar,
    FormsModule
  ],
  templateUrl: './create-event.html',
  styleUrl: './create-event.css'
})
export class CreateEvent {
  title = '';
  category = '';
  description = '';
  date = '';
  venue = '';
  price = 0;
  image = '';

  constructor(
    private eventService: EventService
  ) {}

  createEvent(): void {
    const newEvent: Event = {
      id: Date.now(),
      title: this.title,
      category: this.category,
      description: this.description,
      date: this.date,
      venue: this.venue,
      price: this.price,
      image: this.image || 'images/workshop-event.jpg',
    };

    this.eventService.addEvent(newEvent);

    alert('Event Created Successfully');
    this.title = '';
    this.category = '';
    this.description = '';
    this.date = '';
    this.venue = '';
    this.price = 0;
    this.image = '';
  }
}
