import { configureStore } from "@reduxjs/toolkit";
import userReducer from './userreducer.jsx'
const store = configureStore({
    reducer:{
        user:userReducer
    }
});

export default store;