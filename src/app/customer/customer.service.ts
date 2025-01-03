import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
   private customerData: any = null;

  setCustomerData(data: any) {
    this.customerData = data;
  }

  getCustomerData() {
    return this.customerData;
  }

  private apiUrl = `${environment.apiUrl}/api/ticket/create`; // Use environment's base URL

  constructor(private http: HttpClient) {}

  createTicket(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data); // API call with environment-based URL
  }
  getTicketDetails(data: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/api/ticket/details`, data); // API call with environment-based URL
  }
  getAllTicketDetails(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/api/ticket/alldetails`); // API call with environment-based URL
  }
  getTankDetails(data: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/api/tank/details`, data); // API call with environment-based URL
  }
  
  getlogin(data: any):  Observable<any>{
    return this.http.post(`${environment.apiUrl}/api/user/getuser`, data);
  }

 //admin
 CustomerDetails(): Observable<any> {
  return this.http.get(`${environment.apiUrl}/api/customer/customerdetails`);
 }
 getFilteredTickets(data: any): Observable<any> {
  return this.http.post(`${environment.apiUrl}/api/ticket/filtertickets`, data); // API call with environment-based URL
}

updateTicket(data: any): Observable<any> {
  return this.http.post(`${environment.apiUrl}/api/ticket/updateticket`, data); // API call with environment-based URL
}

updateManifest(data: any): Observable<any> {
  return this.http.post(`${environment.apiUrl}/api/customer/updatemanifest`, data); // API call with environment-based URL
}




}
