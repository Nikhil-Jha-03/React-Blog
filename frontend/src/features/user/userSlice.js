import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from '../../api/axios.js'
import { toast } from "react-toastify";

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
                console.log("running")
                toast.success("Done")
                state.value = action.payload.user
            })
            .addCase(getCurrentUser.rejected, (state, action) => {
                console.log("rejected")
                state.value = null
                toast.success("Noooo")

            })
    }
})

export default userSlice.reducer;