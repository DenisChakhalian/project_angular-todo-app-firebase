import {NgModule, Provider} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import { AngularFireModule } from "@angular/fire/compat";
import { AngularFireAuthModule } from "@angular/fire/compat/auth";
import {FormsModule} from "@angular/forms";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";

import {AppRoutingModule} from "./app-routing.module";
import {AppComponent} from "./app.component";
import {HomePageComponent} from "./home-page/home-page.component";
import {RegisterPageComponent} from "./register-page/register-page.component";
import {LoginPageComponent} from "./login-page/login-page.component";
import {TodoComponent} from "./shared/components/todo/todo.component";
import {TodoFormComponent} from "./shared/components/todo-form/todo-form.component";
import {TodoListComponent} from "./shared/components/todo-list/todo-list.component";
import {TodoActionsComponent} from "./shared/components/todo-actions/todo-actions.component";
import {LogoutComponent} from "./shared/components/logout/logout.component";
import {environment} from "../environments/environment";
import { AlertComponent } from "./shared/components/alert/alert.component";
import {Interceptor} from "./shared/interceptor";


const INTERCEPTOR_PROVIDER: Provider = {
  provide: HTTP_INTERCEPTORS,
  multi: true,
  useClass: Interceptor
}

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    RegisterPageComponent,
    LoginPageComponent,
    TodoComponent,
    TodoFormComponent,
    TodoListComponent,
    TodoActionsComponent,
    LogoutComponent,
    AlertComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    FormsModule,
  ],
  providers: [
    INTERCEPTOR_PROVIDER,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
