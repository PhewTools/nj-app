import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../shared/http.service';
import { AuthResponse } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private readonly baseUrl = '/auth/login';

  constructor(private http: HttpService) {}

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.baseUrl, { email, password });
  }
}
