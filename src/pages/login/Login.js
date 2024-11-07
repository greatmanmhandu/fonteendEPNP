import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import avatar from '../../assets/pregaz.jpeg';
import './login.css';
import LoginLayout from './Layout';
import { API } from '../../env';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from '../../components/loading/Loading';

const Login = () => {

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Delete history in localStorage
        localStorage.clear();

        // Management of the focus on the inputs
        const inputs = document.querySelectorAll('.input');

        function addcl() {
            let parent = this.parentNode.parentNode;
            parent.classList.add('focus');
        }

        function remcl() {
            let parent = this.parentNode.parentNode;
            if (this.value === '') {
                parent.classList.remove('focus');
            }
        }

        inputs.forEach((input) => {
            input.addEventListener('focus', addcl);
            input.addEventListener('blur', remcl);
        });

        // Hide or show the eye icon when password input is not being used
        const toggleIcon = document.querySelector('.toggle-icon');
        const passwordInput = document.querySelector('.input[type="password"]');

        toggleIcon.style.display = 'none'; // Always hide on page load

        function handlePasswordInput() {
            if (passwordInput.value.length > 0) {
                toggleIcon.style.display = 'block';
            } else {
                toggleIcon.style.display = 'none';
            }
        }

        passwordInput.addEventListener('input', handlePasswordInput);

        return () => {
            // Remove event listeners
            inputs.forEach((input) => {
                input.removeEventListener('focus', addcl);
                input.removeEventListener('blur', remcl);
            });
            passwordInput.removeEventListener('input', handlePasswordInput);
        };
    }, []);

    const [submitDisabled, setSubmitDisabled] = useState(false);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    function handleUsernameChange(event) {
        setUsername(event.target.value);
    }
    function handlePasswordChange(event) {
        setPassword(event.target.value);
    }

    // Show/hide password when the eye icon is clicked
    const [showPassword, setShowPassword] = useState(false);
    function togglePasswordVisibility() {
        setShowPassword(!showPassword);
    }

    // Manage system login
    const navigate = useNavigate();
    async function handleFormSubmit(event) {
        setIsLoading(true)

        event.preventDefault();
        setSubmitDisabled(true);
        try {
            // Check login
            const loginData = {
                email: username.trim(),
                password: password
            }
            const response = await fetch(`${API}/api/v1/user/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData),
            });

            if (response.ok) {
                // Delete history in localStorage
                localStorage.clear();
                // token
                const user = await response.json();
                console.log(user.role)
                localStorage.setItem('user', JSON.stringify(user));
                localStorage.setItem('userId', user.userId);
                setIsLoading(false)
                if (user.email === "gman@gmail.com") {
                    navigate(`/home`);
                    return;
                } else {
                    navigate(`/home`);
                    return;
                }

            }
            // Clear username and password fields
            setUsername('');
            setPassword('');


            toast.error("The credentials do not match.");
            setIsLoading(false)
            // navigate('/');
        } catch (error) {
            console.log(error);
            // Clear username and password fields
            setUsername('');
            setPassword('');
            setIsLoading(false)
            navigate('/');
        }
    }

    return (
        <LoginLayout>
            <div className="login-content">
                <form onSubmit={handleFormSubmit}>
                    <img src={avatar} alt="login-avatar" style={{ borderRadius: '50%', width: '200px', height: '200px' }} />
                    <h2 className="title" style={{ color: '#350d75',fontSize:'1.0rem' }} >Electronic Health Pre-Natal Passport </h2>
                    <div className="input-div one">
                        <div className="icon">
                            <FontAwesomeIcon icon={faUser} className="i" />
                        </div>
                        <div className="div">
                            <h5>Username</h5>
                            <input type="text" className="input" value={username} onChange={handleUsernameChange} required />
                        </div>
                    </div>
                    <div className="input-div pass">
                        <div className="icon">
                            <FontAwesomeIcon icon={faLock} className="i" />
                        </div>
                        <div className="div">
                            <h5>Password</h5>
                            <input type={showPassword ? 'text' : 'password'} className="input" value={password} onChange={handlePasswordChange} required />
                            <div className="icon">
                                <FontAwesomeIcon
                                    icon={showPassword ? faEyeSlash : faEye}
                                    className="toggle-icon i"
                                    onClick={togglePasswordVisibility}
                                />
                            </div>
                        </div>
                    </div>
                    {/* <Link to="/forgot-login">¿Olvidaste tu contraseña?</Link> */}
                    {!isLoading ? (
                        <button type="submit" className="btn" disabled={submitDisabled}>
                            Login
                        </button>
                    ) : (
                        <Loading />
                    )}
                    <p style={{ marginTop: '10px' }}>Forgot your password? <a href="/forgot-login">Click here</a></p>
                </form>


            </div>
            <ToastContainer />
        </LoginLayout>
    );
}

export default Login;
