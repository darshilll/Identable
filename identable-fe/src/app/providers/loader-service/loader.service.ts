import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private isLoading = new Subject<boolean>();
  isLoading$ = this.isLoading.asObservable();

  private chatGptVersion = new Subject<string>();
  chatGptVersion$ = this.chatGptVersion.asObservable();

  constructor() {}

  start(message: string = ''): void {
    this.isLoading.next(true);
    this.chatGptVersion.next(message);
  }

  stop(): void {
    this.isLoading.next(false);
    this.chatGptVersion.next('');
  }
}
