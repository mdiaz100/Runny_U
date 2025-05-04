import { Injectable } from '@angular/core';
import { User } from '../interfaces/user.interface';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private storageKey = 'users';
  private sessionKey = 'loggedInUser';
  private userSubject = new BehaviorSubject<User | null>(this.getLoggedInUser());
  user$ = this.userSubject.asObservable();


  getUsers(): User[] {
    return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
  }

  isEmailRegistered(email: string): boolean {
    return this.getUsers().some(user => user.email === email);
  }

  addUser(user: User): void {
    const users = this.getUsers();
    users.push(user);
    localStorage.setItem(this.storageKey, JSON.stringify(users));
  }

  login(email: string, password: string): boolean {
    const user = this.getUsers().find(u => u.email === email && u.password === password);
    if (user) {
      localStorage.setItem(this.sessionKey, JSON.stringify(user));
      this.userSubject.next(user);  // <--- notifica que hay sesión
      return true;
    }
    return false;
  }  

  logout(): void {
    localStorage.removeItem(this.sessionKey);
    this.userSubject.next(null);  // <--- notifica que cerró sesión
  }  

  getLoggedInUser(): User | null {
    const user = localStorage.getItem(this.sessionKey);
    return user ? JSON.parse(user) : null;
  }

  isLoggedIn(): boolean {
    return !!this.getLoggedInUser();
  }
}


