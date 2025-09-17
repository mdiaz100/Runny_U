import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../interfaces/user.interface';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { TokenService } from './token.service';
import { TOKEN } from '../utils/constants';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  tokenService = inject(TokenService);
  private readonly userSubject = new BehaviorSubject<JwtPayload | null>(
    this.tokenService.decodeToken()
  );
  user$ = this.userSubject.asObservable();

  private readonly API_URL = 'http://localhost:3000/api/v1/auth';

  constructor(private readonly http: HttpClient) {}

  signUp(user: User): Observable<any> {
    return this.http.post(`${this.API_URL}/sign-up`, user).pipe(
      tap((res: any) => {
        localStorage.setItem(TOKEN, res.token);
        this.userSubject.next(this.tokenService.decodeToken());
      })
    );
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.API_URL}/login`, { email, password }).pipe(
      tap((res: any) => {
        localStorage.setItem(TOKEN, res.token);
        this.userSubject.next(this.tokenService.decodeToken());
      })
    );
  }

  logout(): void {
    this.tokenService.clearToken();
    this.userSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !this.tokenService.isTokenExpired();
  }

  getUser(): JwtPayload | null {
    return this.tokenService.decodeToken();
  }
  getLoggedInUser(): User | null {
    const user = this.getUser()?.fullname;
    return user ? JSON.parse(user) : null;
  }
}
