import { Component } from '@angular/core';

import { FormsModule } from '@angular/forms';

import { Sidebar } from '../../layout/sidebar/sidebar';

import { EventService } from '../../services/event';

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

  date = '';

  venue = '';

  price = 0;

  image = '';

  constructor(
    private eventService: EventService
  ) {}

  createEvent() {

    const newEvent = {

      id: Date.now(),

      title: this.title,

      category: this.category,

      date: this.date,

      venue: this.venue,

      price: this.price,

      image: this.image

    };

    this.eventService.addEvent(newEvent);

    alert('Event Created Successfully');

  }

}