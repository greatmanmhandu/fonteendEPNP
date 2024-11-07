import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import avatar from '../../../assets/uzim-logo.jpg';
import '../login.css';
import LoginLayout from '../Layout';

const AccessValidation = () => {

  useEffect(() => {
    // Management of the focus on the inputs
    const inputs = document.querySelectorAll('.input');

    function addFocusClass() {
      let parent = this.parentNode.parentNode;
      parent.classList.add('focus');
    }

    function removeFocusClass() {
      let parent = this.parentNode.parentNode;
      if (this.value === '') {
        parent.classList.remove('focus');
      }
    }

    inputs.forEach((input) => {
      input.addEventListener('focus', addFocusClass);
      input.addEventListener('blur', removeFocusClass);
    });

    return () => {
      // Remove event listeners
      inputs.forEach((input) => {
        input.removeEventListener('focus', addFocusClass);
        input.removeEventListener('blur', removeFocusClass);
      });
    };
  }, []);

  const [inputCode, setInputCode] = useState('');

  const navigate = useNavigate();

  function handleFormSubmit(event) {
    event.preventDefault();

    const accessCode = localStorage.getItem('code');

    if (inputCode === accessCode) {
      window.localStorage.clear();
      // token
      navigate('/home');
      setTimeout(() => {
        alert("Change the password in user settings");
      }, 0);
      return;
    }

    setInputCode('');
    alert("The access code does not match");
  }
  
  function handleInputChange(event) {
    setInputCode(event.target.value);
  }

  return (
    <LoginLayout>
      <div className="login-content">
        <form onSubmit={handleFormSubmit}>
        <img src={avatar} alt="login-avatar" style={{ borderRadius: '50%', width: '100px', height: '100px' }} />
          <h2 className="title" style={{color:'#350d75'}}>Recover your account</h2>
          <p>Enter the access code sent to your email</p>
          <div className="input-div one">
            <div className="icon">
              <FontAwesomeIcon icon={faUser} className="i" />
            </div>
            <div className="div">
              <h5>Access Code</h5>
              <input type="text" minLength="4" maxLength="4" className="input" value={inputCode} onChange={handleInputChange} required />
            </div>
          </div>
          <button type="submit" className="btn">
            Submit
          </button>
        </form>
      </div>
    </LoginLayout>
  );
}

export default AccessValidation;