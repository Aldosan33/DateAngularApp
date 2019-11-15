import { Injectable } from '@angular/core';
import * as alertify from 'alertifyjs';

@Injectable({
  providedIn: 'root'
})
export class AlertifyService {

constructor() { }

  confirm(title: string, message: string,
          okCallback: () => any, onCancel: () => any) {
    alertify.confirm(title, message, (e: any) => {
      if (e) {
        okCallback();
      }
    }, onCancel());
  }

  success(message: string) {
    alertify.success(message);
  }

  error(message: string) {
    alertify.error(message);
  }

  warning(message: string) {
    alertify.warning(message);
  }

  message(message: string) {
    alertify.warning(message);
  }
}
