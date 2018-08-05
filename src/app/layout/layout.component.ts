import {AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewChildren} from '@angular/core';
import { LayoutComponentModule } from './layout-component.module';
import {AppServiceService} from '../service/app-service.service';
import {SessionModel} from '../model/Session';
import {Router} from '@angular/router';
import {NotificationsService} from 'angular2-notifications';
import {NavComponent} from './nav/nav.component';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit, AfterViewInit {
  @ViewChildren('lastvisted') lastvisted: ElementRef;
  @ViewChild(NavComponent) navComp: NavComponent;
  constructor(private route: Router,
              private appService: AppServiceService,
              private session: SessionModel,
              private notifyService: NotificationsService) {
    const postData = {
      email: this.session.getEmail(),
      password: this.session.getPassword(),
      shouldRememberUserNameAndPassword: this.session.shouldRememberUserNameAndPassword()
    };
    this.appService.logIn(postData).subscribe((data) => {
      if (data.hashKey) {
        this.session.init(data);
        this.navComp.lastvisted.nativeElement.textContent = this.session.getLastVisited();
      } else {
        this.notifyService.error('Login Failed', 'Invalid Email and Password');
      }
    });
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    // console.log(this.navComp);
  }

}
