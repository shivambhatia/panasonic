import { NULL_EXPR } from '@angular/compiler/src/output/output_ast';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NotificationModel } from '../models/notification';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  notification$: BehaviorSubject<NotificationModel> = new BehaviorSubject<NotificationModel>(null as any);
  
  constructor() { }

  setNotification(notification: NotificationModel) {
    this.notification$.next(notification);
  }

  getNotification() {
    return this.notification$.asObservable();
  }
}