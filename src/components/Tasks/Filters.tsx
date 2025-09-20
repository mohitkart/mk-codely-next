// components/Filters.tsx
import { taskStatus, type TaskFilters } from '~/types/tasks';
import MkDateRangePicker from '../MkDateRangePicker';

type Props ={
  filters?:TaskFilters;
  onChange?:any;
}

const Filters = ({filters,onChange=(_:any)=>{}}:Props) => {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-3">
      <div className="flex flex-wrap items-center gap-2">
        {/* <div className="border rounded-md p-2 flex items-center text-sm">
          <span className="material-icons mr-2 text-gray-500">calendar_today</span>
          <span>2 Sep 2025 - 2 Sep 2025</span>
        </div> */}
        <div className='flex gap-2 items-center'>
          <MkDateRangePicker
          value={{
            startDate:filters?.startDate,
            endDate:filters?.endDate
          }}
          hideRange
          showPrevNext
          onChange={e=>{
            onChange({ startDate: e.startDate, endDate: e.endDate })
          }}
          />
        </div>
       
        <select 
        value={filters?.status}
        onChange={e=>onChange({status:e.target.value})}
        className="border rounded-md p-2 text-sm focus:ring-1 focus:ring-blue-600 focus:border-blue-600">
          <option value="">All Status</option>
          {taskStatus.map((item)=>{
            return <option key={item.id} value={item.id}>{item.name}</option>
          })}
        </select>
      </div>
      <div className="flex space-x-2">
        <button className="p-2 border rounded-md bg-gray-100 text-gray-700">
          <span className="material-icons">view_list</span>
        </button>
        <button className="p-2 border rounded-md bg-white text-gray-700">
          <span className="material-icons">view_module</span>
        </button>
      </div>
    </div>
  );
};

export default Filters;