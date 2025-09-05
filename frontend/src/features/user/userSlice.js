import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: null
}

const userSlice = createSlice({
    name: 'userSlice',
    initialState,
    reducers:{

    }
})

export default userSlice.reducer