import React, { useState } from 'react';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function register(ev) {
    ev.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please try again.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:4000/register', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
        headers: { 'Content-Type': 'application/json' },
      });


      if (!response.ok) {
        throw new Error(`Registration failed. Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Registration response:', data);
      // Handle successful registration, e.g., redirect or show a success message
    } catch (error) {
      console.error('Error during registration:', error.message);
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className='register' onSubmit={register}>
      <h1>Registration</h1>
      <input type='text' placeholder='Username' value={username} onChange={(ev) => setUsername(ev.target.value)} />
      <input type='password' placeholder='Password' value={password} onChange={(ev) => setPassword(ev.target.value)} />
      <input type='password' placeholder='Confirm Password' value={confirmPassword} onChange={(ev) => setConfirmPassword(ev.target.value)} />
      <button type='submit' disabled={loading}>
        {loading ? 'Registering...' : 'Register'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
};

export default RegisterPage;
