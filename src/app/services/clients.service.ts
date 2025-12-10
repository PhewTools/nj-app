import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../shared/http.service';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {
  private readonly baseUrl = '/client';

  constructor(private http: HttpService) {}

  getClients(params?: any): Observable<any> {
    return this.http.get<any>(this.baseUrl, params);
  }

  getClientById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  createClient(client: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, client);
  }

  updateClient(id: string, client: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, client);
  }

  deleteClient(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }
}
