import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';
import './NavAll.css';
import Logo from './Logo.jsx';

export default function NavAll() {
  const { pathname } = useLocation();
  const { user, loading, logout } = useAuth();

  const noNav = ['/login', '/register'];

  if (loading) {
    return <div>Loading...</div>;
  }

  if (noNav.includes(pathname)) {
    return null;
  }

  return (
    <div className='wrapper'>
    <nav className="auth-nav">
      <div className="left">
        <NavLink to="/">Home</NavLink>
        <Logo></Logo>
      </div>
      {
        user ? (
          <div className="right">
            <div>{user.username}</div>
            <button onClick={logout} className="nav-button-link">Logout</button>
          </div>
        ) : (
          <div className="right">
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register">Register</NavLink>
          </div>
        )
      }
    </nav>
    </div>
  );
}
