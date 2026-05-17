import { Component } from '@angular/core';
import { Sidebar } from '../../layout/sidebar/sidebar';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [Sidebar],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {}
