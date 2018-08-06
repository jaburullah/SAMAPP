import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {AppServiceService} from '../../service/app-service.service';
import {ManagerModel} from '../../model/ManagerModel';
import {Router} from '@angular/router';
import {TicketModel} from '../../model/TicketModel';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManageComponent implements OnInit {

  displayedColumns: string[] = ['sno', 'category', 'type', 'priority', 'description', 'action'];
  // appartementGrid: Response[] = [];
  ticketGrid = new MatTableDataSource<TicketModel>(null);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private router: Router, private appService: AppServiceService) { }

  ngOnInit() {
    this.appService.getTicket().subscribe((data) => {
      this.ticketGrid = new MatTableDataSource<TicketModel>(data); // new MatTableDataSource<Response>(data);
      this.ticketGrid.paginator = this.paginator;
    });
  }

  onClickCreate() {
    this.router.navigate(['ticket/create']);
  }

  onEdit(index, row) {
    this.appService.selectedTicketIndex = index;
    this.router.navigate(['ticket/create']);
  }

  onDelete(row) {
    console.log(row);
  }

}
