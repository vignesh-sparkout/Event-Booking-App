import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [ CommonModule, FormsModule],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.css'
})
export class SearchBar {

  searchText = '';

  @Output()
  searchEvent = new EventEmitter<string>();

  onSearch() {

    this.searchEvent.emit(this.searchText);

  }

  clearSearch(): void {

    this.searchText = '';
    this.onSearch();

  }

}
