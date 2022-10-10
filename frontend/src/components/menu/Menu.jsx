import React,{useState, useEffect} from 'react'
import './Menu.css'
import { Link, useParams } from 'react-router-dom';
import { Axios } from '../../Axios';


const Menu = ({category}) => {

  const [posts, setPosts] = useState([])
  const currentPostId = useParams().id


  useEffect(() => {
    const getPosts = async () => {
        try {
            const res = await Axios.get(`/posts?category=${category}`)
            setPosts(res.data)
        } catch (error) {
            console.log(error)
        }
    }
    getPosts()
  }, [category])


return (
<div className="menu">
      <h2>Other posts you may like</h2>
      {posts.filter(post => post.id !== currentPostId).length > 0 
      ? 
      [...posts.filter(post => post.id !== currentPostId)].sort(() => 0.5 - Math.random()).slice(0,2).map((post) => (
        <div className="post" key={post?.id}>
          <img src={post?.image} alt="" />
          <h3>{post?.title?.slice(0,50)}</h3>
          <Link to={`/post/${post?.id}`} className="post-link">Read More</Link>
        </div>
      ))
      :
      <div className='no-posts'>No other posts match this category</div>
      }
</div>
)}

export default Menu