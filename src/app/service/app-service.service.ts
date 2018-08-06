import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import {SessionModel} from '../model/Session';
import {switchMap, tap} from 'rxjs/internal/operators';
import {Router} from '@angular/router';
import {Appartement} from '../model/AppartmentModel';
import {environment} from '../../environments/environment.prod';

export class Response {
  data: {
    msg: string;
    // session: string;
  };
  success: boolean;
}

// @Injectable({
//   providedIn: 'root'
// })
@Injectable()
export class AppServiceService {
  // rootURL = 'http://localhost:8084/';
  rootURL = 'https://samappartement.herokuapp.com/';
  appInfo;
  appartement: Appartement[] = [];
  manager: any[] = [];
  tenant: any[] = [];
  ticket: any[] = [];
  selectedAppartementIndex: number;
  selectedManagerIndex: number;
  selectedTenantIndex: number;
  selectedTicketIndex: number;
  constructor(private http: HttpClient, private session: SessionModel, private router: Router) {
    }
  logIn(data): Observable<any> {
    // if (!data.email) {
    //   data.email = this.session.getEmail();
    //   data.password = this.session.getPassword();
    // }
    data.hashKey = this.session.getHashKey();
    return this.http.post<Response>(`${this.rootURL}login?session=false&login=true`, data).pipe(
      switchMap(res => this.callBack(res, null))
    );
  }

  logOut(data): Observable<any> {
    return this.http.post<Response>(`${this.rootURL}logout?session=${this.session.getHashKey()}`, data).pipe(
      switchMap(res => this.callBack(res, null))
    );
  }

  getDashboardDetails(): Observable<any> {
    if (this.appartement.length === 0) {
      return this.http.get<Response>(`${this.rootURL}dashboardDetails?session=${this.session.getHashKey()}`).pipe(
        switchMap(res => this.callBack(res, ''))
      );
    } else {
      return of({});
    }
  }

  saveAppartement(data): Observable<Response> {
    return this.http.post<Response>(`${this.rootURL}saveAppartement?session=${this.session.getHashKey()}`, data).pipe(
      switchMap(res => this.callBack(res, null))
    );
  }

  getAppartement(): Observable<Appartement[]> {
    if (this.appartement.length === 0) {
      return this.http.get<Response>(`${this.rootURL}appartementDetails?session=${this.session.getHashKey()}`).pipe(
        switchMap(res => this.callBack(res, 'appartement'))
      );
    } else {
      return of(this.appartement);
    }
  }

  deleteAppartement(data): Observable<Response[]> {
    return this.http.post<Response>(`${this.rootURL}deleteAppartement?session=${this.session.getHashKey()}`, data).pipe(
      switchMap(res => this.callBack(res, null))
    );
  }

  saveManager(data): Observable<any> {
    return this.http.post<Response>(`${this.rootURL}saveManager?session=${this.session.getHashKey()}`, data).pipe(
      switchMap(res => this.callBack(res, null))
    );
  }

  getManager(): Observable<any[]> {
    if (this.manager.length === 0) {
      return this.http.get<Response>(`${this.rootURL}allManagerDetails?session=${this.session.getHashKey()}`).pipe(
        switchMap(res => this.callBack(res, 'manager'))
      );
    } else {
      return of(this.manager);
    }
  }

  saveTenant(data): Observable<any> {
    return this.http.post<Response>(`${this.rootURL}saveTenant?session=${this.session.getHashKey()}`, data).pipe(
      switchMap(res => this.callBack(res, null))
    );
  }

  getTenant(): Observable<any[]> {
    if (this.tenant.length === 0) {
      return this.http.get<Response>(`${this.rootURL}allTenantDetails?session=${this.session.getHashKey()}`).pipe(
        switchMap(res => this.callBack(res, 'tenant'))
      );
    } else {
      return of(this.tenant);
    }
  }

  saveTicket(data): Observable<any> {
    return this.http.post<Response>(`${this.rootURL}saveTicket?session=${this.session.getHashKey()}`, data).pipe(
      switchMap(res => this.callBack(res, null))
    );
  }

  getTicket(): Observable<any[]> {
    if (this.ticket.length === 0) {
      return this.http.get<Response>(`${this.rootURL}allTickets?session=${this.session.getHashKey()}`).pipe(
        switchMap(res => this.callBack(res, 'ticket'))
      );
    } else {
      return of(this.ticket);
    }
  }

  deleteTicket(data): Observable<Response[]> {
    return this.http.post<Response>(`${this.rootURL}deleteTicket?session=${this.session.getHashKey()}`, data).pipe(
      switchMap(res => this.callBack(res, null))
    );
  }

  callBack(res, key) {
    if (!res.success) {
      // this.a.onShow();
      this.router.navigate(['login']);
      throw (new Error(res.data.msg));
    }
    if (key) {
      this[key] = res.data;
    }
    return of(res.data);
  }
}
