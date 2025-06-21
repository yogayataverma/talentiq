import React, { useState } from 'react';
import './AuthForm.css';
import { useNavigate } from 'react-router-dom';

const API_URL = 'https://talentiq-jwlg.onrender.com/api';

function Popup({ message, onClose, type }) {
  if (!message) return null;
  return (
    <div className={`popup-overlay`}>
      <div className={`popup-modal ${type}`}> 
        <span className="popup-message">{message}</span>
        <button className="popup-close" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [popup, setPopup] = useState({ message: '', type: '' });
  const [timer, setTimer] = useState(null);
  const navigate = useNavigate();

  const isFormValid = () => {
    if (isLogin) {
      return form.email.trim() !== '' && form.password.trim() !== '';
    } else {
      return (
        form.name.trim() !== '' &&
        form.email.trim() !== '' &&
        form.password.trim() !== '' &&
        form.password === form.confirmPassword
      );
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      if (!isLogin && form.password !== form.confirmPassword) {
        setPopup({ message: 'Passwords do not match', type: 'error' });
      } else {
        setPopup({ message: 'Please fill in all required fields', type: 'error' });
      }
      return;
    }
    try {
      if (isLogin) {
        const res = await fetch(`${API_URL}/users/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: form.email, password: form.password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Login failed');
        localStorage.setItem('token', data.token);
        setPopup({ message: 'Login successful!', type: 'success' });
        setTimeout(() => navigate('/dashboard'), 800);
        const payload = JSON.parse(atob(data.token.split('.')[1]));
        const expiresIn = payload.exp * 1000 - Date.now();
        if (timer) clearTimeout(timer);
        setTimer(setTimeout(() => {
          localStorage.removeItem('token');
          setPopup({ message: 'Session expired. You have been logged out.', type: 'error' });
        }, expiresIn));
      } else {
        const res = await fetch(`${API_URL}/users/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            password: form.password,
            confirmPassword: form.confirmPassword,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Registration failed');
        setPopup({ message: 'Registration successful! Please login.', type: 'success' });
        setIsLogin(true);
        setForm({ name: '', email: '', password: '', confirmPassword: '' });
      }
    } catch (err) {
      setPopup({ message: err.message, type: 'error' });
    }
  };

  const renderInput = (label, type, placeholder, name) => (
    <div className="auth-input-group">
      <div className="auth-input-label">
        {label} <span className="required-star">*</span>
      </div>
      <input
        type={type}
        placeholder={placeholder}
        name={name}
        value={form[name]}
        onChange={handleChange}
        required
      />
    </div>
  );

  return (
    <div className="auth-form-container">
      <div className="auth-form-heading">Welcome to Dashboard</div>
      <Popup message={popup.message} type={popup.type} onClose={() => setPopup({ message: '', type: '' })} />
      {isLogin ? (
        <>
          <form className="login-form-fields" onSubmit={handleSubmit}>
            {renderInput('Email Address', 'email', 'Enter your email address', 'email')}
            {renderInput('Password', 'password', 'Enter your password', 'password')}
            <button type="submit" disabled={!isFormValid()}>Login</button>
          </form>
          <div className="auth-form-link login-link">
            Don&apos;t have an account?{' '}
            <span className="auth-form-link-action" onClick={() => setIsLogin(false)}>
              Register
            </span>
          </div>
        </>
      ) : (
        <>
          <form className="register-form-fields" onSubmit={handleSubmit}>
            {renderInput('Full Name', 'text', 'Enter your full name', 'name')}
            {renderInput('Email Address', 'email', 'Enter your email address', 'email')}
            {renderInput('Password', 'password', 'Enter your password', 'password')}
            {renderInput('Confirm Password', 'password', 'Confirm your password', 'confirmPassword')}
            <button type="submit" disabled={!isFormValid()}>Register</button>
          </form>
          <div className="auth-form-link register-link">
            Already have an account?{' '}
            <span className="auth-form-link-action" onClick={() => setIsLogin(true)}>
              Login
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default AuthForm; 