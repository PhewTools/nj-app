import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../shared/http.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private readonly baseUrl = '/login';

  constructor(private http: HttpService) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(this.baseUrl, { email, password });
  }
}
