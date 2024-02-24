// LoginPage.js

import React, { useState, useContext } from 'react';
import { UserContext } from '../UserContext';
import { Navigate, useNavigate } from 'react-router-dom';
const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [redirect, setRedirect] = useState(false);
  const { setUserInfo } = useContext(UserContext);
  let navigate=useNavigate()
  async function login(event) {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('http://localhost:4000/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
        headers: { 'Content-Type': 'application/json' }
      });
      const userInfo = await response.json();

      if(userInfo.error=='Username and password are required'){
        setError('Username and password are required')
      }
      else if (userInfo.error === 'Invalid username or password') {
        setError('Invalid username or password');
      } 
      else {
        setUserInfo(userInfo);
        localStorage.setItem("token", userInfo.token);
        setRedirect(true);
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError('An unexpected error occurred'); // Set error message for unexpected errors
    }
    setLoading(false);
  }

  if (redirect) {
    localStorage.setItem("isLoggedIn",true)
    window.location.href="/"
  }

  return (
    <form className='login' onSubmit={login}>
      <h1>Login</h1>
      <input
        type='text'
        placeholder='username'
        value={username}
        onChange={(ev) => setUsername(ev.target.value)}
      />
      <input
        type='password'
        placeholder='password'
        value={password}
        onChange={(ev) => setPassword(ev.target.value)}
        autoComplete='current-password'
      />
      <button type='submit' disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
};

export default Login;
