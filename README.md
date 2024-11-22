# Weekday Date Range Picker Component

This project is a React and TypeScript-based Weekday Date Range Picker that allows users to select a date range restricted to weekdays (Monday through Friday). It excludes weekends (Saturday and Sunday) from being selectable or highlighted.

---

## Features

- Select a date range starting and ending on weekdays only.
- Highlight weekdays within the selected range, excluding weekends.
- Navigate between months and years to pick dates.
- Predefined ranges such as "Last 7 Days" or "Last 30 Days".
- Change handler to return:
  - The selected weekday range.
  - Any weekend dates that fall within the selected range.

---

## Technologies Used

- **React**: For building the user interface.
- **TypeScript**: For type safety and maintainability.
- **Tailwind CSS**: For modern, responsive, and customizable styling.

---

## Installation

1. Clone the repository:

   ```bash
   git clone <your-repository-link>
   cd weekday-date-picker
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the dev server:
   ```bash
   npm start
   ```
