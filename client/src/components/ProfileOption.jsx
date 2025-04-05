import React from 'react'
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom'
import { signoutFailed, signoutSuccess } from '../redux/user/userSlice';
import { ToastContainer, toast } from 'react-toastify';
import { clearSavedListing } from '../redux/saveListing/saveListingSlice';
import { FaBookmark, FaSignOutAlt, FaUser } from 'react-icons/fa';

const ProfileOption = ({ user }) => {
    const dispatch = useDispatch();

    const handleLogOut = async () => {
        try {
          const res = await fetch('/api/auth/signout', {
            method: 'POST',
            credentials: 'include', // Important to clear cookie
          });
      
          if (res.ok) {
            dispatch(signoutSuccess());
            dispatch(clearSavedListing());
            toast.success('You have been logged out.', { autoClose: 2000 });
          } else {
            const data = await res.json();
            dispatch(signoutFailed(data.message));
            toast.error(data.message, { autoClose: 2000 });
          }
        } catch (error) {
          dispatch(signoutFailed(error.message));
          toast.error(error.message, { autoClose: 2000 });
        }
      };
      




    return (
        <div className="flex-none gap-2">
            <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-ghost btn-circle avatar hover:outline-0 hover:border-0">
                    <div className="w-7 rounded-full">
                    <img
  className="rounded-full border border-brand-blue/20 h-8 w-8 object-cover"
  src={
    user?.avatar
      ? user.avatar.startsWith('http')
        ? user.avatar
        : `${import.meta.env.VITE_SERVER_URL}${user.avatar}`
      : '/default-avatar.png'
  }
  alt="profile"
/>


                    </div>
                </label>
                <ul tabIndex={0} className="mt-3 z-[999999999] bg-[#fff] font-heading p-2 shadow menu menu-sm dropdown-content rounded-md w-52 ">
                    <li>
                        <Link to={'/profile'} className="justify-start text-brand-blue hover:text-brand-blue">
                            <FaUser className='text-brand-blue' /> Profile
                        </Link>
                    </li>
                    <li>
                        <Link to={"/saved_listing"} className='hover:text-brand-blue'>
                            <FaBookmark className='text-amber-500' /> Saved Listings
                        </Link>
                    </li>
                    <li onClick={handleLogOut}>
                        <Link className='hover:text-brand-blue'>
                            <FaSignOutAlt className='text-red-500' /> Logout
                        </Link>
                    </li>
                </ul>
            </div>
            <ToastContainer />
        </div>
    )
};

export default ProfileOption;