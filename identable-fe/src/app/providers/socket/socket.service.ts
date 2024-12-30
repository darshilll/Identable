import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: Socket;

  constructor() {
    this.socket = io(environment.baseUrl);
  }

  emitEvent(event: string, data: any): void {
    this.socket.emit(event, data);
  }

  onEvent(event: string, callback: (data: any) => void): void {
    this.socket.on(event, callback);
  }
}
