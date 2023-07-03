import {Injectable} from "@angular/core";
import jwt_decode, {JwtPayload} from "jwt-decode";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import firebase from "firebase/compat/app";
import {Router} from "@angular/router";
import {User} from "../interfaces";
import TwitterAuthProvider_Instance = firebase.auth.TwitterAuthProvider_Instance;
import GoogleAuthProvider_Instance = firebase.auth.GoogleAuthProvider_Instance;
import {AlertService} from "./alert.service";
import {environment} from "../../../environments/environment";
import {catchError, from, map, Observable, of, switchMap, tap, throwError} from "rxjs";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";

@Injectable({providedIn: "root"})
export class AuthService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private afAuth: AngularFireAuth,
    private alert: AlertService,
  ) {
  }

  signUp(email: string, password: string, username: string): Observable<any> {
    return this.http
      .post(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseConfig.apiKey}`, {
        email,
        password
      })
      .pipe(
        switchMap((res: any) => {
          return this.setUser(res.idToken, res.localId, username);
        }),
        catchError((err: HttpErrorResponse) => {
          switch (err.error.error.message) {
            case "EMAIL_EXISTS":
              this.alert.danger("A user with this email already exists!");
              break;
            case "INVALID_EMAIL":
            case "MISSING_EMAIL":
              this.alert.danger("Invalid email!");
              break;
            case "WEAK_PASSWORD : Password should be at least 6 characters":
              this.alert.danger("Password should be at least 6 characters!");
              break;
            default:
              this.alert.danger("Something wrong!");
              break;
          }
          return throwError(err);
        })
      )
  }

  signIn(email: string, password: string): Observable<any> {
    return this.http
      .post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseConfig.apiKey}`, {
        email,
        password
      })
      .pipe(
        tap((res: any) => {
          this.success(res.idToken, res.localId);
        }),
        catchError((err: HttpErrorResponse) => {
          switch (err.error.error.message) {
            case "EMAIL_NOT_FOUND":
              this.alert.danger("A user with such an email does not exist!");
              break;
            case "INVALID_EMAIL":
              this.alert.danger("Invalid email!");
              break;
            case "INVALID_PASSWORD":
              this.alert.danger("Wrong password!");
              break;
            default:
              this.alert.danger("Something wrong!");
              break;
          }
          return throwError(err);
        })
      )
  }

  signInWithGoogle(): Observable<firebase.auth.UserCredential> {
    const provider: GoogleAuthProvider_Instance = new firebase.auth.GoogleAuthProvider();
    return this.signInWithSocialNetwork(provider);
  }

  signInWithTwitter(): Observable<firebase.auth.UserCredential> {
    const provider: TwitterAuthProvider_Instance = new firebase.auth.TwitterAuthProvider();
    return this.signInWithSocialNetwork(provider);
  }

  signInWithSocialNetwork(provider: GoogleAuthProvider_Instance | TwitterAuthProvider_Instance): Observable<firebase.auth.UserCredential> {
    return from(this.afAuth.signInWithPopup(provider))
      .pipe(
        map((res: any) => {
          const token: string = res.user?.multiFactor?.user?.accessToken;
          const userId: string = res.user?.multiFactor?.user?.uid;
          const username: string = res.user?.multiFactor?.user?.displayName;
          return {
            token,
            userId,
            username
          }
        }),
        switchMap(({token, userId, username}) => {
          return this.setUser(token, userId, username)
        }),
        catchError((err: HttpErrorResponse) => {
          this.alert.danger("Try logging in again!");
          return throwError(err);
        })
      );
  }

  setUser(token: string, userId: string, username: string): Observable<any> {
    const path: string = "/users/" + userId;
    return this.isExistUser(userId, path)
      .pipe(
        map(user => {
          return !user ? {
            userId,
            username,
          } : null
        }),
        switchMap((user: User | null) => {
          if (user) {
            return this.isNotExistUser(user, path);
          }
          return of(null);
        }),
        tap(() => {
          this.success(token, userId);
        })
      );
  }

  public isAuthenticated(): boolean {
    const token: string | null = localStorage.getItem("jwt_token");
    const uid: string | null = localStorage.getItem("uid");
    const tokenExp: string | null = localStorage.getItem("jwt_token_exp");
    return !!(token && uid && tokenExp);
  }

  isExistUser(userId: string, path: string): Observable<any> {
    return this.http
      .get(`${environment.firebaseConfig.databaseURL}${path}.json`);
  }

  isNotExistUser(data: User, path: string): Observable<any> {
    return this.http
      .post(`${environment.firebaseConfig.databaseURL}${path}.json`, data)
  }

  public setLocalStorage(name: string, value: string): void {
    localStorage.setItem(name, value);
  }

  success(token: string, userId: string): void {
    const jwt: JwtPayload = jwt_decode(token);
    if (jwt.exp) {
      const expDate = new Date(jwt.exp * 1000)
      this.setLocalStorage('jwt_token', token);
      this.setLocalStorage('uid', userId);
      this.setLocalStorage('jwt_token_exp', expDate.toString());
      this.router.navigate(["/"]);
    } else {
      this.logout();
    }
  }

  get token(): string {
    const token = localStorage.getItem("jwt_token_exp");
    if (!token) {
      return "";
    }

    const expDate = new Date(token);

    if (new Date() > expDate) {
      this.logout();
      this.alert.info("Your token has expired. Sign in again.");
      this.router.navigate(["/login"]);
      return "";
    }
    return localStorage.getItem("jwt_token") || "";
  }

  logout() {
    localStorage.clear();
  }

  signOut(): Observable<void> {
    return from(this.afAuth.signOut())
      .pipe(
        tap(() => {
          this.logout();
          this.router.navigate(["/login"]);
        }),
        catchError((err: HttpErrorResponse) => {
          this.alert.danger("Try it in again!");
          return throwError(err);
        })
      );
  }
}
