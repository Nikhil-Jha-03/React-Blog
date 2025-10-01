import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../../api/axios'
import { ClockFading } from 'lucide-react'

const initialState = {
    success:false,
    loading: false,
    error: null,
    aiDescription: null
}

export const generateAiDescription = createAsyncThunk('blog/generateAiDescription', async ({ title, token }, { rejectWithValue }) => {

    try {
        const response = await api.post('api/v1/blog/generateAiDescription', { title }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        )
        if (!response.data) {
            return rejectWithValue(response.data)
        }
        return response.data;
    } catch (error) {
        return rejectWithValue("someting went wrong")
    }
})

export const publishBlog = createAsyncThunk('blog/publishBlog', async ({ data, token, type}, { rejectWithValue }) => {
console.log(type)
    try {
        const response = await api.post(`api/v1/blog/post-blog/?type=${type}`, { data }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        )
        console.log("first",response)
        if (!response.data) {
            return rejectWithValue(response.data)
        }
        return response.data;
    } catch (error) {
        return rejectWithValue("someting went wrong")
    }
})

const blogSlice = createSlice({
    name: "blog",
    initialState,
    reducers: {

    },

    extraReducers: (builder) => {
        builder
            .addCase(generateAiDescription.pending, (state, action) => {
                state.loading = true
            })
            .addCase(generateAiDescription.fulfilled, (state, action) => {
                state.loading = false
                state.error = null,
                    state.aiDescription = action.payload
            })
            .addCase(generateAiDescription.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload,
                    state.aiDescription = null
            })
    }
})

export default blogSlice.reducer;