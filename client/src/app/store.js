import { configureStore,combineReducers } from "@reduxjs/toolkit";
import userReducer from "../features/User/UserSlice.js";
/*For redux persist */
import {persistReducer,persistStore} from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const rootReducer = combineReducers({
    user:userReducer
});

const persistConfig = {
    key: 'root',
    storage,
    version:1,
};

const persistedReducer = persistReducer(persistConfig,rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware({
            serializableCheck: false,
        })
    
    })

/*
const store = configureStore({
    reducer: {
        user: userReducer,
    }
    })
    export default store
    */
export const persistor = persistStore(store);