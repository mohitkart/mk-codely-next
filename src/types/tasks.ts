// types.ts


export const taskStatus = [
  { name: 'Hold', id: 'Hold' },
  { name: 'In Progress', id: 'In Progress', className: 'text-yellow-500' },
  { name: 'Done', id: 'Done', className: 'text-green-500' },
  { name: 'Api Dependancy', id: 'Api Dependancy', className: 'text-blue-500' },
  { name: 'Client Dependancy', id: 'Client Dependancy' },
]

// Define the status list as a constant tuple
const STATUSES = [...taskStatus.map((itm: any) => itm.id)] as const;

// Infer a union type from the array
export type TaskStatus = typeof STATUSES[number];

export interface Subtask {
  id?: any;
  name: any;
  description?: string;
  status?: TaskStatus;
  time?: string;
  category?: string;
  date?: string;
  endDate?: string;
  image?: any;
  parent?: string;
  subtasks?: Task[];
}

export interface Task {
  id?: any;
  name?: string;
  addedBy?:any;
  description?: string;
  longDescription?: string;
  status: TaskStatus;
  time?: string;
  category?: string;
  categoryDetail?:any;
  date?: string;
  endDate?: string;
  image?: any;
  parent?: string;
  createdAt?:string;
  subtasks?: Task[];
}

export interface TaskFilters {
  search?: any;
  category?: any;
  startDate?: any;
  endDate?: any;
  status?: any;
}

