import React, { useState, useRef, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";

type Option = {
  color?: any,
  className?: any,
  id: any,
  [x: string]: any
}

interface OptionDropdownProps {
  isLoading?: boolean;
  position?: 'absolute' | 'fixed';
  isCreate?: boolean;
  isSearch?: boolean;
  type?: 'text' | 'number'|any;
  searchText?: string;
  maxlength?: number | null;
  minlength?: number | null;
  disabled?: boolean;
  options?: Option[];
  className?: string;
  menuClassName?: string;
  placeholder?: string;
  value?: string|any[]|null;
  displayValue?: string;
  valueType?: 'string' | 'object';
  content?: any,
  title?: any,
  titleRef?: any,
  openClass?: string,
  closeClass?: string,
  showUnselect?: boolean,
  multiselect?: boolean,
  onChange?: (value: any) => void;
}

const isNumber = (e: any) => {
  const key = e.target;
  const maxlength = key.maxLength ? key.maxLength : 0;

  const max = Number(key.max ? key.max : key.value);
  if (Number(key.value) > max) key.value = max;

  // let min = key.min;
  // if (min && Number(key.value)<Number(min)) key.value = min;


  if (maxlength > 0) {
    if (key.value.length > maxlength) key.value = key.value.slice(0, maxlength);
  }

  key.value = key.value.replace(/[^0-9.]/g, "").replace(/(\..*?)\..*/g, "$1");

  return key.value;
};

const OptionDropdown: React.FC<OptionDropdownProps> = ({
  isLoading = false,
  position = 'absolute',
  isCreate = false,
  type = 'text',
  searchText = 'Search',
  maxlength = null,
  minlength = null,
  disabled = false,
  options = [],
  className = '',
  menuClassName = '',
  placeholder = 'Select',
  value,
  displayValue = 'name',
  valueType = 'string',
  content,
  title,
  titleRef,
  openClass = 'opened',
  closeClass = 'closed',
  isSearch = true,
  showUnselect = true,
  multiselect = false,
  onChange = (_) => { }
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const buttonRef1 = useRef<any>(null);
  const buttonRef = titleRef ? titleRef : buttonRef1;

  const dropdownRef = useRef<HTMLDivElement>(null);

  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const scrollX = position === 'fixed' ? (window.screenX || window.screenLeft) : window.scrollX;
      const scrollY = position === 'fixed' ? (window.screenY || window.screenTop) : window.scrollY;
      const rect = buttonRef.current.getBoundingClientRect();

      let left = rect.left + scrollX;
      let top = rect.bottom + scrollY;
      if (position === 'fixed') {
        left = rect.left;
        top = rect.bottom;
      }

      setSearch('');
      setDropdownStyle({
        position: position,
        top: `${top}px`,
        left: `${left}px`,
        minWidth: `${rect.width}px`,
        zIndex: 9999,
        background: "white",
      });
    }
  }, [isOpen, position]);

 const handleChange = (id: string) => {
  let v: any = id;

  if (multiselect) {
    // Create a new array instead of mutating the existing value
    const arr = Array.isArray(value) ? [...value] : [];

    // Avoid duplicates
    if (!arr.includes(id)) {
      arr.push(id);
    } else {
      // toggle selection (remove if already selected)
      arr.splice(arr.indexOf(id), 1);
    }

    if (valueType === "object") {
      v = arr
        .map((a: any) => options.find((itm) => itm.id === a))
        .filter(Boolean); // remove undefined entries
    } else {
      v = arr;
    }
  } else {
    if (valueType === "object") {
      v = options.find((itm) => itm.id === id);
    }
  }

  if(!id){
    v=multiselect?[]:''
  }
  setIsOpen(false);
  onChange(v);
};


  const selected: any = useMemo(() => {
    if (multiselect) {
      // When multiple selections are allowed
      return Array.isArray(value)
        ? value
          .map((p: any) => options.find((itm) => itm.id === p))
          .filter(Boolean) // remove undefined if any id not found
        : [];
    }

    // For single select
    const found = options.find((itm) => itm.id === value);
    if (found) {
      return {
        color: '',
        className: '',
        ...found,
      };
    }

    // Default fallback
    return {
      color: '',
      className: '',
      id: value,
      [displayValue]: value || placeholder || 'Select',
    };
  }, [multiselect, placeholder, options, displayValue, value]);

  const list = useMemo(() => {
    let arr = [...options];
    arr = arr.filter(itm =>
      itm[displayValue]?.toString()?.toLowerCase()?.includes(search?.toLowerCase().trim())
    );
    if(multiselect){
      arr=arr.filter((itm:any)=>!value?.includes(itm.id))
    }
    return arr;
  }, [options, search, displayValue,multiselect,value]);

  const createClick = () => {
    if (valueType === "object") {
      onChange({
        id: search,
        [displayValue]: search
      });
    } else {
      onChange(search);
    }
    setIsOpen(false);
  };

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = '';
    if (type === 'number') {
      v = isNumber(e.target.value);
    } else {
      v = e.target.value;
    }
    setSearch(v);
  };

  return (
    <>

      {title ? <>
        <div
          ref={buttonRef}
          onClick={() => !disabled ? setIsOpen((prev) => !prev) : {}}
          className={`${className} ${isOpen ? openClass : closeClass}`}
          aria-expanded={isOpen ? 'true' : 'false'}
        >
          {title}
        </div>
      </> : <>
        {multiselect ? <>
          <div
            ref={buttonRef}
            aria-expanded={isOpen ? 'true' : 'false'}
            onClick={() => !disabled ? setIsOpen((prev) => !prev) : {}}
            className={`relative ${disabled ? 'bg-gray-200' : ''} p-1 min-h-10 cursor-pointer border border-[#e5e7eb] px-4 shadow-box bg-white text-[#333] rounded-lg flex items-center text-left text-sm gap-2 z-9 overflow-hidden px-2 ${className} ${isOpen ? openClass : closeClass}`}
          >
            <div className="flex gap-1 flex-wrap w-full items-center">
              {isLoading ? 'Loading...' :selected?.length?selected?.map((item: any, i: number) => {
                return <div
                  key={i}
                  style={{
                    backgroundColor: item.color
                  }}
                  className={`truncate flex gap-1 border-r border-[#cccccc] text-[12px] rounded  p-1 ${item.color?'text-white':''}`}>
                  {item[displayValue]}
                  <span className="material-symbols-outlined inline-block !text-[15px] text-red-500"
                  onClick={e=>{
                    e.stopPropagation()
                    handleChange(item.id)
                  }}
                  >close</span>
                </div>
              }):(placeholder||'Select')}
            </div>
            <span className="material-symbols-outlined text-[20px] font-medium text-[#ccc]">arrow_drop_down</span>
          </div>
        </> : <div
          ref={buttonRef}
          aria-expanded={isOpen ? 'true' : 'false'}
          onClick={() => !disabled ? setIsOpen((prev) => !prev) : {}}
          title={selected[displayValue]}
          className={`relative ${disabled ? 'bg-gray-200' : ''} cursor-pointer border border-[#e5e7eb] px-4 shadow-box bg-white text-[#333] rounded-lg h-10 flex items-center text-left text-sm gap-2 z-9 overflow-hidden px-2 ${className} ${isOpen ? openClass : closeClass}`}
        >
          <div
            style={{
              color: selected.color
            }}
            className={`truncate w-full border-r border-[#cccccc] pr-3 ${selected.color ? `text-[${selected.color}]` : ''} ${selected.className || ''}`}>
            {isLoading ? 'Loading...' : selected[displayValue]}
          </div>
          <span className="material-symbols-outlined text-[20px] font-medium text-[#ccc]">arrow_drop_down</span>
        </div>}

      </>}

      {isOpen &&
        createPortal(
          <div ref={dropdownRef}>
            <div className="fixed w-full h-full z-[9999] top-0 left-0" onClick={() => setIsOpen(false)}></div>
            <div style={dropdownStyle} className={`rounded-[5px] border-2 mt-2 border-primary shadow ${menuClassName || ''}`}>
              {content ? <>
                {content}
              </> : <>
                {isSearch ? <>
                  <div className="p-[4px] relative">
                    <input
                      type={type}
                      maxLength={maxlength || undefined}
                      minLength={minlength || undefined}
                      className="w-full border px-[10px] py-[4px] rounded"
                      placeholder={searchText}
                      value={search}
                      onChange={onSearch}
                    />
                    {search ? (
                      <span
                        className="material-symbols-outlined cursor-pointer absolute top-[12px] text-[14px] right-[7px]"
                        onClick={() => setSearch('')}
                      >
                        close
                      </span>
                    ) : null}
                  </div>
                </> : <></>}

                <div className="overflow-auto max-h-[180px] text-[14px]">
                  {isLoading ? (
                    <div className="px-[12px] py-[8px] text-center">Loading...</div>
                  ) : (
                    <>
                      {isCreate && search ? (
                        <div
                          onClick={createClick}
                          className="px-[12px] py-[8px] border-b cursor-pointer"
                        >
                          {`Click here to add "${search}"`}
                        </div>
                      ) : null}
                      {showUnselect ? <>
                        <div
                          onClick={() => handleChange('')}
                          className={`px-[12px] py-[8px] border-b cursor-pointer ${!value ? 'bg-primary text-white' : ''}`}
                        >
                          Unselect
                        </div>
                      </> : <></>}
                      {list.map((option) => (
                        <div
                          key={option.id}
                          onClick={() => handleChange(option.id)}
                          style={{
                            color: option.color
                          }}
                          className={`px-[12px] py-[8px] border-b cursor-pointer ${value === option.id ? 'bg-primary text-white' : ''} ${option.color ? `text-[${option.color}]` : ''} ${option.className || ''}`}
                        >
                          {option[displayValue]}
                        </div>
                      ))}
                      {!list.length ? (
                        <div className="px-[12px] py-[8px] text-center text-gray-600">No Options</div>
                      ) : null}
                    </>
                  )}
                </div>
              </>}

            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export default OptionDropdown;