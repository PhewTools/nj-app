import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const token = this.authService.getToken();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  get<T>(url: string, params?: HttpParams | { [param: string]: string | number | boolean | readonly (string | number | boolean)[] }): Observable<T> {
    return this.http.get<T>(this.baseUrl+url, {
      headers: this.getHeaders(),
      params: params instanceof HttpParams ? params : new HttpParams({ fromObject: params as any })
    });
  }

  post<T>(url: string, body: any, params?: HttpParams | { [param: string]: string | number | boolean | readonly (string | number | boolean)[] }): Observable<T> {
    return this.http.post<T>(this.baseUrl+url, body, {
      headers: this.getHeaders(),
      params: params instanceof HttpParams ? params : new HttpParams({ fromObject: params as any })
    });
  }

  put<T>(url: string, body: any, params?: HttpParams | { [param: string]: string | number | boolean | readonly (string | number | boolean)[] }): Observable<T> {
    return this.http.put<T>(this.baseUrl+url, body, {
      headers: this.getHeaders(),
      params: params instanceof HttpParams ? params : new HttpParams({ fromObject: params as any })
    });
  }

  delete<T>(url: string, params?: HttpParams | { [param: string]: string | number | boolean | readonly (string | number | boolean)[] }): Observable<T> {
    return this.http.delete<T>(this.baseUrl+url, {
      headers: this.getHeaders(),
      params: params instanceof HttpParams ? params : new HttpParams({ fromObject: params as any })
    });
  }
}
