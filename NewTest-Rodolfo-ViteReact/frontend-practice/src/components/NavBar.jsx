import { Link } from 'react-router-dom';

function NavBar() {
    return (
        <nav className="navbar">
            <div className="navbar-container">
                <ul className="navbar-menu">
                    <li className="navbar-item">
                        <Link to="/" className="navbar-link">Home</Link>
                    </li>
                    <li className="navbar-item">
                        <Link to="/current-timeoff" className="navbar-link">Current Time Off</Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default NavBar;