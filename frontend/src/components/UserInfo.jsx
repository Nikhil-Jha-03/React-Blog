import React, { useState } from 'react'
import { User } from 'lucide-react'
import { Link } from 'react-router-dom'
import { logout } from '../features/auth/authSlice'
import { useDispatch, useSelector } from 'react-redux'
import Logout from './Logout'


const UserInfo = ({ ref, className }) => {
      const user = useSelector(state => state.user.value) || null;
    
    const dispatch = useDispatch();
    return (
        <div ref={ref} className={`border-gray-700 pt-4 mt-4 ${className} backdrop-blur-2xl bg-gray-900 p-4 rounded-2xl`}>
            <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center">
                    {/* {user?.avatar ? (
                        <img src={user.avatar} alt="User avatar" className="w-8 h-8 rounded-full object-cover" />
                    ) : ( */}
                        <User size={16} className="text-white" />
                    {/* )} */}
                </div>
                <div>
                    <p className="text-white font-medium text-sm">{user.name}</p>
                    <p className="text-gray-400 text-xs">{user.email}</p>
                </div>
            </div>

            <div className="space-y-2">
                <Link to={'/'} className='block text-gray-300 hover:text-white transition-colors"'>Profile</Link>
                <Link to={'/myblogs'} className='block text-gray-300 hover:text-white transition-colors"'>My Posts</Link>
                <Link to={'/'} className='block text-gray-300 hover:text-white transition-colors"'>Settings</Link>
                <Link to={'/blogupload'} className='block text-gray-300 hover:text-white transition-colors"'>Upload your Blog</Link>
                {!user?.isAccountVerified && <Link to={'/'} className='block text-gray-300 hover:text-white transition-colors"'>Verify Account</Link>}
                
                <Logout />
            </div>
        </div>


    )
}


export default React.memo(UserInfo);