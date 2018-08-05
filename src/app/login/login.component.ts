import { Component, OnInit } from '@angular/core';
import {AppServiceService, Response} from '../service/app-service.service';
import { Observable } from 'rxjs';
import {Router} from '@angular/router';
// import {SessionModel} from '../model/session';
import {SessionModel} from '../model/Session';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {environment} from '../../environments/environment.prod';
import {NotificationsService} from 'angular2-notifications';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  // session: SessionModel;
  loginForm: FormGroup;
  errors;
  constructor(private appService: AppServiceService,
              private route: Router, private session: SessionModel,
              private notifyService: NotificationsService) { }
  ngOnInit() {
    this.createLoginForm();
    this.errors = {
      email: 'Email must be a valid email address (username@domain)',
      password: 'Enter password'
    };
    this.loginForm.setValue({
      email: this.session.getEmail(),
      password: this.session.getPassword(),
      shouldRememberUserNameAndPassword: this.session.getEmail() && true || false
    });
  }

  createLoginForm() {
    this.loginForm = new FormGroup( {
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
      shouldRememberUserNameAndPassword: new FormControl()
    });
  }

  onSubmitLogin() {
    let postData = {};
    if (!this.loginForm.valid) {
      // for (const p in this.basicInfoForm.controls) {
      //   if (this.basicInfoForm.controls[p].invalid) {
      //     console.log(this.basicInfoForm.controls[p]);
      //   }
      // }
      // this.notifyService.info(`Enter basic info`);
      return;
    }
    postData = this.loginForm.value;
    this.appService.logIn(postData).subscribe((data) => {
      if (data.hashKey) {
        this.session.init(data);
        this.loginForm.reset();
        this.route.navigate(['dashboard']);
      } else {
        this.notifyService.error('Login Failed', 'Invalid Email and Password');
      }
    });
  }

}
