import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private apiUrl = `${environment.apiUrl}/api/ticket/create`; // Use environment's base URL

  constructor(private http: HttpClient) {}

  createTicket(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data); // API call with environment-based URL
  }
}
