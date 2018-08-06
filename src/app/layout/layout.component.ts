import {AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewChildren} from '@angular/core';
import { LayoutComponentModule } from './layout-component.module';
import {AppServiceService} from '../service/app-service.service';
import {SessionModel} from '../model/Session';
import {Router} from '@angular/router';
import {NotificationsService} from 'angular2-notifications';
import {NavComponent} from './nav/nav.component';
import {SidenavComponent} from './sidenav/sidenav.component';
import {DashboardComponent} from '../dashboard/dashboard.component';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit, AfterViewInit {
  @ViewChildren('lastvisted') lastvisted: ElementRef;
  @ViewChild(NavComponent) navComp: NavComponent;
  @ViewChild(DashboardComponent) dashboard: DashboardComponent;
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
        this.appService.appInfo = data.appInfo;
        // jj
        if (this.session.isAdmin()) {
          this.navComp.sideComp.menuItems = this.navComp.sideComp.adminMenu;
          this.appService.getDashboardDetails().subscribe((res) => {
            console.log(res);
            if (this.dashboard) {
              this.dashboard.recentTicketCount = res.recent.length;
              this.dashboard.openTicketCount = res.open.length;
              this.dashboard.totalTicketCount = res.total.length;
              this.dashboard.closedTicketCount = res.closed.length;
            }
          });
        } else if (this.session.isManager()) {
          this.navComp.sideComp.menuItems = this.navComp.sideComp.managerMenu;
        } else if (this.session.isTenant()) {
          this.navComp.sideComp.menuItems = this.navComp.sideComp.tenantMenu;
        }
        console.log(this.session.getEmail());
        console.log(`Admin: ${this.session.isAdmin()}`);
        console.log(`Manager: ${this.session.isManager()}`);
        console.log(`Tenant: ${this.session.isTenant()}`);
        // k
        this.navComp.lastvisted.nativeElement.textContent = this.session.getLastVisited();
      } else {
        this.route.navigate(['login']);
        this.notifyService.error('Login Failed', 'Invalid Session');
      }
    });
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    // console.log(this.navComp);
  }

}
