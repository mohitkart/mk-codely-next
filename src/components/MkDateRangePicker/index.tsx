import React, { useEffect, useMemo, useRef, useState } from "react";
import { DateRange } from 'react-date-range';
import type { Range } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import "./style.css";
import { getCompareRange, getRange, rangeList as rangeL } from "./daterange.shared";
import OptionDropdown from "../OptionDropdown";
import datepipeModel from "@/utils/datepipemodel";

interface RangeItem {
  id: string;
  name: string;
}

interface DateRangeValue {
  range?: string;
  startDate?: string;
  endDate?: string;
  compareStart?: string;
  compareEnd?: string;
  compare?: string;
}

interface MkDateRangePickerProps {
  value: DateRangeValue;
  onChange: (value: DateRangeValue) => void;
  isLast30?: boolean;
  disabled?: boolean;
  placeholder?: string;
  isCompare?: boolean;
  rangeOutside?: boolean;
  ranges?: RangeItem[];
  hideRange?:boolean;
  showPrevNext?:boolean;
}

interface UserState {
  companyDateFormat: string;
}

interface AppState {
  user: UserState;
}

const MkDateRangePicker: React.FC<MkDateRangePickerProps> = ({
  value,
  onChange,
  isLast30 = false,
  disabled = false,
  placeholder = '',
  isCompare = false,
  rangeOutside = false,
  ranges,
  hideRange=false,
  showPrevNext=false
}) => {
  const rangeValue: DateRangeValue = {
    range: value.range || '',
    startDate: value.startDate || '',
    endDate: value.endDate || '',
    compareStart: value.compareStart || '',
    compareEnd: value.compareEnd || '',
    compare: value.compare || '',
  }

  const range:any=rangeValue.range

  const menuButtonRef = useRef<any>(null);
  const rangeList = useMemo(() => {
    return [
      ...(isLast30 ? [{ id: 'Last 30 Days', name: "Last 30 Days" }] : []),
      ...(ranges || rangeL)
    ] as RangeItem[];
  }, [ranges, isLast30]);

  const blockDateChange = (e: Range) => {
    if (!e.startDate || !e.endDate) return;

    const payload: DateRangeValue = {
      ...rangeValue,
      compare: '',
      range: '',
      startDate: datepipeModel.datetostring(e.startDate),
      endDate: datepipeModel.datetostring(e.endDate),
    };

    onChange(payload);
    if (payload.startDate !== payload.endDate && menuButtonRef.current) {
      menuButtonRef.current.click();
    }
  };

  const getBlockValue = (): Range[] => {
    const v: any = {
      startDate: rangeValue.startDate ? datepipeModel.stringToDate(rangeValue.startDate) : new Date(),
      endDate: rangeValue.endDate ? datepipeModel.stringToDate(rangeValue.endDate) : new Date(),
      key: 'selection'
    };
    return [v];
  };

  const rangeClick = (e: string) => {
    const range = getRange(e);
    const startDate = range.startDate;
    const endDate = range.endDate;
    const payload: DateRangeValue = {
      ...rangeValue,
      startDate,
      endDate,
      compare: '',
      range: e
    };
    onChange(payload);

    if (menuButtonRef.current?.getAttribute('aria-expanded') === 'true') {
      menuButtonRef.current.click();
    }
  };

  const previousYear = () => {
    const range = getCompareRange('Previous Year', rangeValue);
    return { start: range.compareStart, end: range.compareEnd };
  };

  const previousPeriod = () => {
    const range = getCompareRange('Previous Period', rangeValue);
    return { start: range.compareStart, end: range.compareEnd };
  };

  const previousMonth = () => {
    const range = getCompareRange('Previous Month', rangeValue);
    return { start: range.compareStart, end: range.compareEnd };
  };

  const compareChange = (e: string) => {
    const range = getCompareRange(e, rangeValue);
    const v: DateRangeValue = {
      ...rangeValue,
      compareStart: range.compareStart,
      compareEnd: range.compareEnd,
      compare: e
    };
    onChange(v);

    if (menuButtonRef.current?.getAttribute('aria-expanded') === 'true') {
      menuButtonRef.current.click();
    }
  };

  const okClick = () => {
    onChange(rangeValue);
    if (menuButtonRef.current) {
      menuButtonRef.current.click();
    }
  };

  const compareList = [
    {
      name: `Previous Month (${datepipeModel.date(previousMonth().start)} - ${datepipeModel.date(previousMonth().end)})`,
      id: 'Previous Month'
    },
    {
      name: `Previous Year(Same Date) (${datepipeModel.date(previousYear().start)} - ${datepipeModel.date(previousYear().end)})`,
      id: 'Previous Year'
    },
    {
      name: ` Previous Period(Custom Dates) (${datepipeModel.date(previousPeriod().start)} - ${datepipeModel.date(previousPeriod().end)})`,
      id: 'Previous Period'
    },
  ]

  const prevClick = () => {
    let date = rangeValue.startDate
    if (date) {
      let d = new Date(date)
      d.setDate(d.getDate() - 1)
      date = datepipeModel.datetostring(d)
    } else {
      date = getRange('Today').startDate
    }
    onChange({ startDate: date, endDate: date })
  }

  const nextClick=()=>{
 let date = rangeValue.startDate
    if (date) {
      let d = new Date(date)
      d.setDate(d.getDate() + 1)
      date = datepipeModel.datetostring(d)
    } else {
      date = getRange('Today').startDate
    }
    onChange({ startDate: date, endDate: date })
  }

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
        {showPrevNext?<>
         <span 
        className="material-symbols-outlined cursor-pointer text-[15px] inline-block hover:text-blue-500"
        onClick={()=>prevClick()}
        >arrow_back</span>
        </>:<></>}
       
        <OptionDropdown
          title={<h2 className="text-[14px] font-semibold text-gray-800 md:mb-0 gap-2 cursor-pointer flex items-center">
            <span>
              {!rangeValue?.startDate || !rangeValue?.endDate ? (
                <>{placeholder || 'Start Date - End Date'}</>
              ) : (
                <>
                  {datepipeModel.date(rangeValue?.startDate)} -
                  {datepipeModel.date(rangeValue?.endDate)}
                </>
              )}
            </span>
            <span className="material-symbols-outlined text-[15px]">keyboard_arrow_down</span>
          </h2>}
          titleRef={menuButtonRef}
          content={<>
            <div>
              {!rangeOutside && !hideRange && (
                <div className="flex flex-wrap gap-2">
                  {rangeList.map((item, i) => {
                    return <button key={i}
                      type="button"
                      onClick={() => rangeClick(item.id)}
                      className={`filter-btn px-3 py-1 ${range === item.id ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700'} rounded-full text-sm`}>{item.name}</button>
                  })}
                </div>
              )}

              <div className="w-full customcalender">
                <DateRange
                  editableDateInputs={true}
                  onChange={(item: any) => blockDateChange(item.selection)}
                  moveRangeOnFirstSelection={false}
                  ranges={getBlockValue()}
                />
              </div>

              <div className="flex justify-end gap-3 px-2 pb-3 items-center">
                <span className="text-blue-500 cursor-pointer text-[13px] hover:underline" onClick={()=>rangeClick('Today')}>Today</span>
                <button
                  type="button"
                  onClick={okClick}
                  className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-sm text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Ok
                </button>
              </div>
            </div>
          </>}
        />
        {showPrevNext?<>
         <span 
        className="material-symbols-outlined cursor-pointer text-[15px] inline-block hover:text-blue-500"
        onClick={()=>nextClick()}
        >arrow_forward</span>
        </>:<></>}

        {rangeOutside ? <>
          <div className="flex flex-wrap gap-2">
            {rangeList.map((item, i) => {
              return <button key={i}
                type="button"
                onClick={() => rangeClick(item.id)}
                className={`filter-btn px-3 py-1 ${range === item.id ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700'} rounded-full text-sm`}>{item.name}</button>
            })}
          </div>
        </> : <></>}
        {isCompare && (<>
          <div className="w-[180px]">
            <OptionDropdown
              placeholder="Compare"
              className="w-full"
              options={compareList}
              value={rangeValue.compare}
              isSearch={false}
              onChange={e => {
                compareChange(e)
              }}
            />
          </div>

        </>

        )}
      </div>


    </>

  );
};

export default MkDateRangePicker;

export {
  getRange,
  getCompareRange,
  rangeL
}