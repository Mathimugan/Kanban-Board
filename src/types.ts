import type { z } from "zod";
import type { columnSchema, taskSchema,registerFormSchema } from "./schemas";

export type Column = z.infer<typeof columnSchema>;
export type Task = z.infer<typeof taskSchema>;
export type Registration = z.infer<typeof registerFormSchema>;

export enum TYPES {
  COLUMN = "COLUMN",
  TASK = "TASK",
  REGISTRATION = "REGISTRATION",
}
export type ColumnType = Column & {
  isDragging?: boolean;
  tempId?: string;
};
export enum ACTIONS {
  ADD_COLUMN = "ADD_COLUMN",
  UPDATE_COLUMN = "UPDATE_COLUMN",
  DELETE_COLUMN = "DELETE_COLUMN",
  ADD_TASK = "ADD_TASK",
  UPDATE_TASK = "UPDATE_TASK",
  DELETE_TASK = "DELETE_TASK",
}

export type TRANSFER_DATA = {
  type: TYPES;
  columnId?: Column["columnId"];
  taskId?: Task["taskId"];
};
