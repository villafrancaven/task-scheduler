export type TaskStatus = 'pending' | 'completed' | 'skipped';

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: Date | null;
  status: TaskStatus;
  parentId?: string | null;
  recurrenceCron?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
