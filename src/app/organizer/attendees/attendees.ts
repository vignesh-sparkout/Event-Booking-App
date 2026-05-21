import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ActivatedRoute } from '@angular/router';

import { Sidebar } from '../../layout/sidebar/sidebar';

import { BookingService } from '../../services/booking';

import { Booking } from '../../Models/booking.model';

type AttendeeFilter = 'All' | 'Confirmed' | 'Cancelled';
type DateFilter = 'All Dates' | 'Today' | 'This Week' | 'This Month';

@Component({
  selector: 'app-attendees',
  standalone: true,
  imports: [
    Sidebar,
    CommonModule,
    FormsModule
  ],
  templateUrl: './attendees.html',
  styleUrl: './attendees.css'
})
export class Attendees {

  bookings: Booking[] = [];
  eventId = 0;
  activeFilter: AttendeeFilter = 'All';
  dateFilter: DateFilter = 'All Dates';
  searchTerm = '';
  currentPage = 1;
  readonly pageSize = 6;

  constructor(
    private route: ActivatedRoute,
    private bookingService: BookingService
  ) {

    this.eventId = Number(
      this.route.snapshot.paramMap.get('id')
    );

    const allBookings =
      this.bookingService.getBookings();

    this.bookings =
      this.eventId > 0
        ? allBookings.filter(
            booking => booking.eventId === this.eventId
          )
        : allBookings;

  }

  get filteredBookings(): Booking[] {

    const normalizedSearch =
      this.searchTerm.trim().toLowerCase();

    return this.bookings.filter(booking => {

      const matchesFilter =
        this.activeFilter === 'All' ||
        booking.status === this.activeFilter;

      const matchesSearch =
        !normalizedSearch ||
        [
          booking.bookingId,
          booking.eventTitle,
          booking.name,
          booking.email,
          booking.phone
        ].some(value =>
          value.toLowerCase().includes(normalizedSearch)
        );

      return matchesFilter &&
        matchesSearch &&
        this.matchesDateFilter(booking);

    });

  }

  get totalPages(): number {

    return Math.max(
      Math.ceil(this.filteredBookings.length / this.pageSize),
      1
    );

  }

  get pageNumbers(): number[] {

    const visiblePages = 5;
    const startPage = Math.max(
      Math.min(
        this.currentPage - 2,
        this.totalPages - visiblePages + 1
      ),
      1
    );
    const endPage = Math.min(
      startPage + visiblePages - 1,
      this.totalPages
    );

    return Array.from(
      {
        length: endPage - startPage + 1
      },
      (_, index) => startPage + index
    );

  }

  get paginatedBookings(): Booking[] {

    const startIndex =
      (this.currentPage - 1) * this.pageSize;

    return this.filteredBookings.slice(
      startIndex,
      startIndex + this.pageSize
    );

  }

  get confirmedCount(): number {

    return this.bookings.filter(
      booking => booking.status === 'Confirmed'
    ).length;

  }

  get cancelledCount(): number {

    return this.bookings.filter(
      booking => booking.status === 'Cancelled'
    ).length;

  }

  setFilter(filter: AttendeeFilter): void {

    this.activeFilter = filter;
    this.currentPage = 1;

  }

  onSearchChange(searchTerm: string): void {

    this.searchTerm = searchTerm;
    this.currentPage = 1;

  }

  onDateFilterChange(dateFilter: DateFilter): void {

    this.dateFilter = dateFilter;
    this.currentPage = 1;

  }

  goToPage(page: number): void {

    this.currentPage = Math.min(
      Math.max(page, 1),
      this.totalPages
    );

  }

  getInitials(name: string): string {

    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(part => part[0].toUpperCase())
      .join('') || 'A';

  }

  private matchesDateFilter(booking: Booking): boolean {

    if (this.dateFilter === 'All Dates') {
      return true;
    }

    const bookingDate =
      new Date(booking.bookingDate);

    if (Number.isNaN(bookingDate.getTime())) {
      return false;
    }

    const today =
      new Date();
    const startOfToday =
      new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );
    const startOfBookingDay =
      new Date(
        bookingDate.getFullYear(),
        bookingDate.getMonth(),
        bookingDate.getDate()
      );

    if (this.dateFilter === 'Today') {
      return startOfBookingDay.getTime() === startOfToday.getTime();
    }

    if (this.dateFilter === 'This Week') {
      const startOfWeek =
        new Date(startOfToday);
      startOfWeek.setDate(
        startOfToday.getDate() - startOfToday.getDay()
      );

      return startOfBookingDay >= startOfWeek &&
        startOfBookingDay <= startOfToday;
    }

    return bookingDate.getFullYear() === today.getFullYear() &&
      bookingDate.getMonth() === today.getMonth();

  }

}
