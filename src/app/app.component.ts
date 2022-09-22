import { Component, OnInit } from '@angular/core';
import { AuthService } from './core/auth-service.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: []
})
export class AppComponent implements OnInit {
  isLoggedIn = false;

  constructor(private _authService : AuthService) {
    this._authService.loginChanged.subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
    })
  }

  ngOnInit(): void {
    this._authService.isLoggedIn().then(loggedId => {
      this.isLoggedIn = loggedId;
    });
  }

  login() {
    console.log('app-component login');
    this._authService.login();
  }

  logout() {
    console.log('app-component logout');
    this._authService.logout();
  }
}
