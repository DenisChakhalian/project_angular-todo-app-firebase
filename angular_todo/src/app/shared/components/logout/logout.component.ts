import {Component, OnDestroy} from "@angular/core";
import {AuthService} from "../../services/auth.service";
import {Subscription} from "rxjs";

@Component({
  selector: "app-logout",
  templateUrl: "./logout.component.html",
  styleUrls: ["./logout.component.scss"]
})
export class LogoutComponent implements OnDestroy {
  subscriptions: Array<Subscription> = [];

  constructor(
    private auth: AuthService,
  ) {
  }

  signOut(): void {
    this.subscriptions.push(
      this.auth.signOut().subscribe()
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscriptions => subscriptions.unsubscribe());
  }
}
