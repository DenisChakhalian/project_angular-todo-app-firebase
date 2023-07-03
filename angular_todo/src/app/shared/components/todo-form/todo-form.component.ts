import {Component, EventEmitter, OnDestroy, Output} from "@angular/core";
import {TodoService} from "../../services/todo.service";
import {Todo} from "../../interfaces";
import {Subscription} from "rxjs";

@Component({
  selector: "app-todo-form",
  templateUrl: "./todo-form.component.html",
  styleUrls: ["./todo-form.component.scss"]
})
export class TodoFormComponent implements OnDestroy {

  todo: string = "";
  @Output() newTodo: EventEmitter<Todo> = new EventEmitter<Todo>();

  subscriptions: Array<Subscription> = [];

  constructor(
    private todoService: TodoService,
  ) {
  }

  addNewItem(): void {
    this.todo = this.todo.trim();
    if (!this.todo) return;
    this.subscriptions.push(
      this.todoService.setTodo(this.todo)
        .subscribe(res => {
          if (!res) return;
          this.newTodo.emit(res);
          this.todo = "";
        })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscriptions => subscriptions.unsubscribe());
  }
}
