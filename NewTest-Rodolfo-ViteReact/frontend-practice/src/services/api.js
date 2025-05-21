const API_BASE_URL = 'http://localhost:3000';

export const getEmployees = async () => {
    const response = await fetch(`${API_BASE_URL}/employee`);
    if (!response.ok) {
        throw new Error('Failed to fetch employees');
    }
    const data = await response.json();
    return data;
};

export const getEmployeeById = async (id) => {
    const response = await fetch(`${API_BASE_URL}/employee/${id}`);
    if (!response.ok) {
        throw new Error('Failed to fetch employee');
    }
    const data = await response.json();
    return data;
};

export const getEmployeeTimeOff = async (id) => {
    const response = await fetch(`${API_BASE_URL}/timeoff`);
    if (!response.ok) {
        throw new Error('Failed to fetch time off requests');
    }
    const data = await response.json();
    return data;
};

export const createEmployeeTimeOff = async (id, timeOff) => {
    const response = await fetch(`${API_BASE_URL}/timeoff`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(timeOff),
    });
    if (!response.ok) {
        throw new Error('Failed to save time off request');
    }
    const data = await response.json();
    return data;
};

export const deleteEmployeeTimeOff = async (id) => {
    const response = await fetch(`${API_BASE_URL}/timeoff/${id}`, {
        method: 'DELETE',
    });
    const data = await response.json();
    return data;
};