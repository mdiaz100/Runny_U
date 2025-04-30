import { Injectable } from '@angular/core';
import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private storageKey = 'users';
  private sessionKey = 'loggedInUser';

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
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem(this.sessionKey);
  }

  getLoggedInUser(): User | null {
    const user = localStorage.getItem(this.sessionKey);
    return user ? JSON.parse(user) : null;
  }

  isLoggedIn(): boolean {
    return !!this.getLoggedInUser();
  }
}


