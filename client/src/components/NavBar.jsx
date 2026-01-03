import React from "react";
import { Link } from 'react-router-dom'
import './NavBar.scss'

const NavBar = () => {
    return (
        <nav className="primary-nav">            
            <Link to="/">Home</Link>
            <Link to="/all-students">All Students</Link>
            <Link to='/create-user'>Create User</Link>
            <Link to='/create-student'>Create Student</Link>
        </nav>
    )
}

export default NavBar;