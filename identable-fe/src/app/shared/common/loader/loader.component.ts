import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';

// SERVICES
import { LoaderService } from '../../../providers/loader-service/loader.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
})
export class LoaderComponent implements OnInit {
  isChatGptVersion: any = '';
  isLoading: boolean = false;
  loaderMessage: any;
  constructor(
    public loaderService: LoaderService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loaderService.isLoading$.subscribe((isLoading: boolean) => {
      this.isLoading = isLoading;
      this.cdr.detectChanges();
    });
    this.loaderService.chatGptVersion$.subscribe((chatGptVersion: any) => {
      this.isChatGptVersion = chatGptVersion
        ? chatGptVersion == 3
          ? 3.5
          : 4
        : '';
      this.cdr.detectChanges();
    });
  }
}
