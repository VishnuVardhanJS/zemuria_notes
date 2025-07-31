import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../../firebase/firebase';
import { useNavigate } from "react-router-dom";
import './login.css';
import { useEffect, useState } from 'react';

function Login() {
    const navigate = useNavigate();
    const [user, setUser] = useState('');

    useEffect(() => {
        if (localStorage.getItem("user") != null) {
            navigate("/notes");
        }
    }, [user]);

    const handleLogin = async () => {
        try {
            const signin = await signInWithPopup(auth, provider);
            const user = signin.user;
            setUser(user);
            localStorage.setItem("user", JSON.stringify(user));
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="login-main">
            <div className="login-box">
                <h1 className="login-title">Welcome to Notes</h1>
                <p className="login-subtitle">Sign in to continue</p>
                <button onClick={handleLogin} className="google-btn">
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg" alt="Google Icon" className="google-icon" />
                    Login with Google
                </button>
            </div>
        </div>
    );
}

export default Login;
