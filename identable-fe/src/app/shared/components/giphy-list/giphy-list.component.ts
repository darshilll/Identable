import { Component, OnInit } from '@angular/core';

// LIBRARY
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

// SERVICES
import { GiphyService } from '../../../providers/giphy/giphy.service';

@Component({
  selector: 'app-giphy-list',
  templateUrl: './giphy-list.component.html',
  styleUrls: ['./giphy-list.component.scss']
})
export class GiphyListComponent  implements OnInit {

  allGiphyList: any;
  searchQuery: string = '';

  constructor(
    private dialogRef: MatDialogRef<GiphyListComponent>,
    private toastrService: ToastrService,
    private giphyService: GiphyService
  ) {}

  ngOnInit(): void {
    this.fetchtrendingGiphy();
  }

  fetchtrendingGiphy() {
    let obj = {};
    this.giphyService.trendingGifs(obj).subscribe(
      (response) => {
        this.allGiphyList = response?.data;
      },
      (err) => {
        this.toastrService.error('Please try again.');
      }
    );
  }

  searchGifs() {
    let obj = { searchQuery: this.searchQuery };
    this.allGiphyList = [];
    this.giphyService.searchGifs(obj).subscribe(
      (response) => {
        this.allGiphyList = response?.data;
      },
      (err) => {
        this.toastrService.error('Please try again.');
      }
    );
  }
  selectGiphy(url: any) {
    if (url) {
      this.dialogRef.close(url);
    }
  }

}
