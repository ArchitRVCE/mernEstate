import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/User/UserSlice.js";

const store = configureStore({
    reducer: {
        user: userReducer,
    }
})

export default store