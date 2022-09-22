import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../core/auth-service.component';

@Component({
    selector: 'app-signin-callback',
    template: `<div></div>`
})

export class SignInRedirectCallbackComponent implements OnInit {

    constructor(private authService: AuthService, private router: Router) { }

    ngOnInit() {
        this.authService.completeLogin().then(user => {
            console.log('signin-callback completeLogin');
            this.router.navigate(['/'], { replaceUrl: true })
        });
    }
}