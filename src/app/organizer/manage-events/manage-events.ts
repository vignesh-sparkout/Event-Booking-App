import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sidebar } from '../../layout/sidebar/sidebar';
import { EventService } from '../../services/event';
import { RouterLink } from '@angular/router';
import { Event } from '../../Models/event.model';
@Component({
  selector: 'app-manage-events',
  standalone: true,
  imports: [
    Sidebar,
    CommonModule,
    RouterLink
  ],
  templateUrl: './manage-events.html',
  styleUrl: './manage-events.css'
})
export class ManageEvents {

  events: Event[] = [];

  constructor(
    private eventService: EventService
  ) {

    this.events =
      this.eventService.getEvents();

  }

  deleteEvent(id: number) {

    this.eventService.deleteEvent(id);

    this.events =
      this.eventService.getEvents();

  }

}