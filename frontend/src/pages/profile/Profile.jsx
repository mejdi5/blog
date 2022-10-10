import React, {useContext, useEffect, useState} from 'react'
import './Profile.css'
import {UserContext} from '../../context/UserContext'
import {useParams, useNavigate} from 'react-router-dom'
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { AiFillEdit } from 'react-icons/ai'
import { BiUndo } from 'react-icons/bi'
import { BsSaveFill } from 'react-icons/bs'
import { updateProfile, updateEmail} from "firebase/auth"
import { auth } from '../../firebase';
import { storage } from '../../firebase'
import { Axios } from '../../Axios';
import { confirmAlert } from 'react-confirm-alert'; 
import 'react-confirm-alert/src/react-confirm-alert.css';



const Profile = () => {

    const users = useContext(UserContext)
    const userId = useParams().id
    const profileUser = users?.find(user => user.id === userId)
    const [file, setFile] = useState(null)
    const [percentage, setPercentage] = useState(0)
    const [uploading, setUploading] = useState(null)
    const [username, setUsername] = useState(profileUser?.username)
    const [email, setEmail] = useState(profileUser?.email)
    const [editUsername, setEditUsername] = useState(false)
    const [editEmail, setEditEmail] = useState(false)
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    const handleEditUsername = async () => {
        try {
            await updateProfile(auth.currentUser, {
                displayName: username,
            })
            await Axios.put(`/users/${userId}`, {username})
            await Axios.get(`/users/${userId}`)
            window.location.reload()
        } catch (err) {
            console.log(err)
            setError(err.message)
        }
        setEditUsername(false)
    }

    const handleEditEmail = async () => {
        try {
            await updateEmail(auth.currentUser, email)
            await Axios.put(`/users/${userId}`, {email})
            await Axios.get(`/users/${userId}`)
            window.location.reload()
        } catch (err) {
            console.log(err)
            setError(err.message)
        }
        setEditEmail(false)
    }


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
        getDownloadURL(uploadTask.snapshot.ref).then(async downloadURL => {
            try {
                await updateProfile(auth.currentUser, {
                    photoURL: downloadURL
                })
                await Axios.put(`/users/${userId}`, {image: downloadURL})
                await Axios.get(`/users/${userId}`)
                window.location.reload()
            } catch (err) {
                setError(err.message)
            }
            setPercentage(0)
            setUploading(null)
        })})
        }
        file && uploadImage()
    }, [file])


    const handleDeleteUser = () => {
        confirmAlert({
            title: 'Delete Account',
            message: 'Do you really want to delete this account definitively ?',
            buttons: [
            {
                label: 'Yes',
                onClick: async() => {
                try {
                    if(profileUser?.image !== "https://media.istockphoto.com/vectors/profile-placeholder-image-gray-silhouette-no-photo-vector-id1016744004?k=20&m=1016744004&s=612x612&w=0&h=Z4W8y-2T0W-mQM-Sxt41CGS16bByUo4efOIJuyNBHgI=") {
                    //delete user image from firebase storage
                    await deleteObject(ref(storage, profileUser.image))
                    }
                    //delete user from firebase authentication
                    await auth.currentUser?.delete()
                    //delete user from database
                    await Axios.delete(`/users/${userId}`)
                    navigate('/')
                } catch (err) {
                    console.log(err)
                    setError(err.message)
                }}
            },
            {
                label: 'No',
            }
        ]
        });
    }; 



return (
<div className='profile'>
    <h2>Your Profile</h2>
    <div className='profile-wrapper'>
        <div className='profile-image'>
            <input
            type="file"
            id="file"
            onChange={e => setFile(e.target.files[0])}
            />
            <label htmlFor='file'>
                <img src={profileUser?.image}/>
            </label>
            <div className='uploadProgress'>
                {uploading && <div>{uploading}</div>}
                {percentage > 0 && percentage < 100 && 
                <div className='progress'>
                    <div style={{width: `${percentage}%`}} className='percentage'>{percentage.toFixed(0)}%</div>
                </div>}
            </div>
        </div>
        <div className='profile-info'>
            {!editUsername 
            ?
            <div>
                <span>{profileUser?.username}</span>
                <AiFillEdit color="green" className='icon' onClick={() => setEditUsername(true)}/>
            </div>
            :
            <div> 
                <input
                type="text"
                placeholder="new username.."
                value={username}
                onChange={e => setUsername(e.target.value)}
                />
                <div className='change-icons'>
                    <BsSaveFill className='icon' onClick={handleEditUsername}/>
                    <BiUndo className='icon' onClick={() => setEditUsername(false)}/>
                </div>
            </div>
            }
            {!editEmail
            ?
            <div>
                <span>{profileUser?.email}</span>
                <AiFillEdit color="green" className='icon' onClick={() => setEditEmail(true)}/>
            </div>
            :
            <div> 
                <input
                type="email"
                placeholder="new email.."
                value={email}
                onChange={e => setEmail(e.target.value)}
                />
                <div className='change-icons'>
                    <BsSaveFill className='icon' onClick={handleEditEmail}/>
                    <BiUndo className='icon' onClick={() => setEditEmail(false)}/>
                </div>
            </div>
            }
        </div>
    </div>
    <div className='error'>{error && error}</div>
    <div>
        <button className='delete-user' onClick={handleDeleteUser}>Delete</button>
    </div>
</div>
)}

export default Profile