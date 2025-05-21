import EmployeeCard from "../components/employeeCard";
import Calendar from "../components/calendar";
import { useState } from 'react';
import timeOffData from '../data/emp_and_timeoff.json';
import { getEmployees, getEmployeeTimeOff, createEmployeeTimeOff } from '../services/api';
import { useEffect } from 'react';

function Home() {
    const [showCalendars, setShowCalendars] = useState(false);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const [employees, setEmployees] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadEmployees = async () => {
            try {
                const employees = await getEmployees();
                setEmployees(employees);
            } catch (error) {
                console.log('Error loading employees:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        loadEmployees();
    }, []);

    function openTimeOff() {
        setShowCalendars(!showCalendars);
        if (!showCalendars) {
            setStartDate(null);
            setEndDate(null);
        }
    }

    function handleRequestTimeOff() {
        if (startDate && endDate && employees) {
            // Create new time off request
            const newRequest = {
                id: Date.now(),
                employeeId: employees.id,
                employeeName: `${employees.firstName} ${employees.lastName}`,
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
                requestDate: new Date().toISOString()
            };

            // Add to existing requests
            timeOffData.requests.push(newRequest);

            // Save to local storage as a backup
            localStorage.setItem('timeOffRequests', JSON.stringify(timeOffData));

            alert(`Time off request saved!\nEmployee: ${newRequest.employeeName}\nStart Date: ${startDate.toLocaleDateString()}\nEnd Date: ${endDate.toLocaleDateString()}`);
            
            setShowCalendars(false);
            setStartDate(null);
            setEndDate(null);
        }
    }

    return (
        <div className="Home">
                <div className="search-container">
                    <EmployeeCard onEmployeeFound={setEmployees} />
                </div>
            {employees && employees.id && (
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
                                    employee={employees}
                                    mode="start"
                                    selectedDate={startDate}
                                    onDateSelect={setStartDate}
                                    maxDate={endDate}
                                />
                                <Calendar 
                                    employee={employees}
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
            <div className="time-off-history">
                <h3>Time Off History</h3>
                {timeOffData.timeoff.requests
                    .filter(request => employees && request.employeeId === employees.id)
                    .map(request => (
                        <div key={request.id} className="time-off-entry">
                            <p>
                                <strong>Dates:</strong> {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                            </p>
                            <p><small>Requested on: {new Date(request.requestDate).toLocaleDateString()}</small></p>
                        </div>
                    ))
                }
            </div>
        </div>
    );
}

export default Home;