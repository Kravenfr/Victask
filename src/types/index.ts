export const __DUMMY__ = true;

export type User = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
};

export type TaskList = {
  id: string;
  userId: string;
  title: string;
  createdAt: any;
};

export type Task = {
  id: string;
  userId: string;
  listId: string;
  parentId?: string; // For subtasks
  title: string;
  description: string;
  completed: boolean;
  starred: boolean; // For starred tasks
  dueDate: string | null; // ISO string
  order: number;
  createdAt: any;
};

export type FilterType = 'all' | 'starred';
