import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios"
import { url, setHeaders } from "./api";
import jwtDecode from "jwt-decode"

const initialState = {
    token: localStorage.getItem("token"),//check local storage for token, buitl in JS object
    name: "",
    email: "",
    _id: "",
    registerStatus: "",//pending, fullfilled, or reject
    registerError: "",
    loginStatus: "",
    loginError: "",
    userLoaded: false,
};

//action creator --> performs http request to backend, register user, get back token, then should be avaialble to action.payload, in case error you also add to pay;oad
export const registerUser = createAsyncThunk(
    "auth/registerUser",
    async (values, {rejectWithValue}) => {
        try{//handle error, http request a call to backend
            const token = await axios.post(`${url}/register`, {
                name: values.name,
                email: values.email,
                password: values.password,
            });

            localStorage.setItem("token", token.data);

            return token.data;
        }
        catch(err) {
            console.log(err.response.data);
            return rejectWithValue(err.response.data);
        }

    }
);

export const loginUser = createAsyncThunk(
    "auth/loginUser", //name is for dispatched action
    async (values, {rejectWithValue}) => {
        try{//handle error, http request a call to backend 
            const token = await axios.post(`${url}/login`, { //<-- http request 
                email: values.email,
                password: values.password,
            });

            localStorage.setItem("token", token.data);

            return token.data;
        }
        catch(err) {
            console.log(err.response);
            return rejectWithValue(err.response.data);
        }

    }
);

export const getUser = createAsyncThunk(
    "auth/getUser",
    async (id, { rejectWithValue }) => {
      try {
        const token = await axios.get(`${url}/user/${id}`, setHeaders());
  
        localStorage.setItem("token", token.data);
  
        return token.data;
      } catch (error) {
        console.log(error.response);
        return rejectWithValue(error.response.data);
      }
    }
  );


const authSlice = createSlice(
    {
        name: "auth",
        initialState,
        reducers: {
            loadUser(state, action){
                const token = state.token //state has token bc can get from local storage

                if(token){
                    const user = jwtDecode(token)
                    return {
                        ...state,
                        token,
                        name: user.name,
                        email: user.email,
                        _id: user._id,
                        userLoaded: true,
                    };
                } else return {...state, userLoaded: true}
            },
            logoutUser(state, action){
                localStorage.removeItem("token")

                return {
                    ...state,
                    token: "",
                    name: "",
                    email: "",
                    _id: "",
                    registerStatus: "",//pending, fullfilled, or reject
                    registerError: "",
                    loginStatus: "",
                    loginError: "",
                    userLoaded: false,
                };
            },
        }, //we will be creating reducer and action will automatically created by redux toolkit
        extraReducers: (builder) => {
            builder.addCase(registerUser.pending, (state, action) => {
                return { ...state, registerStatus: "pending"};
            });
            builder.addCase(registerUser.fulfilled, (state, action) => {
                if(action.payload){
                    const user = jwtDecode(action.payload);

                    return{
                        ...state,
                        token: action.payload,
                        name: user.name,
                        email: user.email,
                        _id: user._id,
                        registerStatus: "success"
                    };
                }
                else return state;
            });
            builder.addCase(registerUser.rejected, (state, action) => {
                return {
                    ...state,
                    registerStatus: "rejected",
                    registerError: action.payload
                };
            });


            builder.addCase(loginUser.pending, (state, action) => {
                return { ...state, registerStatus: "pending"};
            });
            builder.addCase(loginUser.fulfilled, (state, action) => {
                if(action.payload){
                    const user = jwtDecode(action.payload);

                    return{
                        ...state,
                        token: action.payload,
                        name: user.name,
                        email: user.email,
                        _id: user._id,
                        registerStatus: "success"
                    };
                }
                else return state;
            });
            builder.addCase(loginUser.rejected, (state, action) => {
                return {
                    ...state,
                    loginStatus: "rejected",
                    loginError: action.payload
                };
            });


            builder.addCase(getUser.pending, (state,action) => {
                return {
                    ...state,
                    getUserStatus: "pending",
                };
            });
            builder.addCase(getUser.fulfilled, (state, action) => {
                if(action.payload) {
                    const user = jwtDecode(action.payload) //i think the action payload generates token
                    return {
                        ...state,
                        token: action.payload,
                        name: user.name,
                        email: user.email,
                        _id: user._id,
                        getUserStatus: "success",
                    };
                } else return state;
            });
            builder.addCase(getUser.rejected, (state,action) => {
                return {
                    ...state,
                    getUserStatus: "rejected",
                    getUserError: action.payload,
                };
            });
        },
    }//accepting object
);

export const {loadUser, logoutUser} = authSlice.actions

export default authSlice.reducer