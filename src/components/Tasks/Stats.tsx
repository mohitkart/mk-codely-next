// components/Stats.tsx
import React from 'react';
import type { Task } from '@/types/tasks';

interface StatsProps {
  tasks: Task[];
}

const Stats: React.FC<StatsProps> = ({ tasks }) => {
  const totalTasks = tasks.length;
  const inProgressTasks = tasks.filter(task => task.status === 'In Progress').length;
  const completedTasks = tasks.filter(task => task.status === 'Done').length;
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <p className="text-sm text-gray-500">Total Tasks</p>
        <p className="text-2xl font-bold mt-1">{totalTasks}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <p className="text-sm text-gray-500">In Progress</p>
        <p className="text-2xl font-bold mt-1">{inProgressTasks}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <p className="text-sm text-gray-500">Completed</p>
        <p className="text-2xl font-bold mt-1">{completedTasks}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <p className="text-sm text-gray-500">Total Time</p>
        <p className="text-2xl font-bold mt-1">0m</p>
      </div>
    </div>
  );
};

export default Stats;