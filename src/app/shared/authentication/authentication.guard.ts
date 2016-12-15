import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { FirebaseAuth, FirebaseAuthState } from 'angularfire2';
import { LocalStorageService } from 'ng2-webstorage';
import { Observable } from 'rxjs';

import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';

/**
 * This class implements a guard for routes that require successful authentication.
 */
@Injectable()
export class AuthenticationGuard implements CanActivate {
  /**
   * Constructor of the class
   *
   * @param {LocalStorageService} localStorage
   * @param {FirebaseAuth}        auth
   * @param {Router}              router
   */
  constructor(
    private localStorage: LocalStorageService,
    private auth: FirebaseAuth,
    private router: Router
  ) {}

  /**
   * To protect routes from being accessible without authentication, the `canActivate()` method checks that current
   * user has been authenticated via FireBaseAuth service and current auth state is valid. Only then navigation will
   * pass on the requested route. Otherwise user will be redirected to login page.
   *
   * @returns {Observable<boolean>}
   */
  canActivate(): Observable<boolean> {
    return this.auth
      .take(1)
      .map((authState: FirebaseAuthState) => {
        !!authState ? this.localStorage.store('uid', authState.uid) : this.localStorage.clear('uid');

        return !!authState;
      })
      .do(authenticated => {
        if (!authenticated) {
          this.router.navigate(['/login']);
        }
      })
    ;
  }
}
