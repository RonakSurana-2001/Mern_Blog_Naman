import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext';

const Header = () => {
  const { userInfo,setUserInfo } = useContext(UserContext);
  const navigate = useNavigate();
  const username = localStorage.getItem("isLoggedIn");
  const fetchProfile = async () => {
    if(username==true){
      try {
        const response = await fetch('http://localhost:4000/profile', {
            method: 'POST',
            body: JSON.stringify({ "token": localStorage.getItem("token") }),
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (!response.ok) {
            throw new Error(`Error fetching profile. Status: ${response.status}`);
        }

        const userProfile = await response.json();
        setUserInfo(userProfile);
    } catch (error) {
        console.error('Error fetching profile:', error);
    }
    }
};

  useEffect(()=>{
      fetchProfile()
  },[username])

  const logout = async () => {
    try {
      setUserInfo(null);
      localStorage.setItem("isLoggedIn",false);
      localStorage.clear();
      navigate('/');
    } catch (error) {
      console.error('Error during logout:', error.message);
    }
  };

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
