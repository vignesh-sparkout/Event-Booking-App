# Event Booking System

An Angular event booking application for browsing events, viewing event details, booking tickets, managing attendee bookings, and handling organizer event administration.

The project uses local browser storage for demo data, so it can run without a backend API.

## Project Description

Event Booking System is a frontend-only Angular application with two main user flows:

- Attendees can browse upcoming events, search/filter events, view event details, book tickets, and manage their bookings.
- Organizers can log in, view a dashboard, create events, edit events, cancel events, and view attendees.

Default event data is seeded through the event service and saved into `localStorage` on first load.

## Tech Stack

- Angular 21.2
- Angular Router
- Angular Forms
- Standalone Angular components
- TypeScript 5.9
- RxJS
- Tailwind CSS 4
- ngx-editor
- Vitest for unit testing
- Browser `localStorage` for demo persistence

## Main Features

- Home page with event discovery entry point
- Event listing page
- Search and filter support
- Event details page
- Ticket booking form
- Booking success modal
- My Bookings page with booking lookup by email
- Cancel booking confirmation modal
- Organizer/admin login
- Protected organizer routes using route guard
- Organizer dashboard
- Create, edit, manage, and cancel events
- Attendee list for organizer events
- Seat count update when tickets are booked or cancelled

## Angular Version

This project was generated with Angular CLI `21.2.7`.

Main Angular packages:

```bash
@angular/core     ^21.2.0
@angular/cli      ^21.2.7
@angular/router   ^21.2.0
@angular/forms    ^21.2.0
```

## Project Setup

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm start
```

or:

```bash
ng serve
```

Open the app in your browser:

```text
http://localhost:4200/
```

## Build

Create a production build:

```bash
npm run build
```

or:

```bash
ng build
```

Build output will be generated in the `dist/` folder.

## Run Tests

Run unit tests:

```bash
npm test
```

or:

```bash
ng test
```

## Demo Admin Login

The organizer/admin area uses a demo login stored in the frontend service.

```text
Email: vicky@gmail.com
Password: 121212
```

After login, protected organizer routes can be accessed.

## Data Storage

This project does not use a backend database.

Data is stored in browser `localStorage`:

- `events` stores event data
- `bookings` stores booking data
- `currentAttendeeEmail` stores the last searched attendee email
- `eventBookingAdminSession` stores admin login session state

Because of this, clearing browser storage will reset saved events, bookings, and login state.

## Project Structure

```text
src/app/
  layout/
    navbar/
    footer/
    sidebar/
  Models/
    booking.model.ts
    event.model.ts
  organizer/
    attendees/
    create-event/
    dashboard/
    edit-event/
    manage-events/
  pages/
    admin-login/
    event-details/
    event-list/
    home/
    my-bookings/
    ticket-booking/
  services/
    admin.guard.ts
    auth.ts
    booking.ts
    event.ts
  shared/
    booking-form/
    filter-bar/
    search-bar/
```

## Useful Commands

```bash
npm start
```

Runs the local development server.

```bash
npm run build
```

Builds the application.

```bash
npm test
```

Runs unit tests.

```bash
npm run watch
```

Builds continuously in development mode.

## Notes

- This is a demo frontend project, so event and booking data are not shared across browsers or devices.
- Default events are used as seed data for first-time app load.
- Organizer authentication is frontend-only and should be replaced with backend authentication for production use.
