import {Component, OnDestroy} from "@angular/core";
import {AuthService} from "../shared/services/auth.service";
import {Subscription} from "rxjs";

@Component({
  selector: "app-register-page",
  templateUrl: "./register-page.component.html",
  styleUrls: ["./register-page.component.scss"]
})
export class RegisterPageComponent implements OnDestroy {
  email: string = "";
  password: string = "";
  username: string = "";
  subscriptions: Array<Subscription> = [];

  constructor(
    private authService: AuthService,
  ) {
  }

  onSubmit(): void {
    this.subscriptions.push(
      this.authService.signUp(this.email, this.password, this.username.trim())
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
