import { Board } from '../types/board';

export const sampleBoard: Board = {
  id: '1',
  title: 'The Uncoded Project Board',
  description: 'Main project board for tracking development tasks',
  createdAt: new Date().toISOString(),
  columns: [
    {
      id: 'todo',
      title: 'To Do',
      color: '#6B7280',
      tasks: [
        {
          id: '1',
          title: 'Design user authentication flow',
          description: 'Create wireframes and mockups for login, signup, and password reset flows',
          priority: 'high',
          category: 'feature',
          assignee: 'Alex Chen',
          dueDate: '2025-01-15',
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          title: 'Research drag and drop libraries',
          description: 'Compare different libraries for implementing drag and drop functionality',
          priority: 'medium',
          category: 'research',
          assignee: 'Sarah Kim',
          dueDate: '2025-01-12',
          createdAt: new Date().toISOString(),
        }
      ]
    },
    {
      id: 'progress',
      title: 'In Progress',
      color: '#F59E0B',
      tasks: [
        {
          id: '3',
          title: 'Implement task creation modal',
          description: 'Build the modal component with form validation and proper error handling',
          priority: 'high',
          category: 'feature',
          assignee: 'Mike Rodriguez',
          dueDate: '2025-01-10',
          createdAt: new Date().toISOString(),
        }
      ]
    },
    {
      id: 'review',
      title: 'In Review',
      color: '#8B5CF6',
      tasks: [
        {
          id: '4',
          title: 'Fix column drag performance issue',
          description: 'Optimize drag and drop performance for large number of tasks',
          priority: 'medium',
          category: 'bug',
          assignee: 'Emma Wilson',
          createdAt: new Date().toISOString(),
        }
      ]
    },
    {
      id: 'done',
      title: 'Done',
      color: '#10B981',
      tasks: [
        {
          id: '5',
          title: 'Setup project structure',
          description: 'Initialize React project with TypeScript and Tailwind CSS',
          priority: 'high',
          category: 'feature',
          assignee: 'David Lee',
          createdAt: new Date().toISOString(),
        },
        {
          id: '6',
          title: 'Create responsive layout',
          description: 'Implement responsive design that works on mobile, tablet, and desktop',
          priority: 'medium',
          category: 'improvement',
          assignee: 'Lisa Zhang',
          createdAt: new Date().toISOString(),
        }
      ]
    }
  ]
};