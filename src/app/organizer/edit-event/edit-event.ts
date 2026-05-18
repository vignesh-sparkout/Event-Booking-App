import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import { Sidebar } from '../../layout/sidebar/sidebar';

import { EventService } from '../../services/event';

import { Event } from '../../Models/event.model';

@Component({
  selector: 'app-edit-event',
  standalone: true,
  imports: [
    Sidebar,
    CommonModule,
    FormsModule
  ],
  templateUrl: './edit-event.html',
  styleUrl: './edit-event.css'
})
export class EditEvent {

  categories = [
    'Music',
    'Technology',
    'Workshop',
    'Comedy',
    'Sports',
    'Food'
  ];

  id = 0;
  title = '';
  category = '';
  description = '';
  startDateTime = '';
  endDateTime = '';
  venue = '';
  city = '';
  address = '';
  organizerName = '';
  organizerEmail = '';
  price = 0;
  image = '';
  galleryText = '';
  totalSeats = 0;
  availableSeats = 0;
  additionalInfo = '';
  status: Event['status'] = 'Active';

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
      this.startDateTime = event.startDateTime;
      this.endDateTime = event.endDateTime;
      this.venue = event.venue;
      this.city = event.city;
      this.address = event.address;
      this.organizerName = event.organizerName;
      this.organizerEmail = event.organizerEmail;
      this.price = event.price;
      this.image = event.image;
      this.galleryText = event.gallery.join(', ');
      this.totalSeats = event.totalSeats;
      this.availableSeats = event.availableSeats;
      this.additionalInfo = event.additionalInfo;
      this.status = event.status;
    }

  }

  updateEvent(): void {

    if (!this.description.trim()) {
      alert('Description is required');
      return;
    }

    if (
      this.startDateTime &&
      this.endDateTime &&
      new Date(this.endDateTime) <= new Date(this.startDateTime)
    ) {
      alert('End date and time must be after start date and time.');
      return;
    }

    const coverImage =
      this.image || 'images/workshop-event.jpg';

    const gallery =
      this.galleryText
        .split(',')
        .map(image => image.trim())
        .filter(Boolean);

    const currentEvent =
      this.eventService.getEventById(this.id);

    const soldSeats =
      currentEvent
        ? currentEvent.totalSeats - currentEvent.availableSeats
        : 0;

    const updatedEvent: Event = {
      id: this.id,
      title: this.title,
      category: this.category,
      description: this.description,
      date: this.startDateTime.slice(0, 10),
      startDateTime: this.startDateTime,
      endDateTime: this.endDateTime,
      venue: this.venue,
      city: this.city,
      address: this.address,
      organizerName: this.organizerName,
      organizerEmail: this.organizerEmail,
      price: Number(this.price),
      image: coverImage,
      gallery:
        gallery.length > 0
          ? gallery
          : [coverImage],
      totalSeats: Number(this.totalSeats),
      availableSeats: Math.max(
        Number(this.totalSeats) - soldSeats,
        0
      ),
      additionalInfo: this.additionalInfo,
      status: this.status
    };

    this.eventService.updateEvent(updatedEvent);

    alert('Event Updated Successfully');

    this.router.navigate([
      '/organizer/manage-events'
    ]);

  }

}
