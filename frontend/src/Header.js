import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext';
// Import statements...

const Header = () => {
  const { setUserInfo, userInfo } = useContext(UserContext);
  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      const response = await fetch('https://localhost:4000/profile', {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Error fetching profile. Status: ${response.status}`);
      }

      const userProfile = await response.json();
      setUserInfo(userProfile);
    } catch (error) {
      console.error('Error fetching profile:', error.message);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [setUserInfo]);

  const logout = async () => {
    try {
      const response = await fetch('https://localhost:4000/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Logout failed. Status: ${response.status}`);
      }

      setUserInfo(null);
      navigate('/');
    } catch (error) {
      console.error('Error during logout:', error.message);
    }
  };

  const username = userInfo?.username;

  return (
    <header>
      <Link to="/" className="logo">
        My Blog
      </Link>
      <nav>
        {username ? (
          <>
            <Link to="/create">Create new post</Link>
            <button onClick={logout} className="logout-button">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Registration</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
