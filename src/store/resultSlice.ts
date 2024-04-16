import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    resultData: null
}

const resultSlice = createSlice({
    name:'result',
    initialState,
    reducers: {
        passResult: (state, action) =>{
            state.resultData = action.payload
        }
    }
})

export const { passResult } = resultSlice.actions;
export default resultSlice.reducer;