import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import UserReducer from '../features/user/userSlice'
import BlogReducer from '../features/BlogPost/BlogSlice'

export const store = configureStore({
    reducer:{
        auth:authReducer,
        user:UserReducer,
        blog:BlogReducer
    }
})