import { useState } from 'react';

function Calendar({ employee, mode, selectedDate, onDateSelect, minDate, maxDate }) {
    const [currentDate, setCurrentDate] = useState(new Date());

    // Get days in month
    const getDaysInMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    // Get first day of month (0 = Sunday, 1 = Monday, etc.)
    const getFirstDayOfMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    };

    const handleDateClick = (day) => {
        const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        
        // Validate date range
        if (minDate && clickedDate < minDate) return;
        if (maxDate && clickedDate > maxDate) return;
        
        onDateSelect(clickedDate);
    };

    const isDateDisabled = (date) => {
        if (minDate && date < minDate) return true;
        if (maxDate && date > maxDate) return true;
        return false;
    };

    // Generate calendar grid
    const generateCalendarDays = () => {
        const daysInMonth = getDaysInMonth(currentDate);
        const firstDay = getFirstDayOfMonth(currentDate);
        const days = [];

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
        }

        // Add cells for each day of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            const isSelected = selectedDate && 
                date.getDate() === selectedDate.getDate() &&
                date.getMonth() === selectedDate.getMonth() &&
                date.getFullYear() === selectedDate.getFullYear();
            
            const isDisabled = isDateDisabled(date);

            days.push(
                <div 
                    key={day} 
                    className={`calendar-day ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}
                    onClick={() => !isDisabled && handleDateClick(day)}
                >
                    {day}
                </div>
            );
        }

        return days;
    };

    return (
        <div className="calendar">
            <div className="calendar-header">
                <h3>{mode === 'start' ? 'Start Date' : 'End Date'}</h3>
                <div className="calendar-nav">
                    <button onClick={handlePrevMonth}>&lt;</button>
                    <h4>{months[currentDate.getMonth()]} {currentDate.getFullYear()}</h4>
                    <button onClick={handleNextMonth}>&gt;</button>
                </div>
            </div>
            <div className="calendar-days">
                {days.map(day => (
                    <div key={day} className="calendar-weekday">{day}</div>
                ))}
            </div>
            <div className="calendar-grid">
                {generateCalendarDays()}
            </div>
            {selectedDate && (
                <div className="selected-date-info">
                    <p>Selected: {selectedDate.toLocaleDateString()}</p>
                </div>
            )}
        </div>
    );
}

export default Calendar;