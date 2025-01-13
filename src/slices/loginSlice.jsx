import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {postLogin, postLogout} from "../api/userApi.js";
import {getCookie, removeCookie, setCookie} from "../util/cookieUtil.jsx";

const initState = {
  email: ''
}

const loadMemberCookie = () => {
  return getCookie('user')
}

export const loginPostAsync = createAsyncThunk('loginPostAsync',(param)=>postLogin(param))
export const logoutPostAsync = createAsyncThunk('logoutPostAsync',()=>postLogout())

const loginSlice = createSlice({
  name: 'loginSlice',
  initialState: loadMemberCookie() || initState,
  reducers: {
    login: (state, action) => {
      console.log(`로그인 슬라이스 ${action.payload}`)
      return {email: action.payload.email}
    },
    logout: () => {

      removeCookie('user')
      return {...initState}
    }
  },
  extraReducers: (builder) => {
    builder.addCase(loginPostAsync.fulfilled,(state,action)=>{
      const payload = action.payload
      if(!payload.ERROR){
        setCookie("user",JSON.stringify(payload))
      }

      return payload
    })
    .addCase(logoutPostAsync.fulfilled,(state,action)=>{
      const payload = action.payload
      if(payload.data.success){
        removeCookie('user')
      }
      return {...initState}
    })
    .addCase(loginPostAsync.pending,(state,action)=>{
    })
    .addCase(loginPostAsync.rejected,(state,action)=>{
    })
  }
})

export const {login, logout} = loginSlice.actions

export default loginSlice.reducer