export type BookingStatus = 'Confirmed' | 'Cancelled';

export interface Booking {
  bookingId: string;
  eventId: number;
  eventTitle: string;
  eventDate: string;
  name: string;
  email: string;
  phone: string;
  tickets: number;
  totalAmount: number;
  bookingDate: string;
  status: BookingStatus;
}
