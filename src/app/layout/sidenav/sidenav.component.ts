import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
import {MenuItem} from '../../model/MenuItem';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {
  menuItems: MenuItem[];
  isOpenSideBar = true;
  constructor(private renderer: Renderer2) {
    this.menuItems = [
      new MenuItem({ icon: 'fa-dashboard', name: 'Dashboard', location: 'dashboard', title: 'Dashboard' }),
      new MenuItem({ icon: 'fa-building', name: 'Appartement', location: 'appartement', title: 'Appartement' }),
      new MenuItem({ icon: 'fa-user-secret', name: 'Manager', location: 'manager', title: 'Manager' }),
      new MenuItem({ icon: 'fa-user', name: 'Tenant/House Owner', location: 'manager', title: 'Tenant/House Owner' }),
    ];
  }

  ngOnInit() {
  }

  onHideSideBar() {
    this.isOpenSideBar = !this.isOpenSideBar;
    if (!this.isOpenSideBar) {
      this.renderer.addClass(document.body, 'sidenav-toggled');
    } else {
      this.renderer.removeClass(document.body, 'sidenav-toggled');
    }
  }
}



