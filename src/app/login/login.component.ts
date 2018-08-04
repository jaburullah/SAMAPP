import { Component, OnInit } from '@angular/core';
import {AppServiceService, Response} from '../service/app-service.service';
import { Observable } from 'rxjs';
import {Router} from '@angular/router';
// import {SessionModel} from '../model/session';
import {SessionModel} from '../model/Session';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  // session: SessionModel;
  constructor(private appService: AppServiceService, private route: Router, private session: SessionModel) { }

  ngOnInit() {
  }

  onClickLogin() {
    const postData = {
      email: 'admin@gmail.com',
      password: 'admin'
    };
    this.appService.logIn(postData).subscribe((data) => {
      this.session.init(data);
      this.route.navigate(['dashboard']);
    });
  }

}
