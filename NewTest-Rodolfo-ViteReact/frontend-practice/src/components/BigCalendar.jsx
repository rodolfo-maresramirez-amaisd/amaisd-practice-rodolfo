import { useState, useEffect } from 'react';

function BigCalendar() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [timeOffRequests, setTimeOffRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTimeOff = async () => {
            try {
                const response = await fetch('http://localhost:3000/timeoff');
                if (!response.ok) {
                    throw new Error('Failed to fetch time-off data');
                }
                const data = await response.json();
                setTimeOffRequests(data);
                console.log('Fetched time-off requests:', data);
            } catch (error) {
                console.error('Error fetching time-off:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTimeOff();
    }, []);

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const getDaysInMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    };

    const getTimeOffForDate = (date) => {
        return timeOffRequests.filter(request => {
            const startDate = new Date(request.startDate);
            const endDate = new Date(request.endDate);
            const compareDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
            const compareStart = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
            const compareEnd = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
            return compareDate >= compareStart && compareDate <= compareEnd;
        });
    };

    const generateCalendarDays = () => {
        const daysInMonth = getDaysInMonth(currentDate);
        const firstDay = getFirstDayOfMonth(currentDate);
        const days = [];

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="big-calendar-day empty"></div>);
        }

        // Add cells for each day of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            const timeOffForDay = getTimeOffForDate(date);
            const hasTimeOff = timeOffForDay.length > 0;

            days.push(
                <div key={day} className={`big-calendar-day ${hasTimeOff ? 'has-timeoff' : ''}`}>
                    <div className="day-number">{day}</div>
                    {hasTimeOff && (
                        <div className="timeoff-requests">
                            {timeOffForDay.map((request, index) => (
                                <div 
                                    key={index} 
                                    className="timeoff-badge"
                                    title={`${request.employeeName}: ${new Date(request.startDate).toLocaleDateString()} - ${new Date(request.endDate).toLocaleDateString()}`}
                                >
                                    {request.employeeName.split(' ')[0]}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            );
        }

        return days;
    };

    if (loading) {
        return <div className="loading">Loading calendar...</div>;
    }

    return (
        <div className="big-calendar">
            <div className="big-calendar-header">
                <div className="calendar-title">
                    <h2>Time Off Calendar</h2>
                </div>
                <div className="calendar-nav">
                    <button onClick={handlePrevMonth}>&lt;</button>
                    <h3>{months[currentDate.getMonth()]} {currentDate.getFullYear()}</h3>
                    <button onClick={handleNextMonth}>&gt;</button>
                </div>
            </div>
            <div className="big-calendar-weekdays">
                {days.map(day => (
                    <div key={day} className="weekday">{day}</div>
                ))}
            </div>
            <div className="big-calendar-grid">
                {generateCalendarDays()}
            </div>
        </div>
    );
}

export default BigCalendar;

