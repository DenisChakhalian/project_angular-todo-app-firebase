import {Injectable} from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse
} from '@angular/common/http';
import {Router} from "@angular/router";
import {catchError, Observable, throwError} from 'rxjs';

import {AuthService} from "./services/auth.service";
import {AlertService} from "./services/alert.service";

@Injectable()
export class Interceptor implements HttpInterceptor {
  constructor(
    private auth: AuthService,
    private alert: AlertService,
    private router: Router,
  ) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.auth.token;
    if (this.auth.isAuthenticated() && token) {
      req = req.clone({
        setParams: {
          auth: token
        }
      });
    }
    return next.handle(req)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            this.auth.logout();
            this.alert.info("Your token has expired. Sign in again.");
            this.router.navigate(['/login']);
          }
          return throwError(error);
        })
      )
  }
}
