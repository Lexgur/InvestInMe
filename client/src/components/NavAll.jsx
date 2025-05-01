import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';
import './NavAll.css';
import Logo from './Logo.jsx';

export default function NavAll() {
  const { pathname } = useLocation();
  const { user, loading, logout } = useAuth();

  const noNav = ['/login', '/register'];

  if (loading) return null;

  if (noNav.includes(pathname)) {
    return null;
  }

  return (
    <div className="wrapper">
      <nav className="auth-nav">
        <div className="left">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/about">About</NavLink>
          <Logo />
        </div>
        {user ? (
          <div className="right">
            <NavLink to="/campaigns">Browse Campaigns</NavLink>
            <NavLink to="/campaigns/new">Start a Campaign</NavLink>
            <NavLink to="/my-campaigns">My Campaigns</NavLink>
            <NavLink to="/dashboard">Profile</NavLink>
            {user?.role === 'admin' && (
              <NavLink to="/admin">Admin Panel</NavLink>
            )}
            <button onClick={logout} className="nav-button-link">
              Logout
            </button>
          </div>
        ) : (
          <div className="right">
            <NavLink to="/campaigns">Browse Campaigns</NavLink>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register">Register</NavLink>
          </div>
        )}
      </nav>
    </div>
  );
}
