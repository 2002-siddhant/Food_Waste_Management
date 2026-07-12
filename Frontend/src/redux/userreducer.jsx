import {createSlice} from '@reduxjs/toolkit';

const userSlice = createSlice({
    name:"user",
    initialState:{isloggedin: !!localStorage.getItem("token")},
    reducers:{
        login:(state)=>{
            state.isloggedin = true
        },
        logout:(state)=>{
            state.isloggedin = false
        }
    }
});

export const{login, logout} = userSlice.actions;
export default userSlice.reducer;