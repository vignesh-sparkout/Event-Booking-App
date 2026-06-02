# Event Booking System

A frontend event booking platform built with Angular. The application supports attendee registration, event discovery, ticket booking, booking management, and an organizer dashboard for creating and managing events.

This project is designed as a browser-based demo application. It uses `localStorage` for persistence, so it can run locally without a backend API or database.

## Overview

Event Booking System provides two main workflows:

- Attendees can register, sign in, browse upcoming events, filter events, view event details, book tickets, and cancel eligible bookings.
- Organizers can sign in to a protected admin area, create events, edit event details, cancel events, view dashboard metrics, and review attendee bookings.

The app is built with standalone Angular components, route guards, reactive forms, template-driven forms, reusable shared components, and local browser storage.

## Features

### Attendee

- User registration and sign-in
- Protected ticket booking and booking history routes
- Event listing with keyword search
- Category, price, and date filtering
- Event details page with venue map link
- Ticket booking form with seat validation
- Automatic ticket total calculation
- Booking confirmation flow
- My Bookings page with booking status, ticket totals, and cancellation support
- Seat restoration when a confirmed booking is cancelled

### Organizer

- Demo admin login
- Protected organizer routes
- Dashboard with live events, revenue, tickets sold, available seats, occupancy, and recent bookings
- Create event form with validation
- Rich text event description editor
- Cover and gallery image upload with client-side compression
- Edit event details while preserving sold-seat counts
- Cancel events and remove them from active listings
- Attendee list with search, status filters, date filters, and pagination

## Tech Stack

- Angular 21
- TypeScript 5.9
- Angular Router
- Angular Forms
- Standalone Angular components
- RxJS
- Tailwind CSS 4
- ngx-editor
- Vitest
- Browser `localStorage`

## Getting Started

### Prerequisites

Install Node.js and npm before running the project.

### Installation

```bash
npm install
```

### Run the Development Server

```bash
npm start
```

The app will be available at:

```text
http://localhost:4200/
```

You can also run the Angular CLI command directly:

```bash
ng serve
```

## Demo Credentials

### Organizer Login

Use these credentials to access the organizer dashboard:

```text
Email: vicky@gmail.com
Password: 121212
```

Organizer routes are protected and redirect unauthenticated users to the admin login page.

### Attendee Login

Attendees can create their own account from the registration page. Registered attendee accounts are stored in browser `localStorage`.

## Available Scripts

```bash
npm start
```

Runs the application locally.

```bash
npm run build
```

Creates a production build in the `dist/` directory.

```bash
npm run watch
```

Builds the project in development mode and watches for file changes.

```bash
npm test
```

Runs the unit test suite.

## Application Routes

| Route | Description |
| --- | --- |
| `/` | Home page |
| `/events` | Event listing and filters |
| `/event-details/:id` | Event details |
| `/ticket-booking/:id` | Protected ticket booking page |
| `/signin` | Attendee sign-in |
| `/register` | Attendee registration |
| `/my-bookings` | Protected attendee bookings |
| `/admin-login` | Organizer/admin login |
| `/organizer/dashboard` | Protected organizer dashboard |
| `/organizer/create-event` | Protected event creation |
| `/organizer/manage-events` | Protected event management |
| `/organizer/edit-event/:id` | Protected event editing |
| `/organizer/attendees` | Protected attendee overview |
| `/organizer/attendees/:id` | Protected attendee list for one event |

## Data Storage

The project does not connect to a backend database. Data is persisted in browser `localStorage`.

| Key | Purpose |
| --- | --- |
| `events` | Stores created and updated event data |
| `bookings` | Stores ticket bookings |
| `eventBookingAdminSession` | Stores organizer login state |
| `eventBookingRegisteredUsers` | Stores registered attendee accounts |
| `eventBookingUserSession` | Stores current attendee session |

Clearing browser storage will remove saved events, bookings, registered users, and active sessions.

## Project Structure

```text
src/app/
  layout/
    footer/
    navbar/
    sidebar/
  Models/
    booking.model.ts
    event.model.ts
    user.model.ts
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
    user-register/
    user-signin/
  services/
    admin.guard.ts
    auth.ts
    booking.ts
    event.ts
    user.guard.ts
  shared/
    booking-form/
    filter-bar/
    search-bar/
```

Static image assets are stored in:

```text
public/images/
```

## Notes

- This is a frontend-only demo application.
- A fresh browser storage state starts without user-created events. Sign in as the organizer and create events to populate the listing.
- Authentication is handled on the client for demonstration purposes only.
- For production use, replace local authentication and `localStorage` persistence with a secure backend API and database.
