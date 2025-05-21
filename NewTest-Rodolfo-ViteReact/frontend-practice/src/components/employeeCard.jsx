import { useState, useEffect } from 'react';

function EmployeeCard({ onEmployeeFound }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [found, setFound] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value === "") {
      setFound(null);
      onEmployeeFound(null);
      setError(null);
    }
  };

  useEffect(() => {
    const searchEmployee = async () => {
      if (searchTerm === "") return;

      try {
        setIsLoading(true);
        setError(null);
        
        const numericId = parseInt(searchTerm, 10);
        if (isNaN(numericId)) {
          throw new Error('Please enter a valid numeric ID');
        }
        
        const response = await fetch(`http://localhost:3000/employee?id=${numericId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch employee data');
        }
        
        const employees = await response.json();
        const foundEmployee = employees[0]; // Get first match since we're searching by ID
        
        setFound(foundEmployee || null);
        onEmployeeFound(foundEmployee || null);
        
        if (!foundEmployee) {
          setError('No employee found with that ID');
        }
      } catch (err) {
        console.error('Error fetching employee:', err);
        setError(err.message || 'Error searching for employee');
        setFound(null);
        onEmployeeFound(null);
      } finally {
        setIsLoading(false);
      }
    };

    // Set up debounce timer
    const timeoutId = setTimeout(() => {
      searchEmployee();
    }, 500); // Wait 500ms after last keystroke before searching

    // Cleanup function to clear timeout if component updates before timeout finishes
    return () => clearTimeout(timeoutId);
  }, [searchTerm, onEmployeeFound]); // Only run effect when searchTerm changes

  return (
    <div className="employee-card">
        <div className="employee-search">
            <label htmlFor="search">Search by ID: </label>
            <input 
              type="text"
              id="search"
              placeholder="Enter ID here" 
              value={searchTerm}
              onChange={handleInputChange}
              disabled={isLoading}
            />
            {isLoading && <span className="loading-indicator">Searching...</span>}
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
        ) : error && searchTerm && (
          <div className="no-results">
            <p>{error}</p>
          </div>
        )}
    </div>
  );
}

export default EmployeeCard;