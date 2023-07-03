import {Component, EventEmitter, Input, Output} from "@angular/core";

@Component({
  selector: "app-todo-actions",
  templateUrl: "./todo-actions.component.html",
  styleUrls: ["./todo-actions.component.scss"]
})
export class TodoActionsComponent {
  @Output() deleteAllTodos: EventEmitter<void> = new EventEmitter<void>();
  @Output() deleteCompleted: EventEmitter<string[]> = new EventEmitter<string[]>();
  isDisable: boolean = false;
  @Input() hasCompleted!: string[];

  deleteAll(): void {
    this.isDisable = true;
    this.deleteAllTodos.emit();
    this.isDisable = false;
  }

  deleteCompletedTodos(): void {
    this.isDisable = true;
    this.deleteCompleted.emit(this.hasCompleted);
    this.isDisable = false;
  }
}
