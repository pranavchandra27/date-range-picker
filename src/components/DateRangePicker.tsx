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

  const getCalendarDays = (year: number, month: number): (Date | null)[] => {
    const days = getMonthDays(year, month);
    const firstDayOfWeek = days[0].getDay();
    const lastDayOfWeek = days[days.length - 1].getDay();

    const leadingEmptyDays = Array.from({ length: firstDayOfWeek }, () => null);
    const trailingEmptyDays = Array.from(
      { length: 6 - lastDayOfWeek },
      () => null
    );
    return [...leadingEmptyDays, ...days, ...trailingEmptyDays];
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
          {days.map((day, index) => (
            <div
              key={index}
              className={`py-2 rounded-lg border cursor-pointer ${
                day === null
                  ? "bg-transparent cursor-default"
                  : isWeekend(day)
                  ? "bg-red-200 text-gray-500 cursor-not-allowed"
                  : "hover:bg-gray-200"
              } ${
                day && selectedRange[0] === formatDate(day)
                  ? "bg-green-500 text-white"
                  : day && selectedRange[1] === formatDate(day)
                  ? "bg-blue-500 text-white"
                  : day &&
                    selectedRange[0] &&
                    selectedRange[1] &&
                    new Date(selectedRange[0]) <= day &&
                    new Date(selectedRange[1]) >= day
                  ? "bg-blue-300 text-white"
                  : ""
              }`}
              onClick={() => day && handleDateClick(day)}
              aria-label={
                day
                  ? `${
                      isWeekend(day) ? "Weekend" : "Weekday"
                    }: ${day.toDateString()}`
                  : undefined
              }
            >
              {day ? day.getDate() : ""}
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-between items-center">
          <button
            onClick={handleGoToStartDate}
            className={`px-4 py-2 bg-blue-500 text-white font-medium text-sm rounded-lg hover:bg-blue-400`}
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

const formatJson = (obj: any, indent = 0): JSX.Element[] => {
  const result: JSX.Element[] = [];

  const renderValue = (value: any) => {
    if (typeof value === "string") {
      return <span style={{ color: "green" }}>"{value}"</span>;
    } else if (typeof value === "number") {
      return <span style={{ color: "orange" }}>{value}</span>;
    } else if (typeof value === "boolean") {
      return <span style={{ color: "blue" }}>{value.toString()}</span>;
    } else if (value === null) {
      return <span style={{ color: "red" }}>null</span>;
    } else if (typeof value === "object") {
      return <>{renderObject(value, indent + 2)}</>;
    } else {
      return <span>{value}</span>;
    }
  };

  const renderObject = (obj: any, indent: number) => {
    const elements: JSX.Element[] = [];
    elements.push(
      <span key={`opening-${indent}`} style={{ color: "gray" }}>
        {"{"}
      </span>
    );

    Object.keys(obj).forEach((key, index, array) => {
      elements.push(
        <div key={`${key}-${index}`} style={{ paddingLeft: indent }}>
          <span style={{ color: "purple" }}>"{key}"</span>:{" "}
          {renderValue(obj[key])}
          {index < array.length - 1 ? "," : ""}
        </div>
      );
    });

    elements.push(
      <span key={`closing-${indent}`} style={{ color: "gray" }}>
        {"}"}
      </span>
    );

    return elements;
  };

  if (Array.isArray(obj)) {
    result.push(
      <span key={`opening-array-${indent}`} style={{ color: "gray" }}>
        {"["}
      </span>
    );
    obj.forEach((item, index) => {
      result.push(
        <div key={`array-item-${index}`} style={{ paddingLeft: indent }}>
          {renderValue(item)}
          {index < obj.length - 1 ? "," : ""}
        </div>
      );
    });
    result.push(
      <span key={`closing-array-${indent}`} style={{ color: "gray" }}>
        {"]"}
      </span>
    );
  } else {
    result.push(...renderObject(obj, indent));
  }

  return result;
};
