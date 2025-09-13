import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import UserReducer from '../features/user/userSlice'

export const store = configureStore({
    reducer:{
        auth:authReducer,
        user:UserReducer
    }
})