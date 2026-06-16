import {ChangeDetectorRef,Component,OnDestroy} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sidebar } from '../../layout/sidebar/sidebar';
import { EventService } from '../../services/event';
import { BookingService } from '../../services/booking';
import { Router, RouterLink } from '@angular/router';
import { Event } from '../../Models/event.model';
@Component({
  selector: 'app-manage-events',
  standalone: true,
  imports: [Sidebar,CommonModule,RouterLink],
  templateUrl: './manage-events.html',
  styleUrl: './manage-events.css'
})
export class ManageEvents implements OnDestroy {

  events: Event[] = [];
  eventToCancel?: Event;
  successModal?: {
    kicker: string;
    title: string;
    message: string;
  };
  private successTimer?: ReturnType<typeof setTimeout>;

  constructor(
    private eventService: EventService,
    private bookingService: BookingService,
    private router: Router,
    private changeDetector: ChangeDetectorRef
  ) {

    this.loadActiveEvents();
    this.showCreateSuccessMessage();

  }

  ngOnDestroy(): void {

    if (this.successTimer) {
      clearTimeout(this.successTimer);
    }

  }

  openCancelDialog(event: Event): void {

    this.eventToCancel = event;

  }

  closeCancelDialog(): void {

    this.eventToCancel = undefined;

  }

  confirmCancelEvent(): void {

    if (!this.eventToCancel) {
      return;
    }

    const eventTitle =
      this.eventToCancel.title;

    this.eventService.cancelEvent(this.eventToCancel.id);

    this.closeCancelDialog();

    this.loadActiveEvents();

    this.openSuccessModal(
      'Event cancelled',
      'Event cancelled successfully',
      `${eventTitle} has been removed from active listings.`
    );

  }

  getTicketsSold(eventId: number): number {

    return this.bookingService.getTicketsSold(eventId);

  }

  getRevenue(eventId: number): number {

    return this.bookingService.getRevenueForEvent(eventId);

  }

  private loadActiveEvents(): void {

    this.events =
      this.eventService
        .getActiveEvents()
        .sort(
          (firstEvent, secondEvent) =>
            this.getEventStartTime(secondEvent) -
            this.getEventStartTime(firstEvent)
        );

  }

  private showCreateSuccessMessage(): void {

    const navigationState =
      this.router.getCurrentNavigation()?.extras.state ||
      history.state;

    if (!navigationState?.['eventCreated']) {
      return;
    }

    const eventTitle =
      navigationState['eventTitle'] || 'Your event';

    this.openSuccessModal(
      'Event published',
      'Event created successfully',
      `${eventTitle} is now added to the organizer panel.`
    );

    const cleanState = {
      ...(history.state || {})
    };

    delete cleanState['eventCreated'];
    delete cleanState['eventTitle'];

    // Prevents the success popup from replaying on a manual refresh.
    history.replaceState(
      cleanState,
      document.title
    );

  }

  private openSuccessModal(
    kicker: string,
    title: string,
    message: string
  ): void {

    this.successModal = {
      kicker,
      title,
      message
    };

    if (this.successTimer) {
      clearTimeout(this.successTimer);
    }

    this.successTimer = setTimeout(
      () => {
        this.successModal = undefined;
        this.changeDetector.detectChanges();
      },
      1800
    );

  }

  private getEventStartTime(event: Event): number {

    const eventStart =
      new Date(event.startDateTime || event.date);

    return Number.isNaN(eventStart.getTime())
      ? 0
      : eventStart.getTime();

  }

}
