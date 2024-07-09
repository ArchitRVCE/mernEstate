import React,{useEffect, useRef, useState} from 'react'
import {getDownloadURL, getStorage,ref, uploadBytesResumable} from 'firebase/storage'
import {app} from '../firebase.js'
import { deleteFailed, deleteStart, deleteSuccess, signoutFailed, signoutStart, signoutSuccess, updateFailed,updateStart,updateSuccess } from '../features/User/UserSlice.js'
import { useSelector,useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

function Profile() {
  const navigate = useNavigate();
  const {currentUser,loading,error} = useSelector(state=>state.user);
  const fileRef = useRef(null);
  const [file,setFile] = useState(undefined);
  const [filePrec,setFilePerc] = useState(0);
  const [fileUploadError,setFileUploadError] = useState(false);
  const [formData,setFormData] = useState({});
  const [updateSuccessState,setupdateSucccess] = useState(false);
  const dispatch = useDispatch()
  useEffect(()=>{
    if(file)  handleFileUpload(file);
  },[file])
  const handleFormData = (e) =>{
    setFormData({...formData,[e.target.id]:e.target.value});
  }
  const handleFileUpload = (file) =>{
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage,fileName);
      const uploadTask = uploadBytesResumable(storageRef,file);

      uploadTask.on(
        'state_changed',
        (snapshot)=>{
          const progress =
          (snapshot.bytesTransferred/snapshot.totalBytes)*100;
          setFilePerc(Math.round(progress));
        },
        (error)=>{
          setFileUploadError(true);
        },
        ()=>{
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>
            setFormData({...formData,avatar:downloadURL})
          );
        });
  }
  const handleSignOut = async() =>{
    try {
      dispatch(signoutStart());
      const data = await fetch('/api/auth/signout')
      const res = await data.json();
      if(res.success === false){
        dispatch(signoutFailed(res.message));
        return
      }
      dispatch(signoutSuccess());
      navigate("/sign-in");
    } catch (error) {
      dispatch(signoutFailed(error.message));
    }
  }
  const handleDeleteAccount = async() =>{
    try {
      dispatch(deleteStart());
      const data = await fetch(`/api/user/delete/${currentUser._id}`,{
        method:'DELETE'
      });
      const res = await data.json();
      if(res.success===false){
        dispatch(deleteFailed(res.message));
        return;
      }
      dispatch(deleteSuccess());
      navigate("/sign-in");
    } catch (error) {
      dispatch(deleteFailed(error.message))
    }
  }
  const handleUpdate = async(e) => {
    e.preventDefault();
    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`,{
        method: "POST",
        //credentials: 'include',
        headers:{
          'Content-Type':'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if(data.success===false){
        dispatch(updateFailed(data.message))
        return;
      }
      dispatch(updateSuccess(data));
      setupdateSucccess(true)
    } catch (error) {
        dispatch(updateFailed(error.message))
    }

  }
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form onSubmit={handleUpdate} className='flex flex-col gap-4'>
        <input onChange={(e)=>setFile(e.target.files[0])} ref={fileRef} hidden type="file" accept='image/*'/>
        <img onClick={()=>{fileRef.current.click()}} src={formData.avatar || currentUser.avatar} alt='profile' className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'/>
        <p className='text-sm self-center'>
          {fileUploadError ? (
            <span className='text-red-700'>
              Error Image upload (image must be less than 2 mb)
            </span>
          ) : filePrec > 0 && filePrec < 100 ? (
            <span className='text-slate-700'>{`Uploading ${filePrec}%`}</span>
          ) : filePrec === 100 ? (
            <span className='text-green-700'>Image successfully uploaded!</span>
          ) : (
            ''
          )}
        </p>
        <input type="text" placeholder='Username' id="username" defaultValue={currentUser.username} className='border p-3 rounder-lg' onChange={handleFormData}/>
        <input type="email" placeholder='Email' id="email" defaultValue={currentUser.email} className='border p-3 rounder-lg' onChange={handleFormData}/>
        <input type="password" placeholder='Password' id="password" className='border p-3 rounder-lg' onChange={handleFormData}/>
        <button disabled={loading} className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-80 disabled:opacity-80'>{loading?'Loading...':'Update'}</button>
      </form>
      <div className='flex justify-between mt-5'>
        <span className='text-red-700 cursor-pointer' onClick={handleDeleteAccount}>Delete Account</span>
        <span className='text-red-700 cursor-pointer' onClick={handleSignOut}>Sign Out</span>
      </div>
      <p className='text-red-600 mt-5 text-center'>{error?error:''}</p>
      <p className='text-green-600 mt-5 text-center'>{updateSuccessState?'Updated Succefully':''}</p>
    </div>
  )
}

export default Profile