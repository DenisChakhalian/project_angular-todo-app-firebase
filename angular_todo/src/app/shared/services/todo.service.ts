import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {catchError, map, Observable, throwError} from "rxjs";

import {TodoResponse, Todo} from "../interfaces";
import {AlertService} from "./alert.service";
import {environment} from "../../../environments/environment";

@Injectable({providedIn: "root"})
export class TodoService {

  private uid: string | null = null;

  constructor(
    private alert: AlertService,
    private http: HttpClient,
  ) {
  }

  setUid(): void {
    this.uid = localStorage.getItem("uid");
  }

  setTodosByUid(): Observable<Todo[] | undefined> {
    this.setUid();
    const path: string = "/todos/" + this.uid;

    return this.http.get(`${environment.firebaseConfig.databaseURL}${path}.json`)
      .pipe(
        map((res: any) => {
          const response: TodoResponse[] = res;
          if (!response) return;
          const result: Todo[] = [];
          for (let [id, value] of Object.entries(response)) {
            result.push({
              ...value as TodoResponse,
              id
            });
          }
          return result;
        }),
        catchError((err: HttpErrorResponse) => {
          this.alert.danger("Such a user does not exist!");
          return throwError(err);
        })
      )
      ;
  }

  setUsernameByUid(): Observable<string> {
    this.setUid();
    const path: string = "/users/" + this.uid;
    return this.http.get(`${environment.firebaseConfig.databaseURL}${path}.json`)
      .pipe(
        map((res: any) => {
          return res[Object.keys(res)[0]].username;
        }),
        catchError((err: HttpErrorResponse) => {
          this.alert.danger("Such a user does not exist!");
          return throwError(err);
        })
      )
  }

  deleteTodoById(id: string): Observable<any> {
    this.setUid();
    const path: string = "/todos/" + this.uid + "/" + id;
    return this.http.delete(`${environment.firebaseConfig.databaseURL}${path}.json`)
      .pipe(
        catchError((err: HttpErrorResponse) => {
          this.alert.danger("Unknown error! Try again later!");
          return throwError(err);
        })
      )
  }

  completeTodo(todo: Todo): Observable<any> {
    this.setUid();
    const path: string = "/todos/" + this.uid + "/" + todo.id;
    return this.http.patch(`${environment.firebaseConfig.databaseURL}${path}.json`,
      {
        isCompleted: todo.isCompleted,
      })
      .pipe(
        catchError((err: HttpErrorResponse) => {
          this.alert.danger("Unknown error! Try again later!");
          return throwError(err);
        })
      );
  }

  deleteTodos(): Observable<any> {
    this.setUid();
    const path: string = "/todos/" + this.uid;
    return this.http.delete(`${environment.firebaseConfig.databaseURL}${path}.json`)
      .pipe(
        catchError((err: HttpErrorResponse) => {
          this.alert.danger("Unknown error! Try again later!");
          return throwError(err);
        })
      );
  }

  deleteCompletedTodos(todos: string[]): Observable<any> {
    this.setUid();
    const path: string = "/todos/" + this.uid;
    const completedTodos: any = {};
    todos.forEach(el => completedTodos[el] = null)

    return this.http.patch(`${environment.firebaseConfig.databaseURL}${path}.json`, completedTodos)
      .pipe(
        catchError((err: HttpErrorResponse) => {
          this.alert.danger("Unknown error! Try again later!");
          return throwError(err);
        })
      )
  }

  setTodo(todo: string): Observable<any> {
    const path = "/todos/" + this.uid;
    const data: TodoResponse = {
      todo: todo,
      isCompleted: false,
      date: new Date().getTime(),
    };

    return this.http.post(`${environment.firebaseConfig.databaseURL}${path}.json`, data)
      .pipe(
        map((res: any) => {
          if (!res.name) throw new Error();
          return {
            todo: todo,
            id: res.name,
            isCompleted: false,
            date: new Date().getTime(),
          };
        }),
        catchError((err: HttpErrorResponse) => {
          this.alert.danger("Such a user does not exist!");
          return throwError(err);
        })
      )
  }
}
