import {Component, OnDestroy, OnInit} from "@angular/core";
import {TodoService} from "../shared/services/todo.service";
import {Todo} from "../shared/interfaces";
import {Subscription} from "rxjs";


@Component({
  selector: "app-home-page",
  templateUrl: "./home-page.component.html",
  styleUrls: ["./home-page.component.scss"]
})

export class HomePageComponent implements OnInit, OnDestroy {
  username: string = "";
  todos: Todo[] = [];
  isLoading: boolean = true;
  completedTodos: string[] = [];
  subscriptions: Array<Subscription> = [];

  constructor(
    private todoService: TodoService,
  ) {

  }

  ngOnInit(): void {
    this.setTodos();
    this.setUsername();
  }

  setUsername(): void {
    this.subscriptions.push(
      this.todoService.setUsernameByUid()
        .subscribe(res => this.username = res)
    )
  }

  setTodos(): any {
    this.subscriptions.push(
      this.todoService.setTodosByUid()
        .subscribe((res: Todo[] | null | undefined) => {
          if (res) {
            this.todos = this.todos.concat(res);
            this.setCompletedTodos();
            this.todos.sort((a: Todo, b: Todo) => a.date > b.date ? 1 : -1);
          }
          this.isLoading = false;
        })
    )
  }


  setCompletedTodos(): void {
    this.completedTodos = this.todos
      .filter((el: Todo) => el.isCompleted)
      .map((el: Todo) => el.id);
  }

  addTodo(todo: Todo): void {
    this.todos.push({
      ...todo
    });
    this.setCompletedTodos();
  }

  delete(id: string): void {
    if (!id) return;
    this.subscriptions.push(
      this.todoService.deleteTodoById(id)
        .subscribe(() => {
          this.todos = this.todos.filter((todo: Todo) => todo.id !== id);
          this.setCompletedTodos();
        })
    )
  }

  complete(todo: Todo): void {
    if (!todo) return;
    this.subscriptions.push(
      this.todoService.completeTodo(todo)
        .subscribe(() => {
          this.todos = this.todos.map((el: Todo) => {
            if (el.id === todo.id) {
              el.isCompleted = todo.isCompleted;
            }
            return el;
          });
          this.setCompletedTodos();
        })
    )
  }

  deleteAllTodos(): void {
    if (!this.todos.length) return;
    this.todos = [];
    this.subscriptions.push(
      this.todoService.deleteTodos()
        .subscribe()
    );
  }

  deleteCompleted(todos: string[]): void {
    this.subscriptions.push(
      this.todoService.deleteCompletedTodos(todos)
        .subscribe(() => {
          this.todos = this.todos.filter((el: Todo) => !el.isCompleted);
          this.setCompletedTodos();
        })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscriptions => subscriptions.unsubscribe());
  }
}
