'use client';
import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

function Calendar2({ className, selected, onSelect, disabled, fromDate, toDate, ...props }) {
  const [currentMonth, setCurrentMonth] = React.useState(() => {
    if (selected) return new Date(selected.getFullYear(), selected.getMonth(), 1);
    return new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  });

  // Get days in month
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  // Get first day of week for month (0 = Sunday)
  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  // Check if date is disabled
  const isDateDisabled = (date) => {
    if (typeof disabled === 'function') {
      return disabled(date);
    }
    if (fromDate && date < fromDate) return true;
    if (toDate && date > toDate) return true;
    return false;
  };

  // Check if date is selected
  const isDateSelected = (date) => {
    if (!selected) return false;
    return (
      date.getDate() === selected.getDate() &&
      date.getMonth() === selected.getMonth() &&
      date.getFullYear() === selected.getFullYear()
    );
  };

  // Check if date is today
  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Handle date selection
  const handleDateSelect = (event, date) => {
    event.preventDefault();
    event.stopPropagation();

    if (!isDateDisabled(date) && onSelect) {
      onSelect(date);
    }
  };

  // Navigate months
  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  // Check if navigation should be disabled
  const isPrevDisabled = () => {
    if (!fromDate) return false;
    const prevMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    return prevMonth < new Date(fromDate.getFullYear(), fromDate.getMonth(), 1);
  };

  const isNextDisabled = () => {
    if (!toDate) return false;
    const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
    return nextMonth > new Date(toDate.getFullYear(), toDate.getMonth(), 1);
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDayOfWeek = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      days.push(date);
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  return (
    <div className={cn('p-3', className)} {...props}>
      <div className="space-y-4">
        {/* Header with navigation */}
        <div className="flex justify-center pt-1 relative items-center">
          <Button
            variant="outline"
            className="h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute left-1"
            onClick={goToPreviousMonth}
            disabled={isPrevDisabled()}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="text-sm font-medium">
            {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </div>

          <Button
            variant="outline"
            className="h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute right-1"
            onClick={goToNextMonth}
            disabled={isNextDisabled()}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Calendar grid */}
        <div className="w-full border-collapse space-y-1">
          {/* Day headers */}
          <div className="flex">
            {DAYS.map((day) => (
              <div
                key={day}
                className="text-muted-foreground rounded-md w-8 font-normal text-[0.8rem] text-center"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((date, index) => {
              if (!date) {
                return <div key={index} className="h-8 w-8" />;
              }

              const disabled = isDateDisabled(date);
              const selected = isDateSelected(date);
              const today = isToday(date);

              return (
                <Button
                  key={date.toISOString()}
                  variant="ghost"
                  className={cn(
                    'h-8 w-8 p-0 font-normal',
                    selected &&
                      'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
                    !selected && today && 'bg-accent text-accent-foreground font-semibold',
                    disabled && 'text-muted-foreground opacity-50 cursor-not-allowed',
                    !disabled && !selected && 'hover:bg-accent hover:text-accent-foreground'
                  )}
                  disabled={disabled}
                  onClick={(e) => handleDateSelect(e, date)}
                >
                  {date.getDate()}
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

Calendar2.displayName = 'Calendar2';

export { Calendar2 };
