import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {AppServiceService, Response} from '../../service/app-service.service';
import {Appartement} from '../../model/AppartmentModel';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManageComponent implements OnInit {

  displayedColumns: string[] = ['sno', 'name', 'noOfHouses', 'address', 'manager', 'email', 'contact', 'action'];
  // appartementGrid: Response[] = [];
  appartementGrid = new MatTableDataSource<Appartement>(null);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private router: Router, private appService: AppServiceService) { }

  ngOnInit() {
    this.appService.getAppartement().subscribe((data) => {
      this.appartementGrid = new MatTableDataSource<Appartement>(data); // new MatTableDataSource<Response>(data);
      this.appartementGrid.paginator = this.paginator;
    });
  }

  onClickCreate() {
    this.router.navigate(['appartement/create']);
  }

  onEdit(index, row) {
    // this.appService.selectedAppartement = row;
    this.appService.selectedAppartementIndex = index;
    this.router.navigate(['appartement/create']);
  }

  onDelete(row) {
    console.log(row);
  }

}
