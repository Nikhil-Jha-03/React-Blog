import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../../api/axios'

const initialState = {
    value: [],
    success: false,
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

export const publishBlog = createAsyncThunk('blog/publishBlog', async ({ formData, token }, { rejectWithValue }) => {
    try {
        const response = await api.post(`api/v1/blog/post-blog`, formData, {
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

export const getAllBlog = createAsyncThunk('blog/getAllBlog', async ({ token}, { rejectWithValue }) => {
    try {
        const response = await api.get(`api/v1/blog`, {
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

export const getCategory = createAsyncThunk('blog/getCategory', async ({ token }, { rejectWithValue }) => {
    try {
        const response = await api.get(`api/v1/blog/get-category`, {
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
            .addCase(publishBlog.fulfilled, (state, action) => {
                state.success = action.payload.message
            })
            .addCase(publishBlog.rejected, (state, action) => {
                state.error = action.payload.message
            })
            .addCase(getAllBlog.fulfilled, (state, action) => {
                state.success = action.payload.success
                state.value = action.payload.blog
            })
            .addCase(getAllBlog.rejected, (state, action) => {
                state.error = action.payload.message
            })
    }
})

export default blogSlice.reducer;