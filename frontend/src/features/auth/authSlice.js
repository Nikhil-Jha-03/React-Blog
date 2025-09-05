import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoggedIn: false,
    token: null,
    isLoading: false,
    error: null
}

const authSlice = createSlice({
    name: 'userauthSliceSlice',
    initialState,
    reducers: {

    }
})

export default authSlice.reducer