import React,{useState} from 'react'
import { Link,useNavigate } from 'react-router-dom'
import { useDispatch,useSelector } from 'react-redux';
import { signInStart,signInFailed,signInSuccess } from '../features/User/UserSlice';

function SignIn() {
        const [formData,setformData] = useState({});
        const dispatch = useDispatch();
        const {loading,error} = useSelector((state)=>state.user);
        const navigate = useNavigate();
        const handleChange = (e) => {
          setformData({...formData,[e.target.id]:e.target.value});
        }
        const handleSubmit = async(e) =>{
          e.preventDefault();
          try {
            dispatch(signInStart())
            const res = await fetch("/api/auth/signin",{
              method: "post",
              headers: {
                "Content-Type":"application/json",
              },
              body: JSON.stringify(formData),
            });
            const data = await res.json();
            if(data.success === false){
              dispatch(signInFailed(data.message));
              return
            }
            dispatch(signInSuccess(data));
            navigate("/");
          } catch (error) {
            dispatch(signInFailed(error.message))
          }
        }
  return (
    <>
     <div className='p-3 max-w-lg mx-auto'> 
      <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <input type='email' className='border p-3 rounded-lg' placeholder='Email' id='email' onChange={handleChange}/>
        <input type='password' className='border p-3 rounded -lg' placeholder='Password' id='password' onChange={handleChange}/>
        <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>{loading ? 'Loading': 'Sign Up'}</button>
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Don't have a account?</p>
        <Link to={'/sign-up'}>
          <span className='text-blue-700'>Sign Up</span>
        </Link>
      </div>
      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
    </>
  )
}

export default SignIn
