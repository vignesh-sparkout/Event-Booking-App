import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { Sidebar } from '../../layout/sidebar/sidebar';

import { EventService } from '../../services/event';

import { Event } from '../../Models/event.model';

@Component({
  selector: 'app-create-event',
  standalone: true,
  imports: [
    Sidebar,
    CommonModule,
    FormsModule
  ],
  templateUrl: './create-event.html',
  styleUrl: './create-event.css'
})
export class CreateEvent {

  categories = [
    'Music',
    'Technology',
    'Workshop',
    'Comedy',
    'Sports',
    'Food'
  ];

  title = '';
  category = 'Technology';
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
  additionalInfo = '';

  constructor(
    private eventService: EventService
  ) {}

  createEvent(): void {

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

    const newEvent: Event = {
      id: Date.now(),
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
      availableSeats: Number(this.totalSeats),
      additionalInfo: this.additionalInfo,
      status: 'Active'
    };

    this.eventService.addEvent(newEvent);

    alert('Event Created Successfully');
    this.resetForm();

  }

  private resetForm(): void {

    this.title = '';
    this.category = 'Technology';
    this.description = '';
    this.startDateTime = '';
    this.endDateTime = '';
    this.venue = '';
    this.city = '';
    this.address = '';
    this.organizerName = '';
    this.organizerEmail = '';
    this.price = 0;
    this.image = '';
    this.galleryText = '';
    this.totalSeats = 0;
    this.additionalInfo = '';

  }

}
