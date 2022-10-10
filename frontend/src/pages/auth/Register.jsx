import React, {useState} from 'react'
import './Auth.css'
import { Link, useNavigate } from 'react-router-dom'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth } from '../../firebase'
import {Axios} from '../../Axios'


const Register = () => {

  const [fields, setFields] = useState({
    username: "",
    email: "",
    password: ""
  })
  const [error, setError] = useState(null);
  const navigate = useNavigate()

  const handleChangeFields = e => {
    setFields(prev => ({...prev, [e.target.name]: e.target.value}))
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    try {
      const res = await createUserWithEmailAndPassword(auth, fields.email, fields.password)
      await updateProfile(res.user, {
        displayName: fields.username,
        photoURL: "https://media.istockphoto.com/vectors/profile-placeholder-image-gray-silhouette-no-photo-vector-id1016744004?k=20&m=1016744004&s=612x612&w=0&h=Z4W8y-2T0W-mQM-Sxt41CGS16bByUo4efOIJuyNBHgI="
    })
      if(res.user) {
        const newUser = {
          id: res.user.uid,
          username: fields.username,
          email: fields.email,
          image: "https://media.istockphoto.com/vectors/profile-placeholder-image-gray-silhouette-no-photo-vector-id1016744004?k=20&m=1016744004&s=612x612&w=0&h=Z4W8y-2T0W-mQM-Sxt41CGS16bByUo4efOIJuyNBHgI="
        }
        await Axios.post(`/users`, newUser)
        navigate("/login");
      }
    } catch (err) {
      auth.currentUser?.delete()
      setError(err.message)
    }
  }

return (
<div className="auth">
      <h1>Register</h1>
      <form>
        <input
          required
          type="text"
          placeholder="username"
          name="username"
          onChange={handleChangeFields}
        />
        <input
          required
          type="email"
          placeholder="email"
          name="email"
          onChange={handleChangeFields}
        />
        <input
          required
          type="password"
          placeholder="password"
          name="password"
          onChange={handleChangeFields}
        />
        <button onClick={handleRegister} className="register-btn">Register</button>
        {error && <p className="error">{error}</p>}
        <span>
          Do you have an account? <Link to="/login">Login</Link>
        </span>
      </form>
</div>
)}

export default Register