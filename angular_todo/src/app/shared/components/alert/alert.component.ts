import {Component, Input, OnDestroy, OnInit} from "@angular/core";
import {AlertService} from "../../services/alert.service";
import {Subscription} from "rxjs";

@Component({
  selector: "app-alert",
  templateUrl: "./alert.component.html",
  styleUrls: ["./alert.component.scss"]
})
export class AlertComponent implements OnInit, OnDestroy {
  @Input() delay = 5 * 1000;
  public text = "";
  public type = "success";
  aSub: Subscription[] = [];

  constructor(
    private alertService: AlertService,
  ) {
  }

  ngOnInit() {
    this.aSub.push(this.alertService.alert$
      .subscribe(alert => {
        this.text = alert.text;
        this.type = alert.type;

        const timeout = setTimeout(() => {
          clearTimeout(timeout)
          this.text = ""
        }, this.delay);
      }));
  }

  ngOnDestroy(): void {
    this.aSub.forEach(sub => {
      sub.unsubscribe();
    });
  }

}
