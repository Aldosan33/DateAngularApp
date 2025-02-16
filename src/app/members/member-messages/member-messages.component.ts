import { Component, OnInit, Input } from '@angular/core';
import { Message } from 'src/app/_models/message';
import { UserService } from 'src/app/_services/user.service';
import { AuthService } from 'src/app/_services/auth.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent implements OnInit {
  @Input() recipientId: number;
  messages: Message[];
  newMessage: any = {};
  constructor(private userService: UserService, private authService: AuthService,
              private alertifyService: AlertifyService) { }

  ngOnInit() {
    this.loadMessages();
  }

  loadMessages() {
    const currentUserId = +this.authService.decodedToken.nameid;
    this.userService.getMessageThread(this.authService.decodedToken.nameid, this.recipientId)
                    .pipe(
                      tap(data => {
                        for (let i = 0; i < data.length; i++) {
                          if (data[i].isRead === false && data[i].recipientId === currentUserId) {
                            this.userService.markAsRead(currentUserId, data[i].id);
                          }
                        }
                      })
                    )
                    .subscribe(data => {
                      this.messages = data;
                    }, error => {
                      this.alertifyService.error(error);
                    });
  }

  sendMessage() {
    this.newMessage.recipientId = this.recipientId;
    this.userService.sendMessage(this.authService.decodedToken.nameid, this.newMessage)
                    .subscribe((response: Message) => {
                      this.messages.unshift(response);
                      this.newMessage.content = '';
                    }, error => {
                      this.alertifyService.error(error);
                    });
  }

}
