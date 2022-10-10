import React,{useEffect, useState} from 'react'
import './Home.css'
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Axios } from '../../Axios';

const Home = () => {

    const navigate = useNavigate()
    const category = useLocation().search
    const [posts, setPosts] = useState([])


    useEffect(() => {
    const getPosts = async () => {
        try {
            const res = await Axios.get(`/posts/${category}`)
            setPosts(res.data)
        } catch (error) {
            console.log(error)
        }
    }
    getPosts()
    }, [category])

    const getText = (html) =>{
        const doc = new DOMParser().parseFromString(html, "text/html")
        return doc.body.textContent
    }

return (
<div className='home'>
    <div className='home-container'>
    {posts.length > 0 
    ?
    posts.sort((a,b) => b.id - a.id).map((post) => (
        <div className="home-post" key={post.id}>
            <div className="post-image">
                <img src={`${post.image}`} alt="" />
            </div>
            <div className="post-content">
                <Link className="link" to={`/post/${post.id}`}>
                    <h1>{post.title}</h1>
                </Link>
                <p>{getText(post.description).slice(0, 200)}</p>
                <button onClick={() => navigate(`/post/${post.id}`)}>Read More</button>
            </div>
        </div>
    ))
    :
    <div className="no-posts">No Posts</div>
    }
    </div>
</div>
)}

export default Home