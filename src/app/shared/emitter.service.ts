import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmitterService {

  login = new EventEmitter;
  userName= new EventEmitter;
  theme = new EventEmitter;
}
