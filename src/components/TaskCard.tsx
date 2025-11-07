import React, { useState } from 'react';
import { Calendar, User, AlertCircle, Zap, TrendingUp, Bug } from 'lucide-react';
import { Task } from '../types/board';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  isDragging?: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete, isDragging = false }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'feature': return <Zap className="w-4 h-4" />;
      case 'bug': return <Bug className="w-4 h-4" />;
      case 'improvement': return <TrendingUp className="w-4 h-4" />;
      case 'research': return <AlertCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'feature': return 'text-blue-600 bg-blue-50';
      case 'bug': return 'text-red-600 bg-red-50';
      case 'improvement': return 'text-emerald-600 bg-emerald-50';
      case 'research': return 'text-purple-600 bg-purple-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-3 cursor-grab transition-all duration-200 hover:shadow-md ${
        isDragging ? 'opacity-50 rotate-2 scale-105' : ''
      } ${isHovered ? 'transform translate-y-[-2px]' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onEdit(task)}
    >
      <div className="flex items-start justify-between mb-2">
        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(task.category)}`}>
          {getCategoryIcon(task.category)}
          <span className="ml-1 capitalize">{task.category}</span>
        </div>
        <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`} title={`${task.priority} priority`}></div>
      </div>

      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{task.title}</h3>
      
      {task.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-3">{task.description}</p>
      )}

      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center space-x-2">
          {task.assignee && (
            <div className="flex items-center">
              <User className="w-3 h-3 mr-1" />
              <span>{task.assignee}</span>
            </div>
          )}
          {task.dueDate && (
            <div className="flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              <span>{new Date(task.dueDate).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;