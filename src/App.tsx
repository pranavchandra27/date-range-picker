import React from "react";
import DateRangePicker from "components/DateRangePicker";

const App: React.FC = () => {
  const handleRangeChange = (
    range: [string | null, string | null],
    weekends: string[]
  ) => {
    console.log("Selected Range:", range);
    console.log("Weekend Dates:", weekends);
  };

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <div className="h-[10vh] flex items-center justify-center">
        <h1 className="text-gray-700 font-bold text-xl sm:text-3xl text-center mb-4">
          Date Range Picker
        </h1>
      </div>
      <div className="h-[90vh] flex justify-center">
        <DateRangePicker
          onChange={handleRangeChange}
          predefinedRanges={[
            {
              label: "Last 7 Days",
              start: new Date(new Date().setDate(new Date().getDate() - 7)),
              end: new Date(),
            },
            {
              label: "Last 30 Days",
              start: new Date(new Date().setDate(new Date().getDate() - 30)),
              end: new Date(),
            },
          ]}
        />
      </div>
    </div>
  );
};

export default App;
