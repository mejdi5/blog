import React,{useContext} from 'react'
import { AuthContext } from '../../context/AuthContext'
import { signOut } from 'firebase/auth'
import { auth } from '../../firebase'
import './Navbar.css'
import { Link, useNavigate } from 'react-router-dom'
import {BsPencil} from 'react-icons/bs'

const Navbar = () => {

    const currentUser = useContext(AuthContext)
    const navigate = useNavigate()

return (
<div className="navbar">
    <div className="navbar-container">
        <Link to="/">
            <img 
            className="logo"
            src="/logo.png" 
            alt="" 
            />
        </Link>
        <div className="navbar-links">
          <Link className="navbar-link category-link" to="/?category=art">
            <h6>ART</h6>
          </Link>
          <Link className="navbar-link category-link" to="/?category=science">
            <h6>SCIENCE</h6>
          </Link>
          <Link className="navbar-link category-link" to="/?category=technology">
            <h6>TECHNOLOGY</h6>
          </Link>
          <Link className="navbar-link category-link" to="/?category=cinema">
            <h6>CINEMA</h6>
          </Link>
          <Link className="navbar-link category-link" to="/?category=history">
            <h6>HISTORY</h6>
          </Link>
          <Link className="navbar-link category-link" to="/?category=food">
            <h6>FOOD</h6>
          </Link>
          <Link className="navbar-link category-link" to="/?category=sports">
            <h6>SPORTS</h6>
          </Link>
          <div className="userInfo" onClick={() => navigate(`/profile/${currentUser.id}`)}> 
            <img src={currentUser?.image} alt=""/>
            <span>{currentUser?.username?.toUpperCase()}</span>
          </div>
          {currentUser ? (
            <span onClick={() => signOut(auth)} className="logout">Log Out</span>
          ) : (
            <Link className="navbar-link login" to="/login">
              Log In
            </Link>
          )}
          {currentUser &&
          <Link className="navbar-link" to="/newPost">
            <span className="write">         
                <BsPencil/>
            </span>
          </Link>
          }
        </div>
    </div>
</div>
)}

export default Navbar