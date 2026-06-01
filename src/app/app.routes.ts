import { Routes } from '@angular/router';
import { adminGuard } from './services/admin.guard';
import { userGuard } from './services/user.guard';

export const routes: Routes = [

  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home').then(component => component.Home)
  },
  {
    path: 'events',
    loadComponent: () =>
      import('./pages/event-list/event-list').then(component => component.EventList)
  },


  {
    path: 'event-details/:id',
    loadComponent: () =>
      import('./pages/event-details/event-details').then(component => component.EventDetails)
  },
  {
    path: 'ticket-booking/:id',
    canActivate: [userGuard],
    loadComponent: () =>
      import('./pages/ticket-booking/ticket-booking').then(component => component.TicketBooking)
  },
  {
    path: 'signin',
    loadComponent: () =>
      import('./pages/user-signin/user-signin').then(component => component.UserSignin)
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/user-register/user-register').then(component => component.UserRegister)
  },

  {
    path: 'organizer/dashboard',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./organizer/dashboard/dashboard').then(component => component.Dashboard)
  },
  {
    path: 'organizer/create-event',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./organizer/create-event/create-event').then(component => component.CreateEvent)
  },
  {
    path: 'organizer/manage-events',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./organizer/manage-events/manage-events').then(component => component.ManageEvents)
  },
  {
    path: 'my-bookings',
    canActivate: [userGuard],
    loadComponent: () =>
      import('./pages/my-bookings/my-bookings').then(component => component.MyBookings)
  },
  {
    path: 'admin-login',
    loadComponent: () =>
      import('./pages/admin-login/admin-login').then(component => component.AdminLogin)
  },
  {
    path: 'signup',
    redirectTo: 'register',
    pathMatch: 'full'
  },
  {
    path: 'organizer/edit-event/:id',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./organizer/edit-event/edit-event').then(component => component.EditEvent)
  },
  {
    path: 'organizer/attendees',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./organizer/attendees/attendees').then(component => component.Attendees)
  },
  {
    path: 'organizer/attendees/:id',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./organizer/attendees/attendees').then(component => component.Attendees)
  }

];
