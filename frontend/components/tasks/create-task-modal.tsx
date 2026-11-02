"use client";

/**
 * Create / edit task dialog.
 *
 * Frontend-only: validation runs in the browser and the resulting task lives
 * in the demo store (localStorage). No API calls happen in Phase 2.
 */

import { useState, type FormEvent } from "react";

import { useDemoStore } from "@/components/providers/demo-data-provider";
import { CURRENT_USER_ID } from "@/lib/sample-data";
import { PRIORITY_LABELS, STATUS_LABELS } from "@/lib/task-utils";
import Button from "@/components/ui/button";
import FormField, {
  fieldErrorId,
  fieldHintId,
} from "@/components/ui/form-field";
import Modal from "@/components/ui/modal";
import Select from "@/components/ui/select";
import type {
  CreateTaskInput,
  Task,
  TaskPriority,
  TaskStatus,
} from "@/types/task";

interface CreateTaskModalProps {
  open: boolean;
  onClose: () => void;
  /** When present the modal edits this task instead of creating one. */
  task?: Task;
}

interface FormValues {
  title: string;
  description: string;
  assigneeId: string;
  priority: TaskPriority;
  dueDate: string;
  status: TaskStatus;
}

type FormErrors = Partial<Record<keyof FormValues, string>>;

/** Calendar date `offset` days from today as `YYYY-MM-DD` (local time). */
function dayOffset(offset: number): string {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  const title = values.title.trim();
  const description = values.description.trim();

  if (!title) {
    errors.title = "Task title is required.";
  } else if (title.length < 3) {
    errors.title = "Use at least 3 characters.";
  } else if (title.length > 120) {
    errors.title = "Keep the title under 120 characters.";
  }

  if (!description) {
    errors.description = "Description is required.";
  } else if (description.length > 1000) {
    errors.description = "Keep the description under 1000 characters.";
  }

  if (!values.dueDate) {
    errors.dueDate = "Pick a due date.";
  }

  return errors;
}

export default function CreateTaskModal({
  open,
  onClose,
  task,
}: CreateTaskModalProps) {
  const { team, createTask, updateTask } = useDemoStore();

  const [values, setValues] = useState<FormValues>(() => ({
    title: task?.title ?? "",
    description: task?.description ?? "",
    assigneeId: task?.assigneeId ?? CURRENT_USER_ID,
    priority: task?.priority ?? "medium",
    dueDate: task?.dueDate ?? dayOffset(3),
    status: task?.status ?? "todo",
  }));
  const [errors, setErrors] = useState<FormErrors>({});

  function update<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
    // Clear the field's error as soon as the user touches it.
    setErrors((current) => {
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    const input: CreateTaskInput = {
      title: values.title.trim(),
      description: values.description.trim(),
      assigneeId: values.assigneeId,
      priority: values.priority,
      dueDate: values.dueDate,
      status: values.status,
    };

    if (task) {
      updateTask(task.id, input);
    } else {
      createTask(input);
    }

    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={task ? "Edit task" : "Create task"}
      description={
        task
          ? "Update the details of this task."
          : "Add a new task to the workspace demo data."
      }
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="task-form">
            {task ? "Save Changes" : "Create Task"}
          </Button>
        </>
      }
    >
      <form
        id="task-form"
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-col gap-4"
      >
        <FormField
          id="task-title"
          label="Task title"
          required
          error={errors.title}
        >
          <input
            id="task-title"
            type="text"
            value={values.title}
            aria-invalid={Boolean(errors.title)}
            aria-describedby={errors.title ? fieldErrorId("task-title") : undefined}
            onChange={(event) => update("title", event.target.value)}
            placeholder="e.g. Finalise onboarding screens"
            className="h-10 w-full rounded-lg border border-line bg-surface px-3 text-sm text-ink transition-colors placeholder:text-muted hover:border-slate-300 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none"
          />
        </FormField>

        <FormField
          id="task-description"
          label="Description"
          required
          error={errors.description}
          hint="What needs to be done, and what does done look like?"
        >
          <textarea
            id="task-description"
            rows={3}
            value={values.description}
            aria-invalid={Boolean(errors.description)}
            aria-describedby={
              errors.description
                ? fieldErrorId("task-description")
                : fieldHintId("task-description")
            }
            onChange={(event) => update("description", event.target.value)}
            placeholder="Describe the task…"
            className="w-full resize-y rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink transition-colors placeholder:text-muted hover:border-slate-300 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none"
          />
        </FormField>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField id="task-assignee" label="Assign to">
            <Select
              id="task-assignee"
              value={values.assigneeId}
              onChange={(value) => update("assigneeId", value)}
              className="w-full"
              options={team.map((member) => ({
                value: member.id,
                label: `${member.name} — ${member.role}`,
              }))}
            />
          </FormField>

          <FormField id="task-priority" label="Priority">
            <Select
              id="task-priority"
              value={values.priority}
              onChange={(value) => update("priority", value)}
              className="w-full"
              options={(Object.keys(PRIORITY_LABELS) as TaskPriority[]).map(
                (value) => ({ value, label: PRIORITY_LABELS[value] }),
              )}
            />
          </FormField>

          <FormField
            id="task-due-date"
            label="Due date"
            required
            error={errors.dueDate}
          >
            <input
              id="task-due-date"
              type="date"
              value={values.dueDate}
              aria-invalid={Boolean(errors.dueDate)}
              aria-describedby={
                errors.dueDate ? fieldErrorId("task-due-date") : undefined
              }
              onChange={(event) => update("dueDate", event.target.value)}
              className="h-10 w-full rounded-lg border border-line bg-surface px-3 text-sm text-ink transition-colors hover:border-slate-300 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none"
            />
          </FormField>

          <FormField id="task-status" label="Status">
            <Select
              id="task-status"
              value={values.status}
              onChange={(value) => update("status", value)}
              className="w-full"
              options={(Object.keys(STATUS_LABELS) as TaskStatus[]).map(
                (value) => ({ value, label: STATUS_LABELS[value] }),
              )}
            />
          </FormField>
        </div>
      </form>
    </Modal>
  );
}
