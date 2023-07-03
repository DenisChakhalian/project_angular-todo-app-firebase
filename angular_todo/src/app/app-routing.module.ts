import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import {HomePageComponent} from "./home-page/home-page.component";
import {LoginPageComponent} from "./login-page/login-page.component";
import {RegisterPageComponent} from "./register-page/register-page.component";
import {AuthGuard} from "./shared/services/auth.guard";
import {LoginAuthGuard} from "./shared/services/login.auth.guard";

const routes: Routes = [
  {
    path: "", component: HomePageComponent, canActivate: [AuthGuard]
  },
  {
    path: "login", component:LoginPageComponent, canActivate:[LoginAuthGuard]
  },
  {
    path: "register", component:RegisterPageComponent,canActivate:[LoginAuthGuard]
  },
  {
    path: "**", redirectTo:"/login"
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
