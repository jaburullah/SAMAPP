import { Component, OnInit } from '@angular/core';
import {SessionModel} from '../model/Session';
import {NotificationsService} from 'angular2-notifications';
import {Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AppServiceService} from '../service/app-service.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  recentTicketCount;
  closedTicketCount;
  totalTicketCount;
  openTicketCount;
  constructor(private modalService: NgbModal,
              private appService: AppServiceService,
              private route: Router,
              private session: SessionModel,
              private notifyService: NotificationsService) {
    this.recentTicketCount = 0;
    this.closedTicketCount = 0;
    this.totalTicketCount = 0;
    this.openTicketCount = 0;
    // if (this.session.isAdmin()) {
      this.appService.getDashboardDetails().subscribe((res) => {
        console.log(res);
        this.recentTicketCount = res.recent.length;
        this.openTicketCount = res.open.length;
        this.totalTicketCount = res.all.length;
        this.closedTicketCount = res.closed.length;
      });
    // }
  }

  ngOnInit() {
  }

}
