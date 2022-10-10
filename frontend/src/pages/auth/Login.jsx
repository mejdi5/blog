import React, {useRef, useState, useContext} from 'react'
import './Auth.css'
import { Link, useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../firebase'
import { AuthContext } from '../../context/AuthContext'
import { Axios } from '../../Axios'


const Login = () => {
  
  const email = useRef()
  const password = useRef()
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const user = useContext(AuthContext)


  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email?.current?.value, password?.current?.value)
      await Axios.get(`/users/${user.id}`)
      navigate("/")
      window.location.reload()
    } catch (err) {
      console.log(err)
      setError(err.message) 
    }
  }

return (
<div className="auth">
    <h1>Log In</h1>
    <form>
        <input
        required
        type="text"
        placeholder="username"
        ref={email}
        />
        <input
        required
        type="password"
        placeholder="password"
        ref={password}
        />
        <button onClick={handleLogin} className="login-btn">Log In</button>
        {error && <p className="error">{error}</p>}
        <span>
          Don't you have an account? <Link to="/register">Register</Link>
        </span>
    </form>
</div>
)}

export default Login