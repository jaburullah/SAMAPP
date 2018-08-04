import { Component, OnInit } from '@angular/core';
import { LayoutComponentModule } from './layout-component.module';
import {AppServiceService} from '../service/app-service.service';
import {SessionModel} from '../model/Session';
import {Router} from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  constructor(private route: Router, private appService: AppServiceService, private session: SessionModel) {
    this.appService.logIn({}).subscribe((data) => {
      this.session.init(data);
      // this.route.navigate(['dashboard']);
    });
  }

  ngOnInit() {
  }

}
