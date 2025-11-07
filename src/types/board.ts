export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  category: 'feature' | 'bug' | 'improvement' | 'research';
  assignee?: string;
  dueDate?: string;
  createdAt: string;
}

export interface Column {
  id: string;
  title: string;
  tasks: Task[];
  color: string;
}

export interface Board {
  id: string;
  title: string;
  description: string;
  columns: Column[];
  createdAt: string;
}