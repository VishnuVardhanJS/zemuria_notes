import './Header.css'
import { useNavigate } from "react-router-dom";

function Header() {

    const navigate = useNavigate();

    const handleLogout = () => {
        try {
            localStorage.removeItem('user')
            navigate("/");
        } catch (error) {
            console.error("Logout failed", error);
            alert("Failed to log out. Try again.");
        }
    };

    const user = JSON.parse(localStorage.getItem('user'))
    return (
        <div className="header-container">
            <h1>{user.displayName}'s Notes</h1>
            <button onClick={handleLogout} className='logout-button'>Logout</button>
        </div>
    )
}

export default Header;