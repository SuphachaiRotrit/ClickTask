import { useFormik } from "formik";
import { useTasks } from "@/lib/task-context";
import type { Task } from "@/types/task";
import type { TaskDetailFormValues } from "@/modules/dashboard/types";

export function useTaskDetail(task: Task) {
  const { updateTask } = useTasks();

  const formik = useFormik<TaskDetailFormValues>({
    initialValues: {
      status: task.status,
      priority: task.priority,
      assignees: task.assignees,
      dueDate: task.dueDate,
      tags: task.tags,
      description: task.description,
      links: task.links,
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      // console.log("🫨 ~ useTaskDetail ~ values:", values)
      // console.log("🫨 ~ useTaskDetail ~ task:", task)
    },
  });

  const updateField = <K extends keyof TaskDetailFormValues>(
    field: K,
    value: TaskDetailFormValues[K],
  ) => {
    formik.setFieldValue(field, value);
    updateTask(task.id, { [field]: value });
  };

  return {
    formik,
    updateField,
  };
}
