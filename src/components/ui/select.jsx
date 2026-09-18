import React from 'react';
import { ChevronDown } from 'lucide-react';

export const Select = React.forwardRef(({ className = '', containerClassName = '', children, ...props }, ref) => {
  return (
    <div className={`relative w-full ${containerClassName}`}>
      <select
        ref={ref}
        className={`w-full h-11 sm:h-12 pl-3.5 pr-10 text-sm sm:text-base border border-[#EAE0D2] rounded-xl bg-white text-[#2C1810] focus:outline-none focus:border-[#7A1526] focus:ring-2 focus:ring-[#7A1526]/15 disabled:cursor-not-allowed disabled:bg-[#FAF7F2] disabled:opacity-60 transition duration-150 appearance-none cursor-pointer ${className}`}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="w-4 h-4 text-[#7A1526] pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2" />
    </div>
  );
});

Select.displayName = 'Select';
export default Select;
