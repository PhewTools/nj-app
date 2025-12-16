import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../shared/http.service';
import { Client } from '../tabs/clients/clients.utils';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {
  private readonly baseUrl = '/client';

  constructor(private http: HttpService) {}

  getClients(params?: any): Observable<Client[]> {
    return this.http.get<Client[]>(this.baseUrl, params);
  }

  getClientById(id: string): Observable<any> {
    return this.http.get<Client>(`${this.baseUrl}/${id}`);
  }

  createClient(client: Omit<Client, 'id'>): Observable<any> {
    return this.http.post<Omit<Client, 'id'>>(this.baseUrl, client);
  }

  updateClient(id: string, client: Omit<Client, 'id'>): Observable<any> {
    return this.http.put<Omit<Client, 'id'>>(`${this.baseUrl}/${id}`, client);
  }

  deleteClient(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }
}
