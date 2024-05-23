import React from 'react';
import { Link } from 'react-router-dom';
import '../../index.css';
import './Navbar.css';

const Navbar = () => {
  const closeSession = async () => {
    localStorage.removeItem('token');

    window.location.href = '/login';
  }

  return (
    <header className='flex justify-center  gap-3 items-center h-[80px] w-full shadow-sm bg-white'>
        <img  src="docs.png" width={"40px"}/>
        <h1 className='text-3xl text-zinc-600'>Docs</h1>

        <div className='navbar-button-group'>
        <Link to="/notifications" className='notifications-button'>Notificaciones</Link>
        <button className='logout-button' onClick={closeSession}>Cerrar sesión</button>
        </div>
       
    </header>
  );
}

export default Navbar;