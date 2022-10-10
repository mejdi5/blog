import React, { useState, useContext, useEffect } from 'react'
import { AuthContext } from '../../context/AuthContext'
import './NewPost.css'
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useLocation, useNavigate } from 'react-router-dom';
import {AiOutlineUpload} from 'react-icons/ai'
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from '../../firebase'
import { Axios } from '../../Axios';


const NewPost = () => {

    const currentUser = useContext(AuthContext)
    const navigate = useNavigate()
    const postState = useLocation().state;
    const [file, setFile] = useState(null);
    const [image, setImage] = useState(postState?.image || null);
    const [title, setTitle] = useState(postState?.title || null);
    const [description, setDescription] = useState(postState?.description || null);
    const [category, setCategory] = useState(postState?.category || null);
    const [percentage, setPercentage] = useState(0)
    const [uploading, setUploading] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {
      const uploadImage = () => {
      const storageRef = ref(storage, file.name + Date.now());
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on('state_changed', 
      (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setPercentage(progress)
          switch (snapshot.state) {
              case 'paused': setUploading('Paused');
              break;
              case 'running': setUploading('Uploading');
              break;
          }
      }, 
      (err) => setError(err.message), () => {
      getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
          setImage(downloadURL)
          setPercentage(0)
          setUploading(null)
      })})
      }
      file && uploadImage()
  }, [file])


  const handleDeleteImage = async (picture) => {
    try {
    //delete image from firebase storage
    await deleteObject(ref(storage, picture))
    } catch (err) {
    setError(err.message)
    }
    setImage(null)
  }

  const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const newPost = {
          title,
          description,
          image,
          category,
          userId: currentUser.id
        }
        postState 
        ? await Axios.put(`/posts/${postState.id}`, newPost)
        : await Axios.post(`/posts`, newPost)
        navigate('/')
      } catch (err) {
        if (err?.response?.data) {
          setError(err?.response?.data?.sqlMessage)
        } else {
          setError(err.message)
        }
        (image && postState?.image !== image) && handleDeleteImage(image)
      }
  }


return (
<div className="newPost-container">
    <div className="newPost-content"> 
        <input
        required
        type="text"
        placeholder="Title"
        value={title || ""}
        onChange={(e) => setTitle(e.target.value)}
        />
        <div className="editorContainer">
            <ReactQuill
            className="editor"
            theme="snow"
            value={description || ""}
            onChange={setDescription}
            />
        </div>
    </div>
    <div className='error'>{error && error}</div>
    <div className="newPost-menu">
        <div className='newPost-menu-left'>
          <h2>Category</h2>
          <div className="category">
            <input
              type="radio"
              checked={category === "art"}
              name="category"
              value="art"
              id="art"
              onChange={(e) => setCategory(e.target.value)}
            />
            <label htmlFor="art">Art</label>
          </div>
          <div className="category">
            <input
              type="radio"
              checked={category === "science"}
              name="category"
              value="science"
              id="science"
              onChange={(e) => setCategory(e.target.value)}
            />
            <label htmlFor="science">Science</label>
          </div>
          <div className="category">
            <input
              type="radio"
              checked={category === "technology"}
              name="category"
              value="technology"
              id="technology"
              onChange={(e) => setCategory(e.target.value)}
            />
            <label htmlFor="technology">Technology</label>
          </div>
          <div className="category">
            <input
              type="radio"
              checked={category === "cinema"}
              name="category"
              value="cinema"
              id="cinema"
              onChange={(e) => setCategory(e.target.value)}
            />
            <label htmlFor="cinema">Cinema</label>
          </div>
          <div className="category">
            <input
              type="radio"
              checked={category === "history"}
              name="category"
              value="history"
              id="history"
              onChange={(e) => setCategory(e.target.value)}
            />
            <label htmlFor="history">History</label>
          </div>
          <div className="category">
            <input
              type="radio"
              checked={category === "food"}
              name="category"
              value="food"
              id="food"
              onChange={(e) => setCategory(e.target.value)}
            />
            <label htmlFor="food">Food</label>
          </div>
          <div className="category">
            <input
              type="radio"
              checked={category === "sports"}
              name="category"
              value="sports"
              id="sports"
              onChange={(e) => setCategory(e.target.value)}
            />
            <label htmlFor="food">Sports</label>
          </div>
        </div>
        <div className='newPost-menu-right'>
            <input
            type="file"
            id="file"
            name=""
            onChange={(e) => setFile(e.target.files[0])}
            />
            <label className="file" htmlFor="file">
                <AiOutlineUpload/>
            </label>
            <div className='uploadProgress'>
              {!uploading && percentage === 0 && image &&
              <img 
              src={image} 
              alt="" 
              className='postImage'
              onClick={() => !postState && handleDeleteImage(image)}
              />}
              {uploading && <div>{uploading}</div>}
              {percentage > 0 && percentage < 100 && 
              <div className='progress'>
                <div style={{width: `${percentage}%`}} className='percentage'>{percentage.toFixed(0)}%</div>
              </div>}
            </div>
            <button onClick={e => handleSubmit(e)}>Publish</button>
        </div>
    </div>
</div>
)}

export default NewPost