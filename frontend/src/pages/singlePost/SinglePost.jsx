import React,{useContext, useState, useEffect} from 'react'
import './SinglePost.css'
import { Link, useNavigate, useParams } from 'react-router-dom'
import moment from 'moment'
import {AuthContext} from '../../context/AuthContext'
import Menu from '../../components/menu/Menu'
import { Axios } from '../../Axios'
import { UserContext } from '../../context/UserContext'
import { AiFillEdit, AiFillDelete } from 'react-icons/ai'
import { ref, deleteObject } from "firebase/storage";
import { storage } from '../../firebase'
import { confirmAlert } from 'react-confirm-alert'; 
import 'react-confirm-alert/src/react-confirm-alert.css';


const SinglePost = () => {

    const currentUser = useContext(AuthContext)
    const users = useContext(UserContext)
    const [post, setPost] = useState(null)
    const [error, setError] = useState(null)
    const postId = useParams().id
    const postUser = users.find(user => user.id === post?.userId)
    const navigate = useNavigate()


    useEffect(() => {
    const getPost = async () => {
      try {
        const res = await Axios.get(`/posts/${postId}`)
        setPost(res.data)
      } catch (err) {
        console.log(err)
      }
    }
    getPost()
    }, [postId])  
    
    const getText = (html) =>{
      const doc = new DOMParser().parseFromString(html, "text/html")
      return doc.body.textContent
  }

  const handleDeletePost = async () => {
    confirmAlert({
      title: 'Delete Post ?',
      buttons: [
      {
          label: 'Yes',
          onClick: async () => {
            try {
              //delete image from firebase storage
              await deleteObject(ref(storage, post.image))
              //delete post from database
              await Axios.delete(`/posts/${postId}`)
              navigate("/")
            } catch (err) {
              console.log(err)
              setError(err.message) 
            }
          }
      },
      {
          label: 'No',
      }
  ]
  })}


return (
<div className="singlePost">
    <div className="content">
        <img src={post?.image} alt="" />
        <div className="user">
          <div className="user-info">
            <img
            src={postUser?.image}
            alt=""
            />
            <span>{postUser?.username?.toUpperCase()}</span>
          </div>
          <small>Posted {moment(post?.date).fromNow()}</small>
          {currentUser && currentUser?.username === postUser?.username && (
            <div className="icons">
              <Link to={`/newPost?edit=${postId}`} state={post}>
                <div className='edit-icon'>
                  <AiFillEdit color="green"/>
                </div>
              </Link>
              <div className='delete-icon' onClick={handleDeletePost}>
                <AiFillDelete color="crimson"/>
              </div>
            </div>
          )}
        </div>
        <h1>{post?.title.slice(0, 50)}</h1>
        <p>{getText(post?.description)}</p>      
    </div>
    <Menu category={post?.category}/>
</div>
)}

export default SinglePost