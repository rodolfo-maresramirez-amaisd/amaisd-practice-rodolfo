import { useState } from 'react';
import employeeData from '../data/employees.json';

function EmployeeCard({ onEmployeeFound }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [found, setFound] = useState(null);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Search through employees when input changes
    const foundEmployee = employeeData.employee.find(emp => 
      emp.id.toString() === value
    );
    
    setFound(foundEmployee);
    onEmployeeFound(foundEmployee);
    if (value === "") {
      setFound(null);
      onEmployeeFound(null);
    }
  };

  return (
    <div className="employee-card">
        <div className="employee-search">
            <label htmlFor="search">Search by ID: </label>
            <input 
              type="text"
              id="search"
              placeholder="Enter ID here" 
              value={searchTerm}
              onChange={handleSearch}
            />
        </div>
        {found ? (
          <div className="employee-content">
            <div className="employee-info">
                <h3>{found.firstName} {found.lastName}</h3>
                <p className="position">{found.position}</p>
                <p className="department">{found.department}</p>
                <p className="email">{found.email}</p>
            </div>
            <div className="employee-found">
                <img 
                  src={found.imageUrl} 
                  alt={`${found.firstName} ${found.lastName}`} 
                />
            </div>
          </div>
        ) : searchTerm && (
          <div className="no-results">
            <p>No employee found</p>
          </div>
        )}
    </div>
  );
}

export default EmployeeCard;