import {
  Component,
  EventEmitter,
  Output
} from '@angular/core';

import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filter-bar',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './filter-bar.html',
  styleUrl: './filter-bar.css'
})
export class FilterBar {

  selectedCategory = '';

  @Output()
  categoryChange =
    new EventEmitter<string>();

  filterCategory() {

    this.categoryChange.emit(
      this.selectedCategory
    );

  }

}