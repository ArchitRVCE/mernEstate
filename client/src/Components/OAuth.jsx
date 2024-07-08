import React from 'react'
import {useNavigate} from 'react-router-dom'
import {getAuth, GoogleAuthProvider, signInWithPopup} from 'firebase/auth'
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInStart,signInSuccess } from '../features/User/UserSlice';

const OAuth = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleGoogleClick = async() =>{
        try {
            dispatch(signInStart());
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app); //app from firebase setup

            const result = await signInWithPopup(auth,provider); //data from sign in user like email photoURL, full name
            console.log(result);
            const res = await fetch("/api/auth/google",{
                method: "POST",
                headers:{
                    'Content-Type':'application/json',
                },
                body: JSON.stringify({name:result.user.displayName,email:result.user.email,photo:result.user.photoURL}),
            });
            const data = await res.json();
            dispatch(signInSuccess(data));
            navigate("/");
        } catch (error) {
            console.log('Cannot sign in with Google',error.message);
        }
    }
  return (
    <button onClick={handleGoogleClick} type='button' className='bg-red-700 uppercase text-white p-3 rounded-lg hover:opacity-95'>Continue with Google</button>
  )
}

export default OAuth
