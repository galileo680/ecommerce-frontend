import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private jwtHelper = new JwtHelperService();

  constructor() {}

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getDecodedToken(): any {
    const token = this.getToken();
    if (!token) {
      return null;
    }

    try {
      return this.jwtHelper.decodeToken(token);
    } catch (error) {
      console.error('Invalid token', error);
      return null;
    }
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) {
      return true;
    }

    try {
      return this.jwtHelper.isTokenExpired(token);
    } catch (error) {
      console.error('Error checking token expiration', error);
      return true;
    }
  }

  getUserEmailFromToken(): string | null {
    const decodedToken = this.getDecodedToken();
    return decodedToken ? decodedToken.sub : null;
  }

  getRolesFromToken(): string[] {
    const decodedToken = this.getDecodedToken();
    return decodedToken && decodedToken.roles ? decodedToken.roles : [];
  }

  hasRole(role: string): boolean {
    const roles = this.getRolesFromToken();
    return roles.includes(role);
  }

  isAdmin(): boolean {
    return this.hasRole('ADMIN');
  }
}
