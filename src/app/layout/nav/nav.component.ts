import { Component, OnInit } from '@angular/core';
import {ModalDismissReasons, NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {AppServiceService} from '../../service/app-service.service';
import {Router} from '@angular/router';
import {SessionModel} from '../../model/Session';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  logoutDialog: NgbModalRef;
  closeResult: string;

  constructor(private modalService: NgbModal, private appService: AppServiceService, private route: Router, private session: SessionModel) {
  }

  ngOnInit() {
  }

  open(content) {
    this.logoutDialog = this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'});
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  onLogout() {
    this.logoutDialog.dismiss();
    this.appService.logOut().subscribe((data) => {
      this.session.clearSession();
      this.route.navigate(['/login']);
    });
  }

}
