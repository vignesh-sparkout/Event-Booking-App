export type EventStatus = 'Active' | 'Cancelled';

export interface Event {
  id: number;
  title: string;
  category: string;
  description: string;
  date: string;
  startDateTime: string;
  endDateTime: string;
  venue: string;
  city: string;
  address: string;
  organizerName: string;
  organizerEmail: string;
  price: number;
  image: string;
  gallery: string[];
  totalSeats: number;
  availableSeats: number;
  additionalInfo: string;
  status: EventStatus;
}
