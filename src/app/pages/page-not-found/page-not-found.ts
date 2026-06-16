import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-page-not-found',
  imports: [RouterLink],
  templateUrl: './page-not-found.html',
  styleUrl: './page-not-found.css',
})
export class PageNotFound {

  readonly requestedUrl: string;

  constructor(private router: Router) {
    this.requestedUrl =
      this.router.url === '/'
        ? 'this page'
        : this.router.url;
  }

  goHome(): void {
    this.router.navigate(['/']);
  }

}
