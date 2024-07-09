import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    currentUser: null,
    loading: false,
    error: null
}
const userSlice = createSlice({
    name: "user",
    initialState,
    reducers:{
        signInStart:(state)=>{
            state.loading = true;
        },
        signInFailed:(state,action)=>{
            state.loading = false,
            state.error= action.payload;
        },
        signInSuccess:(state,action)=>{
            state.loading = false,
            state.error = null,
            state.currentUser = action.payload;
        },
        //updating
        updateStart:(state)=>{
            state.loading = true;
        },
        updateFailed:(state,action)=>{
            state.loading = false,
            state.error= action.payload;
        },
        updateSuccess:(state,action)=>{
            state.loading = false,
            state.error = null,
            state.currentUser = action.payload;
        },
    }
});

export const {signInFailed,signInStart,signInSuccess,updateStart,updateFailed,updateSuccess} = userSlice.actions
export default userSlice.reducer