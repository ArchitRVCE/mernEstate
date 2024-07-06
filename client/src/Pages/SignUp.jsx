import React, { useState } from 'react'
import {Link,useNavigate} from 'react-router-dom'
const SignUp = () =>{
  const [formData,setformData] = useState({});
  const [error,setError] = useState('');
  const [loading,setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) =>{
    setformData({...formData,[e.target.id]:e.target.value})
    console.log(formData)
  }
  const handleSubmit = async(e) =>{
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch("/api/auth/signup",{
        method: "post",
        headers: {
          "Content-Type":"application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if(data.success === false){
        setError(data.message);
        setLoading(false);
        return
      }
      setError(null);
      setLoading(false);
      navigate("/sign-in")
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  }
  return (
    <>
     <div className='p-3 max-w-lg mx-auto'> 
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <input type='text' className='border p-3 rounded-lg' placeholder='Username' id='username' onChange={handleChange}/>
        <input type='email' className='border p-3 rounded-lg' placeholder='Email' id='email' onChange={handleChange}/>
        <input type='password' className='border p-3 rounded -lg' placeholder='Password' id='password' onChange={handleChange}/>
        <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>{loading ? 'Loading': 'Sign Up'}</button>
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Have an account?</p>
        <Link to={'/sign-in'}>
          <span className='text-blue-700'>Sign In</span>
        </Link>
      </div>
      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
    </>
  )
}

export default SignUp
