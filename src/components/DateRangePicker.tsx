import React, { useState } from "react";
import { getMonthDays, isWeekend, formatDate } from "utils/dateUtils";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

type DateRange = [string | null, string | null];

interface DateRangePickerProps {
  onChange: (range: DateRange, weekends: string[]) => void;
  predefinedRanges?: { label: string; start: Date; end: Date }[];
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  onChange,
  predefinedRanges = [],
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedRange, setSelectedRange] = useState<DateRange>([null, null]);

  const handleDateClick = (date: Date) => {
    if (isWeekend(date)) return;

    const [start, end] = selectedRange;
    if (!start) {
      setSelectedRange([formatDate(date), null]);
    } else if (!end) {
      const newRange: DateRange = [start, formatDate(date)];
      setSelectedRange(newRange);
      const weekendsInRange = getWeekendDatesInRange(new Date(start), date);
      onChange(newRange, weekendsInRange.map(formatDate));
    } else {
      setSelectedRange([formatDate(date), null]);
    }
  };

  const getWeekendDatesInRange = (start: Date, end: Date): Date[] => {
    const weekends: Date[] = [];
    const date = new Date(start);

    while (date <= end) {
      if (isWeekend(date)) weekends.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }

    return weekends;
  };

  const handleMonthChange = (step: number) => {
    let newMonth = currentMonth + step;
    let newYear = currentYear;

    if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    } else if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    }

    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  const handleGoToStartDate = () => {
    if (selectedRange[0]) {
      const startDate = new Date(selectedRange[0]);
      setCurrentMonth(startDate.getMonth());
      setCurrentYear(startDate.getFullYear());
    }
  };

  const handleClearSelection = () => {
    if (selectedRange[0]) {
      setSelectedRange([null, null]);
    }
  };

  const days = getMonthDays(currentYear, currentMonth);

  return (
    <div className="max-w-sm w-full mx-auto">
      <div className="flex justify-between px-2">
        {selectedRange[0] && (
          <p className="font-medium">
            Start date: <span className="font-mono">{selectedRange[0]}</span>
          </p>
        )}
        {selectedRange[1] && (
          <p className="font-medium">
            End date: <span className="font-mono">{selectedRange[1]}</span>
          </p>
        )}
      </div>
      <div className="p-4 border rounded-lg shadow-lg bg-white">
        <header className="flex justify-between items-center mb-4">
          <button
            onClick={() => handleMonthChange(-1)}
            className="p-2 rounded-full hover:bg-gray-200"
            aria-label="Previous Month"
          >
            <FaArrowLeft />
          </button>
          <h2 className="text-lg font-semibold">
            {new Date(currentYear, currentMonth).toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </h2>
          <button
            onClick={() => handleMonthChange(1)}
            className="p-2 rounded-full hover:bg-gray-200"
            aria-label="Next Month"
          >
            <FaArrowRight />
          </button>
        </header>

        <div className="grid grid-cols-7 gap-1 text-center">
          {days.map((day) => (
            <div
              key={day.toISOString()}
              className={`py-2 rounded-lg border cursor-pointer ${
                isWeekend(day)
                  ? "bg-red-200 text-gray-500 cursor-not-allowed"
                  : "hover:bg-blue-200"
              } ${
                selectedRange[0] === formatDate(day)
                  ? "bg-green-500 text-white"
                  : selectedRange[1] === formatDate(day)
                  ? "bg-blue-500 text-white"
                  : selectedRange[0] &&
                    selectedRange[1] &&
                    new Date(selectedRange[0]) <= day &&
                    new Date(selectedRange[1]) >= day
                  ? "bg-blue-300 text-white"
                  : ""
              }`}
              onClick={() => handleDateClick(day)}
            >
              {day.getDate()}
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-between items-center">
          <button
            onClick={handleGoToStartDate}
            className="px-4 py-2 bg-blue-500 text-white font-medium text-sm rounded-lg hover:bg-blue-400"
          >
            Go to Start Date
          </button>

          <button
            onClick={handleClearSelection}
            className="px-4 py-2 bg-red-400 text-white font-medium text-sm rounded-lg hover:bg-red-300"
          >
            Clear selection
          </button>
        </div>

        <div className="mt-6 space-y-2">
          {predefinedRanges.map(({ label, start, end }) => (
            <button
              key={label}
              onClick={() => {
                const newRange: DateRange = [
                  formatDate(start),
                  formatDate(end),
                ];
                setSelectedRange(newRange);
                const weekendsInRange = getWeekendDatesInRange(start, end);
                onChange(newRange, weekendsInRange.map(formatDate));
              }}
              className="w-full px-4 py-2 bg-gray-100 rounded-lg font-medium text-sm hover:bg-gray-200"
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
export default DateRangePicker;
