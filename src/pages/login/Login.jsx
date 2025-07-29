import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../../firebase/firebase';
import { useNavigate } from "react-router-dom";
import './login.css'
import { useEffect, useState } from 'react';

function Login() {

    const navigate = useNavigate();
    const [user, setUser] = useState('')

    useEffect(() => {
        if (localStorage.getItem("user") != null) {
            navigate("/notes")
        }
    }, [user])

    const handleLogin = async () => {
        try {
            const signin = await signInWithPopup(auth, provider)
            const user = signin.user;
            setUser(user)
            localStorage.setItem("user", JSON.stringify(user))
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="login-main">
            <div>
                <button onClick={handleLogin}>Login With Google</button>
            </div>
        </div>
    )
}

export default Login