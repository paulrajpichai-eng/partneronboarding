import React, { useState } from 'react';
import { Plus, MoreVertical } from 'lucide-react';
import { Column as ColumnType, Task } from '../types/board';
import TaskCard from './TaskCard';

interface ColumnProps {
  column: ColumnType;
  onAddTask: (columnId: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onDrop: (taskId: string, targetColumnId: string) => void;
}

const Column: React.FC<ColumnProps> = ({ column, onAddTask, onEditTask, onDeleteTask, onDrop }) => {
  const [dragOver, setDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const taskId = e.dataTransfer.getData('text/plain');
    onDrop(taskId, column.id);
  };

  const handleTaskDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('text/plain', taskId);
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 min-h-[600px] w-80 flex-shrink-0">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full mr-2`} style={{ backgroundColor: column.color }}></div>
          <h2 className="font-semibold text-gray-900">{column.title}</h2>
          <span className="ml-2 bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
            {column.tasks.length}
          </span>
        </div>
        <button className="p-1 hover:bg-gray-200 rounded transition-colors">
          <MoreVertical className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      <button
        onClick={() => onAddTask(column.id)}
        className="w-full mb-4 p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200 flex items-center justify-center group"
      >
        <Plus className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
        Add new task
      </button>

      <div
        className={`min-h-[400px] ${dragOver ? 'bg-indigo-50 border-2 border-dashed border-indigo-400 rounded-lg' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {column.tasks.map((task) => (
          <div
            key={task.id}
            draggable
            onDragStart={(e) => handleTaskDragStart(e, task.id)}
            className="transition-all duration-200"
          >
            <TaskCard
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Column;