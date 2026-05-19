import {
  Component,
  ElementRef,
  ViewChild
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  FormsModule,
  NgForm
} from '@angular/forms';

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

  @ViewChild('descriptionEditor')
  private descriptionEditor?: ElementRef<HTMLElement>;

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
  validationMessage = '';

  private readonly emailPattern =
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  constructor(
    private eventService: EventService
  ) {}

  createEvent(form: NgForm): void {

    this.validationMessage = '';

    const missingField =
      this.getFirstMissingRequiredField();

    if (missingField) {
      this.validationMessage =
        `${missingField.label} is required.`;
      this.markFieldAsTouched(form, missingField.name);
      return;
    }

    if (!this.emailPattern.test(this.organizerEmail.trim())) {
      this.validationMessage =
        'Please enter a valid organizer email address.';
      this.markFieldAsTouched(form, 'organizerEmail');
      return;
    }

    if (Number(this.price) < 0) {
      this.validationMessage =
        'Ticket price cannot be negative.';
      this.markFieldAsTouched(form, 'price');
      return;
    }

    if (Number(this.totalSeats) < 1) {
      this.validationMessage =
        'Total seats must be at least 1.';
      this.markFieldAsTouched(form, 'totalSeats');
      return;
    }

    if (
      this.startDateTime &&
      this.endDateTime &&
      new Date(this.endDateTime) <= new Date(this.startDateTime)
    ) {
      this.validationMessage =
        'End date and time must be after start date and time.';
      this.markFieldAsTouched(form, 'endDateTime');
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
      title: this.title.trim(),
      category: this.category,
      description: this.description.trim(),
      date: this.startDateTime.slice(0, 10),
      startDateTime: this.startDateTime,
      endDateTime: this.endDateTime,
      venue: this.venue.trim(),
      city: this.city.trim(),
      address: this.address.trim(),
      organizerName: this.organizerName.trim(),
      organizerEmail: this.organizerEmail.trim(),
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
    form.resetForm({
      title: '',
      category: 'Technology',
      description: '',
      startDateTime: '',
      endDateTime: '',
      venue: '',
      city: '',
      address: '',
      organizerName: '',
      organizerEmail: '',
      price: 0,
      image: '',
      galleryText: '',
      additionalInfo: '',
      totalSeats: 0
    });
    this.clearDescriptionEditor();

  }

  applyRichText(command: string): void {

    this.descriptionEditor?.nativeElement.focus();
    document.execCommand(command, false);
    this.syncDescriptionFromEditor();

  }

  syncDescriptionFromEditor(): void {

    const html =
      this.descriptionEditor?.nativeElement.innerHTML || '';

    this.description =
      this.stripHtml(html).length > 0
        ? html
        : '';

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
    this.validationMessage = '';

  }

  private getFirstMissingRequiredField():
    { label: string; name: string } | undefined {

    const requiredFields = [
      {
        label: 'Event title',
        name: 'title',
        value: this.title
      },
      {
        label: 'Category',
        name: 'category',
        value: this.category
      },
      {
        label: 'Description',
        name: 'description',
        value: this.description
      },
      {
        label: 'Start date and time',
        name: 'startDateTime',
        value: this.startDateTime
      },
      {
        label: 'End date and time',
        name: 'endDateTime',
        value: this.endDateTime
      },
      {
        label: 'Venue',
        name: 'venue',
        value: this.venue
      },
      {
        label: 'City',
        name: 'city',
        value: this.city
      },
      {
        label: 'Venue address',
        name: 'address',
        value: this.address
      },
      {
        label: 'Ticket price',
        name: 'price',
        value: this.price
      },
      {
        label: 'Total seats',
        name: 'totalSeats',
        value: this.totalSeats
      },
      {
        label: 'Organizer name',
        name: 'organizerName',
        value: this.organizerName
      },
      {
        label: 'Organizer email',
        name: 'organizerEmail',
        value: this.organizerEmail
      }
    ];

    return requiredFields
      .find(field => !this.hasValue(field.value));

  }

  private hasValue(value: string | number): boolean {

    return this.stripHtml(String(value ?? '')).length > 0;

  }

  private markFieldAsTouched(
    form: NgForm,
    controlName: string
  ): void {

    form.controls[controlName]?.markAsTouched();

  }

  private stripHtml(value: string): string {

    return value
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .trim();

  }

  private clearDescriptionEditor(): void {

    if (this.descriptionEditor) {
      this.descriptionEditor.nativeElement.innerHTML = '';
    }

  }

}
