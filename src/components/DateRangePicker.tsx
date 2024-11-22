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
  const [selectedData, setSelectedData] = useState<{
    range: DateRange;
    weekends: string[];
  } | null>(null);

  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const handleDateClick = (date: Date) => {
    if (isWeekend(date)) return;

    const [start, end] = selectedRange;
    if (!start) {
      setSelectedRange([formatDate(date), null]);
    } else if (!end) {
      const newRange: DateRange = [start, formatDate(date)];
      setSelectedRange(newRange);
      const weekendsInRange = getWeekendDatesInRange(new Date(start), date);
      const newData = {
        range: newRange,
        weekends: weekendsInRange.map(formatDate),
      };
      setSelectedData(newData); // Update JSON preview
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

  const handleYearChange = (step: number) => {
    setCurrentYear((prevYear) => prevYear + step);
  };

  const handleGoToStartDate = () => {
    if (selectedRange[0]) {
      const startDate = new Date(selectedRange[0]);
      setCurrentMonth(startDate.getMonth());
      setCurrentYear(startDate.getFullYear());
    } else {
      const startDate = new Date();
      setCurrentMonth(startDate.getMonth());
      setCurrentYear(startDate.getFullYear());
    }
  };

  const handleClearSelection = () => {
    setSelectedRange([null, null]);
    setSelectedData(null);
  };

  const getCalendarDays = (
    year: number,
    month: number
  ): { date: Date; isCurrentMonth: boolean }[] => {
    const days = getMonthDays(year, month);
    const firstDayOfWeek = days[0].getDay();
    const lastDayOfWeek = days[days.length - 1].getDay();

    const previousMonth = month === 0 ? 11 : month - 1;
    const previousMonthYear = month === 0 ? year - 1 : year;
    const previousMonthDays = getMonthDays(previousMonthYear, previousMonth);
    const leadingDays = previousMonthDays
      .slice(previousMonthDays.length - firstDayOfWeek)
      .map((date) => ({
        date,
        isCurrentMonth: false,
      }));

    const nextMonth = month === 11 ? 0 : month + 1;
    const nextMonthYear = month === 11 ? year + 1 : year;
    const trailingDays = getMonthDays(nextMonthYear, nextMonth)
      .slice(0, 6 - lastDayOfWeek)
      .map((date) => ({
        date,
        isCurrentMonth: false,
      }));

    const currentMonthDays = days.map((date) => ({
      date,
      isCurrentMonth: true,
    }));
    return [...leadingDays, ...currentMonthDays, ...trailingDays];
  };

  const days = getCalendarDays(currentYear, currentMonth);

  return (
    <div className="w-full flex mt-8 items-start justify-center space-x-8">
      <div className="p-4 max-w-sm w-full border rounded-lg shadow-lg bg-white">
        <header className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <button
              onClick={() => handleYearChange(-1)}
              className="p-2 rounded-full hover:bg-gray-200 text-gray-700"
              aria-label="Previous Year"
            >
              <FaArrowLeft />
            </button>
            <h2 className="text-lg font-semibold mx-2 text-gray-700">
              {currentYear}
            </h2>
            <button
              onClick={() => handleYearChange(1)}
              className="p-2 rounded-full hover:bg-gray-200 text-gray-700"
              aria-label="Next Year"
            >
              <FaArrowRight />
            </button>
          </div>
          <button
            onClick={() => handleMonthChange(-1)}
            className="p-2 rounded-full hover:bg-gray-200 text-gray-700"
            aria-label="Previous Month"
          >
            <FaArrowLeft />
          </button>
          <h2 className="text-lg font-semibold text-gray-700">
            {new Date(currentYear, currentMonth).toLocaleDateString("en-US", {
              month: "long",
            })}
          </h2>
          <button
            onClick={() => handleMonthChange(1)}
            className="p-2 rounded-full hover:bg-gray-200 text-gray-700"
            aria-label="Next Month"
          >
            <FaArrowRight />
          </button>
        </header>

        {/* Weekday Names */}
        <div className="grid grid-cols-7 gap-1 text-center font-semibold text-gray-700 mb-2">
          {weekdays.map((day) => (
            <div key={day} aria-label={day}>
              {day.slice(0, 3)}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 text-center">
          {days.map(({ date, isCurrentMonth }, index) => (
            <div
              key={index}
              className={`py-2 rounded-lg border ${
                isCurrentMonth ? "cursor-pointer" : "cursor-default"
              } ${
                isWeekend(date) && isCurrentMonth
                  ? "bg-red-200 text-gray-500 cursor-not-allowed"
                  : isCurrentMonth
                  ? "hover:bg-gray-200"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              } ${
                isCurrentMonth && selectedRange[0] === formatDate(date)
                  ? "bg-green-500 text-white"
                  : isCurrentMonth && selectedRange[1] === formatDate(date)
                  ? "bg-blue-500 text-white"
                  : isCurrentMonth &&
                    selectedRange[0] &&
                    selectedRange[1] &&
                    new Date(selectedRange[0]) <= date &&
                    new Date(selectedRange[1]) >= date
                  ? "bg-blue-300 text-white"
                  : ""
              }`}
              onClick={() => isCurrentMonth && handleDateClick(date)}
              aria-label={`${
                isWeekend(date) ? "Weekend" : "Weekday"
              }: ${date.toDateString()} ${isCurrentMonth ? "" : "(Disabled)"}`}
            >
              {date.getDate()}
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-between items-center">
          <button
            onClick={handleGoToStartDate}
            className="px-4 py-2 bg-blue-500 text-white font-medium text-sm rounded-lg hover:bg-blue-400"
          >
            Go to {selectedRange[0] ? "Start Date" : "Today"}
          </button>

          <button
            onClick={handleClearSelection}
            disabled={!selectedRange[0]}
            className="px-4 py-2 bg-red-400 text-white font-medium text-sm rounded-lg hover:bg-red-300 disabled:bg-red-200"
          >
            Clear Selection
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

      <div className="max-w-[284px] w-full">
        <h3 className="text-lg font-semibold mb-2">Output:</h3>
        <pre className="bg-gray-100 p-4 rounded text-sm text-gray-800">
          {selectedData ? formatJson(selectedData) : "No data selected"}
        </pre>
      </div>
    </div>
  );
};

export default DateRangePicker;

const formatJson = (obj: any): JSX.Element[] => {
  const renderObject = (obj: any, indent = 0): JSX.Element[] => {
    const result: JSX.Element[] = [];
    if (typeof obj === "object" && obj !== null) {
      result.push(
        <span key={`opening-${indent}`} style={{ color: "gray" }}>
          {"{"}
        </span>
      );

      for (const key in obj) {
        const value = obj[key];
        result.push(
          <div key={`${key}-${indent}`} style={{ paddingLeft: indent + 20 }}>
            <span style={{ color: "purple" }}>"{key}"</span>:{" "}
            {typeof value === "object" && value !== null ? (
              renderObject(value, indent + 2)
            ) : (
              <span
                style={{
                  color: typeof value === "number" ? "orange" : "green",
                }}
              >
                {JSON.stringify(value)}
              </span>
            )}
          </div>
        );
      }

      result.push(
        <span key={`closing-${indent}`} style={{ color: "gray" }}>
          {"}"}
        </span>
      );
    }

    return result;
  };

  return renderObject(obj);
};
