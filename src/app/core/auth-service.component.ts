import { Injectable } from '@angular/core';
import { CoreModule } from './core.module';
import { User, UserManager } from 'oidc-client';
import { Constants } from '../constants';
import { Subject } from 'rxjs';

@Injectable({providedIn: CoreModule})
export class AuthService {
    private _userManager: UserManager;
    private _user: User;
    private _loginChangedSubject = new Subject<boolean>();

    loginChanged = this._loginChangedSubject.asObservable();
    
    constructor() {
        console.log('auth service constructor');
        const stsSettings = {
            authority: Constants.stsAuthority,
            client_id: Constants.clientId,
            redirect_uri: `${Constants.clientRoot}signin-callback`,
            scope: 'openid profile projects-api',
            response_type: 'code',
            // post_logout_redirect_url: `${Constants.clientRoot}signout-callback`,
            metadata: {
                issuer: `${Constants.stsAuthority}`,
                // authorization_endpoint: `${Constants.stsAuthority}authorize`,
                // to get a JWT as an access_token (browser, tab Application) instead of a plain string
                authorization_endpoint: `${Constants.stsAuthority}authorize?audience=project-api`,
                jwks_uri: `${Constants.stsAuthority}.well-known/jwks.json`,
                token_endpoint: `${Constants.stsAuthority}oauth/token`,
                userinfo_endpoint: `${Constants.stsAuthority}userinfo`,
                end_session_endpoint: `${Constants.stsAuthority}v2/logout?client_id=${Constants.clientId}&returnTo=${encodeURI(Constants.clientRoot)}signout-callback`
            }
        };

        this._userManager = new UserManager(stsSettings)
    }

    login() {
        console.log('auth service login');
        return this._userManager.signinRedirect();
    }

    isLoggedIn() : Promise<boolean> {
        return this._userManager.getUser().then(user => {
            const userCurrent = !!user && !user.expired;

            if(this._user !== user) {
                this._loginChangedSubject.next(userCurrent);
            }
                this._user = user;

            return userCurrent;
        });
    }

    completeLogin() {
        // I need to invoke signinRedirectCallback to complete the login process
        return this._userManager.signinRedirectCallback().then(user => {
            console.log('auth service completeLogin');
            this._user = user;
            this._loginChangedSubject.next(!!user && !user.expired);
            return user;
        })
    }
    
    logout() {
        console.log('auth service logout');
        // you need to redirect to the STS to invalidate the login session and tokens
        this._userManager.signoutRedirect();
      }

    completeLogout() {
        console.log('auth service completeLogout');
        // I need to invoke signoutRedirectCallback to complete the logout process
        // It clears the state of the userManager and the user that is has cached
        this._user = null;
        return this._userManager.signoutRedirectCallback();
    }
}