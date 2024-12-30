import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-single-post-details',
  templateUrl: './single-post-details.component.html',
  styleUrls: ['./single-post-details.component.scss']
})
export class SinglePostDetailsComponent {

  // Slider Config
  slideConfig = { slidesToShow: 1, slidesToScroll: 1, dots: true };
  
  constructor(@Inject(MAT_DIALOG_DATA) public data: any)
  { 
    console.log("data",data);
  }

  ngOnInit(): void {    
  }

}
