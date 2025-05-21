import EmployeeCard from "../components/employeeCard";
import Calendar from "../components/calendar";
import { useState } from 'react';
import { getEmployees, createEmployeeTimeOff } from '../services/api';
import { useEffect } from 'react';

function Home() {
    const [showCalendars, setShowCalendars] = useState(false);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [employees, setEmployees] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    async function handleRequestTimeOff() {
        if (startDate && endDate && employees) {
            try {
                setIsSubmitting(true);
                // Create new time off request
                const newRequest = {
                    employeeId: employees.id,
                    employeeName: `${employees.firstName} ${employees.lastName}`,
                    startDate: startDate.toISOString(),
                    endDate: endDate.toISOString(),
                };

                // Save using the API
                await createEmployeeTimeOff(employees.id, newRequest);

                alert(`Time off request saved!\nEmployee: ${newRequest.employeeName}\nStart Date: ${startDate.toLocaleDateString()}\nEnd Date: ${endDate.toLocaleDateString()}`);
                
                setShowCalendars(false);
                setStartDate(null);
                setEndDate(null);
            } catch (error) {
                alert('Error saving time off request: ' + error.message);
            } finally {
                setIsSubmitting(false);
            }
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
                                    <button 
                                        className="request-timeoff-btn" 
                                        onClick={handleRequestTimeOff}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Submitting...' : 'Submit Request'}
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