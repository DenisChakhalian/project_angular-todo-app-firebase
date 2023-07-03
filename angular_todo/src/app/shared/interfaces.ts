import {AlertType} from "./services/alert.service";

export interface Todo {
  date: number;
  id: string;
  isCompleted: boolean;
  todo: string;
}

export interface User {
  userId: string,
  username: string,
}

export interface TodoResponse {
  date: number;
  isCompleted: boolean;
  todo: string;
}

export interface Alert {
  type: AlertType;
  text: string;
}
