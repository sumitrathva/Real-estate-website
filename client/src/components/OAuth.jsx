import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { firebaseApp } from '../firebase.js';
import { useDispatch } from 'react-redux';
import { signinFailed, signinSuccess } from '../redux/user/userSlice.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const OAuth = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const handleGoogleSignIn = async () => {
        try {
            if (loading) return;
            setLoading(true);
            
            const auth = getAuth(firebaseApp);
            const provider = new GoogleAuthProvider();
    
            // Force Google to show account selection every time
            provider.setCustomParameters({ prompt: 'select_account' });
    
            const result = await signInWithPopup(auth, provider);
            const idToken = await result.user.getIdToken();

            // Send token to backend
            const res = await fetch('/api/auth/google-signin', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ idToken }),
            });
    
            const userData = await res.json();
    
            if (!res.ok) {
                toast.error(userData.message);
                dispatch(signinFailed(userData.message));
            } else {
                toast.success("Login successful!");
                dispatch(signinSuccess(userData));
                navigate('/home');
            }
    
        } catch (error) {
            console.error("Google Sign-In Error:", error);
        
            if (error.code === "auth/popup-closed-by-user") {
                toast.warn("Popup closed before completing sign-in. Please try again.");
            } else if (error.code === "auth/cancelled-popup-request") {
                toast.warn("Multiple popups opened. Please close and try again.");
            } else if (error.code === "auth/network-request-failed") {
                toast.error("Network error. Check your connection.");
            } else {
                toast.error("Authentication failed. Try again.");
            }
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <>
            <div>
                <p className='text-lg text-brand-blue font-heading font-bold text-center mt-3'>OR</p>
    
                <button
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    className={`group mt-3 h-12 px-6 border-2 border-gray-300 rounded-md transition duration-300 hover:border-brand-blue focus:bg-blue-50 active:bg-brand-blue w-full 
                    ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    <div className="relative flex items-center space-x-4 justify-center">
                        <img className="absolute left-0 w-5" alt="google logo" src="/icons/google-color.svg" />
                        <span className="block w-max font-semibold tracking-wide text-gray-700 text-sm transition duration-300 group-hover:text-brand-blue sm:text-base">
                            {loading ? 'Signing in...' : 'Continue with Google'}
                        </span>
                    </div>
                </button>
    
                <ToastContainer />
            </div>
        </>
    );
    
};

export default OAuth;
