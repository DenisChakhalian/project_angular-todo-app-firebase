import {Component, EventEmitter, Input, Output} from "@angular/core";
import {Todo} from "../../interfaces";

@Component({
  selector: "app-todo-list",
  templateUrl: "./todo-list.component.html",
  styleUrls: ["./todo-list.component.scss"]
})
export class TodoListComponent {
  @Input() todos: Todo[] = [];
  @Output() deleteTodoById: EventEmitter<string> = new EventEmitter<string>;
  @Output() completeTodo: EventEmitter<Todo> = new EventEmitter<Todo>;

  deleteItem(id: any): void {
    this.deleteTodoById.emit(id);
  }

  completeItem(todo: Todo): void {
    this.completeTodo.emit(todo);
  }
}


