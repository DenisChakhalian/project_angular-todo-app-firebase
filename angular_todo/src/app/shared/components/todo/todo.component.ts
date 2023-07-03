import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {Todo} from "../../interfaces";

@Component({
  selector: "app-todo",
  templateUrl: "./todo.component.html",
  styleUrls: ["./todo.component.scss"]
})
export class TodoComponent implements OnInit {
  @Input() todo!: Todo;
  @Output() delete: EventEmitter<string> = new EventEmitter<string>();
  @Output() complete: EventEmitter<Todo> = new EventEmitter<Todo>();
  isCompleted: boolean = false;
  disabledButtons: boolean = false;

  ngOnInit(): void {
    this.isCompleted = this.todo.isCompleted;
  }

  deleteTodoById(): void {
    this.disabledButtons = true;
    this.delete.emit(this.todo.id);
    this.disabledButtons = false;
  }

  completeTodo(): void {
    this.disabledButtons = true;
    this.isCompleted = !this.isCompleted;
    const data: Todo = {
      id: this.todo.id,
      date: this.todo.date,
      todo: this.todo.todo,
      isCompleted: this.isCompleted,
    };
    this.complete.emit(data);
    this.disabledButtons = false;
  }
}
