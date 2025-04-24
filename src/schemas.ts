import { z } from "zod";

export const taskFormSchema = z.object({
  name: z.string().min(1, "Name is required").default(""),
  description: z.string().min(1, "Description is required").default(""),
});

export const registerFormSchema = z.object({
  email: z.string({ required_error: "Email is required" }).email("Invalid email").min(1, "Email is required"),
  password: z.string({ required_error: "Password is required" }).min(6,"Password must be at least 6 characters")
});

export const taskSchema = taskFormSchema.merge(
  z.object({
    taskId: z.string(),
  })
);

export const columnFormSchema = z.object({
  name: z.string().min(1, "Name is required").default(""),
});

export const columnSchema = columnFormSchema.merge(
  z.object({
    columnId: z.string(),
    tasks: z.array(taskSchema),
  })
);
