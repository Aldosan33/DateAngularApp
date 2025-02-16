import { Component, OnInit } from '@angular/core';
import { Pagination, PaginatedResult } from '../_models/Pagination';
import { Message } from '../_models/message';
import { UserService } from '../_services/user.service';
import { AuthService } from '../_services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from '../_services/alertify.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  messages: Message[];
  pagination: Pagination;
  messageContainer = 'Unread';
  constructor(private userService: UserService, private authService: AuthService,
              private route: ActivatedRoute, private alertifyService: AlertifyService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.messages = data['messages'].result;
      this.pagination = data['messages'].pagination;
    });
  }

  loadMessages() {
    this.userService.getMessages(this.authService.decodedToken.nameid, this.pagination.currentPage,
                                 this.pagination.itemsPerPage, this.messageContainer)
                    .subscribe((res: PaginatedResult<Message[]>) => {
                      this.messages = res.result;
                      this.pagination = res.pagination;
                    }, error => {
                      this.alertifyService.error(error);
                    });
  }

  deleteMessage(id: number) {
    this.alertifyService.confirm('Dating App', 'Are you sure you want to delete this message?', () => {
      this.userService.deleteMessage(this.authService.decodedToken.nameid, id).subscribe(() => {
        this.messages.splice(this.messages.findIndex(m => m.id === id), 1);
        this.alertifyService.success('Message has been deleted');
      }, error => {
        this.alertifyService.error('Failed to delete the message');
      });
    }, () => {
      console.log('Deleting cancelled');
    });
  }

  pageChanged(event: any) {
    this.pagination.currentPage = event.page;
    this.loadMessages();
  }
}
