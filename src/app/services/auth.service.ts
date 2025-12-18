import { Injectable } from '@angular/core';

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  lastname: string;
  role: string;
}

export interface AuthResponse {
  access_token: string;
  user: AuthUser;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';

  setAuth(authResponse: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, authResponse.access_token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(authResponse.user));
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getUser(): AuthUser | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    if (!userStr) {
      return null;
    }
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }
}
