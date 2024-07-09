import React,{useEffect, useRef, useState} from 'react'
import {getDownloadURL, getStorage,ref, uploadBytesResumable} from 'firebase/storage'
import {app} from '../firebase.js'
import { updateFailed,updateStart,updateSuccess } from '../features/User/UserSlice.js'
import { useSelector,useDispatch } from 'react-redux'

function Profile() {
  const {currentUser} = useSelector(state=>state.user);
  const fileRef = useRef(null);
  const [file,setFile] = useState(undefined);
  const [filePrec,setFilePerc] = useState(0);
  const [fileUploadError,setFileUploadError] = useState(false);
  const [formData,setFormData] = useState({});
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
        <button className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-80 disabled:opacity-80'>Update</button>
      </form>
      <div className='flex justify-between mt-5'>
        <span className='text-red-700 cursor-pointer'>Delete Account</span>
        <span className='text-red-700 cursor-pointer'>Sign Out</span>
      </div>
    </div>
  )
}

export default Profile