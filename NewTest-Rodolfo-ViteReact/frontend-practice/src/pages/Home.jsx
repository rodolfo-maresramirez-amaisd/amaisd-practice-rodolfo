import EmployeeCard from "../components/employeeCard";
import Calendar from "../components/calendar";
import { useState } from 'react';

function Home() {
    const [foundEmployee, setFoundEmployee] = useState(null);
    const [showCalendars, setShowCalendars] = useState(false);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    function openTimeOff() {
        setShowCalendars(!showCalendars);
        if (!showCalendars) {
            setStartDate(null);
            setEndDate(null);
        }
    }

    function handleRequestTimeOff() {
        if (startDate && endDate) {
            alert(`Time off request submitted!\nStart Date: ${startDate.toLocaleDateString()}\nEnd Date: ${endDate.toLocaleDateString()}`);
            setShowCalendars(false);
            setStartDate(null);
            setEndDate(null);
        }
    }

    return (
        <div className="Home">
            <div className="search-container">
                <EmployeeCard onEmployeeFound={setFoundEmployee} />
            </div>
            {foundEmployee && (
                <>
                    <div className="open-timeoff">
                        <button className="open-timeoff-button" onClick={openTimeOff}>
                            {showCalendars ? 'Hide Calendars' : 'Request Time Off'}
                        </button>
                    </div>
                    {showCalendars && (
                        <div className="calendars-container">
                            <div className="calendars-wrapper">
                                <Calendar 
                                    employee={foundEmployee}
                                    mode="start"
                                    selectedDate={startDate}
                                    onDateSelect={setStartDate}
                                    maxDate={endDate}
                                />
                                <Calendar 
                                    employee={foundEmployee}
                                    mode="end"
                                    selectedDate={endDate}
                                    onDateSelect={setEndDate}
                                    minDate={startDate}
                                />
                            </div>
                            {startDate && endDate && (
                                <div className="request-actions">
                                    <p>Selected Range: {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}</p>
                                    <button className="request-timeoff-btn" onClick={handleRequestTimeOff}>
                                        Submit Request
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default Home;