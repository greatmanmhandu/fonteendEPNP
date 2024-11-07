import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import avatar from '../../../assets/pregaz.jpeg';
import '../login.css';
import LoginLayout from '../Layout';

const ForgotLogin = () => {

    useEffect(() => {
        // Managing focus on the inputs
        const inputs = document.querySelectorAll('.input');
        
        function addClassOnFocus() {
            let parent = this.parentNode.parentNode;
            parent.classList.add('focus');
        }

        function removeClassOnBlur() {
            let parent = this.parentNode.parentNode;
            if (this.value === '') {
                parent.classList.remove('focus');
            }
        }

        inputs.forEach((input) => {
            input.addEventListener('focus', addClassOnFocus);
            input.addEventListener('blur', removeClassOnBlur);
        });
        
        return () => {
            // Removing event listeners
            inputs.forEach((input) => {
                input.removeEventListener('focus', addClassOnFocus);
                input.removeEventListener('blur', removeClassOnBlur);
            });
        };
    }, []);
    
    const navigate = useNavigate();
    function handleFormSubmit(event) {
        event.preventDefault();
        const code = '1234';

        // Checking user

        // Clearing history in localStorage
        // window.localStorage.clear();

        // Setting code in localStorage
        localStorage.setItem('code', code);

        // Navigating to the checkCode view
        navigate('/access-validation');
    }

    return (
        <LoginLayout>
            <div className="login-content">
                <form onSubmit={handleFormSubmit}>
                <img src={avatar} alt="login-avatar" style={{ borderRadius: '50%', width: '200px', height: '200px' }} />
                    <h2 className="title" style={{color: '#350d75',fontSize:'1.0rem'}}>Find your user</h2>
                    <div className="input-div one">
                        <div className="icon">
                            <FontAwesomeIcon icon={faUser} className="i" />
                        </div>
                        <div className="div">
                            <h5>Email, Phone, or Username</h5>
                            <input type="text" className="input" required />
                        </div>
                    </div>
                    <button type="submit" className="btn">
                        Next
                    </button>
                </form>
            </div>
        </LoginLayout>
    );
}

export default ForgotLogin;