import { Component } from '@angular/core';

import { FormsModule } from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';
import { Sidebar } from '../../layout/sidebar/sidebar';
import { EventService } from '../../services/event';
import { Event } from '../../Models/event.model';

@Component({
  selector: 'app-edit-event',
  standalone: true,
  imports: [
    Sidebar,
    FormsModule
  ],
  templateUrl: './edit-event.html',
  styleUrl: './edit-event.css'
})
export class EditEvent {

  id = 0;

  title = '';

  category = '';
  description = '';
  date = '';
  venue = '';
  price = 0;
  image = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService
  ) {

    this.id = Number(
      this.route.snapshot.paramMap.get('id')
    );

    const event =
      this.eventService.getEventById(this.id);

    if (event) {

      this.title = event.title;

      this.category = event.category;

      this.description = event.description;

      this.date = event.date;

      this.venue = event.venue;

      this.price = event.price;

      this.image = event.image;

    }

  }

  updateEvent() {
    const updatedEvent: Event = {
      id: this.id,
      title: this.title,
      category: this.category,
      description: this.description,
      date: this.date,
      venue: this.venue,
      price: this.price,
      image: this.image || 'images/workshop-event.jpg'
    };

    this.eventService.updateEvent(updatedEvent);

    alert('Event Updated Successfully');

    this.router.navigate(
      ['/organizer/manage-events']
    );

  }

}
