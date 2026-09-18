import React from 'react';

export const Textarea = React.forwardRef(({ className = '', ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={`flex min-h-[90px] w-full rounded-xl border border-[#EAE0D2] bg-white px-3.5 py-2.5 text-sm sm:text-base text-[#2C1810] placeholder:text-[#A89D91] focus:outline-none focus:border-[#7A1526] focus:ring-2 focus:ring-[#7A1526]/15 disabled:cursor-not-allowed disabled:bg-[#FAF7F2] disabled:opacity-60 transition duration-150 leading-relaxed ${className}`}
      {...props}
    />
  );
});

Textarea.displayName = 'Textarea';
export default Textarea;
