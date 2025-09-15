import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from '../../api/axios.js'

const initialState = {
    value: null
}

export const getCurrentUser = createAsyncThunk('user/getUser', async (props) => {
    try {
        const response = await api.get('/api/v1/user/getCurrentUser',
            {
                headers: {
                    Authorization: `Bearer ${props}`
                }
            }
        )

        return response.data;

    } catch (error) {
        console.log(error)
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
                state.value = action.payload.user
            })
            .addCase(getCurrentUser.rejected, (state, action) => {
                state.value = null
            })
    }
})

export default userSlice.reducer;