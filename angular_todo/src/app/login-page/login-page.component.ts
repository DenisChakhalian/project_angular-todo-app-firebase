import {Component, OnDestroy, OnInit} from "@angular/core";
import {AuthService} from "../shared/services/auth.service";
import {Subscription} from "rxjs";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {AlertService} from "../shared/services/alert.service";

@Component({
  selector: "app-login-page",
  templateUrl: "./login-page.component.html",
  styleUrls: ["./login-page.component.scss"]
})

export class LoginPageComponent implements OnDestroy {
  email: string = "";
  password: string = "";
  subscriptions: Array<Subscription> = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
  }

  onSubmit(): void {
    this.subscriptions.push(
      this.authService.signIn(this.email, this.password)
        .subscribe()
    );
  }

  signInWithGoogle(): void {
    this.subscriptions.push(
      this.authService.signInWithGoogle()
        .subscribe()
    );
  }

  signInWithTwitter(): void {
    this.subscriptions.push(
      this.authService.signInWithTwitter()
        .subscribe()
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscriptions => subscriptions.unsubscribe());
  }
}
