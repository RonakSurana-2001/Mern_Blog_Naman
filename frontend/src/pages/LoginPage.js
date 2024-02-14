// LoginPage.js

import React, { useState, useContext } from 'react';
import { UserContext } from '../UserContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [redirect, setRedirect] = useState(false);
  const { setUserInfo } = useContext(UserContext);

  async function login(ev) {
    ev.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:4000/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (response.ok) {
        const userInfo = await response.json();
        setUserInfo(userInfo);
        setRedirect(true);
      } else {
        throw new Error(`Login failed. Status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error during login:', error.message);
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (redirect) {
    window.location.href = '/';
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
