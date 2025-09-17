import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from '../../api/axios.js'

const initialState = {
    value: null
}

export const getCurrentUser = createAsyncThunk('user/getUser', async (props, { rejectWithValue }) => {
    try {
        const response = await api.get('/api/v1/user/getCurrentUser',
            {
                headers: {
                    Authorization: `Bearer ${props}`
                }
            }
        )

        if (!response.data.success) {
            localStorage.removeItem('Token')
            return rejectWithValue(response.data.message);
        }

        return response.data;

    } catch (error) {
        localStorage.removeItem('Token')
        return rejectWithValue(error.response?.data?.message);
    }
})


const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder.
            addCase(getCurrentUser.fulfilled, (state, action) => {
                console.log("HERE")
                state.value = action.payload.user
            })
            .addCase(getCurrentUser.rejected, (state, action) => {
                console.log("HERE 2")
                state.value = null
            })
    }
})

export default userSlice.reducer;



// handle the error when user deleted from the user should not be signin