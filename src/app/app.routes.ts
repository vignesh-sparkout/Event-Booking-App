import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { EventList } from './pages/event-list/event-list';
import { EventDetails } from './pages/event-details/event-details';
import { Dashboard } from './organizer/dashboard/dashboard';
import { CreateEvent } from './organizer/create-event/create-event';
import { ManageEvents } from './organizer/manage-events/manage-events';
import { MyBookings } from './pages/my-bookings/my-bookings';
import { EditEvent } from './organizer/edit-event/edit-event';
import { Attendees } from './organizer/attendees/attendees';
import { adminGuard } from './services/admin.guard';
import { AdminLogin } from './pages/admin-login/admin-login';
export const routes: Routes = [

{ path: '',component: Home }, 
{  path: 'events',  component: EventList},


  {
    path: 'event-details/:id',
    component: EventDetails
  },

{
  path: 'organizer/dashboard',
  canActivate: [adminGuard],
  component: Dashboard
},
{
  path: 'organizer/create-event',
  canActivate: [adminGuard],
  component: CreateEvent
},
{
  path: 'organizer/manage-events',
  canActivate: [adminGuard],
  component: ManageEvents
},
{
  path: 'my-bookings',
  component: MyBookings
},
{
  path: 'admin-login',
  component: AdminLogin
},
{
  path: 'signup',
  component: AdminLogin
},
{
  path: 'organizer/edit-event/:id',
  canActivate: [adminGuard],
  component: EditEvent
},
{
  path: 'organizer/attendees',
  canActivate: [adminGuard],
  component: Attendees
},
{
  path: 'organizer/attendees/:id',
  canActivate: [adminGuard],
  component: Attendees
}

];
