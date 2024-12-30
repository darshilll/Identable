import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent {
  @Input() currentPage: number | any;
  @Input() totalPages: number | any;
  @Output() pageChanged: EventEmitter<number> = new EventEmitter();

  // Define variables to keep track of the page range being displayed
  currentPageRangeStart: number = 1;
  currentPageRangeEnd: number = 5;

  constructor() {}

  ngOnInit(): void {}

  nextPage() {
    if (this.currentPage < this.totalPages) {
      var calNext = this.currentPage + 1;
      // var calNext = this.currentPageRangeEnd + 1;
      this.pageChanged.emit(calNext);
      if (this.currentPage === this.currentPageRangeEnd) {
        if (this.currentPageRangeEnd < this.totalPages) {
          this.currentPageRangeStart += 5;
          this.currentPageRangeEnd = Math.min(
            this.currentPageRangeEnd + 5,
            this.totalPages
          );
        }
      }
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.pageChanged.emit(this.currentPage - 1);
      if (this.currentPage === this.currentPageRangeStart) {
        if (this.currentPageRangeStart > 1) {
          this.currentPageRangeStart = Math.max(
            this.currentPageRangeStart - 5,
            1
          );
          this.currentPageRangeEnd = this.currentPageRangeStart + 4;
        }
      }
    }
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.pageChanged.emit(page);
    }
  }

  getPaginationArray(): number[] {
    // Generate an array for the current page range
    const paginationArray = [];
    for (
      let i = this.currentPageRangeStart;
      i <= this.currentPageRangeEnd && i <= this.totalPages;
      i++
    ) {
      paginationArray.push(i);
    }
    return paginationArray;
  }
}
