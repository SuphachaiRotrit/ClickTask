import { useFormik } from "formik";
import * as Yup from "yup";
import { useTasks } from "@/lib/task-context";
import type { TaskAssignee, TaskPriority, Subtask, TaskLink } from "@/types/task";

export type CreateTaskFormValues = {
  title: string;
  description: string;
  status: string;
  priority: TaskPriority | null;
  dueDate: string | null;
  tags: string[];
  images: string[];
  links: TaskLink[];
  subtasks: Subtask[];
  assignees: TaskAssignee[];
};

export const createTaskSchema = Yup.object({
  title: Yup.string().trim().required("Task name is required"),
  description: Yup.string().default(""),
  status: Yup.string().required(),
  priority: Yup.string().nullable().default(null),
  dueDate: Yup.string().nullable().default(null),
  tags: Yup.array().of(Yup.string().required()).default([]),
  images: Yup.array().of(Yup.string().required()).default([]),
  links: Yup.array().default([]),
  subtasks: Yup.array().default([]),
  assignees: Yup.array().default([]),
});

const initialValues: CreateTaskFormValues = {
  title: "",
  description: "",
  status: "todo",
  priority: null,
  dueDate: null,
  tags: [],
  images: [],
  links: [],
  subtasks: [],
  assignees: [],
};

export function useNewTask(onSuccess: () => void) {
  const { addTask } = useTasks();

  const formik = useFormik<CreateTaskFormValues>({
    initialValues,
    validationSchema: createTaskSchema,
    onSubmit: (values, { resetForm }) => {
      addTask({
        title: values.title.trim(),
        description: values.description.trim(),
        images: values.images,
        links: values.links,
        status: values.status,
        priority: values.priority || "medium",
        assignees: values.assignees,
        dueDate: values.dueDate || null,
        tags: values.tags,
        subtasks: values.subtasks,
      });
      resetForm();
      onSuccess();
    },
  });

  return { formik, initialValues };
}
