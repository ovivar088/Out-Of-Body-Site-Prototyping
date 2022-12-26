import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { url } from "./api";
import { toast } from "react-toastify";

const initialState = {
    items: [], 
    status: null,
    createStatus: null,
};

export const productsFetch = createAsyncThunk( //action creator
    "products/productsFetch",
    async() => {
        try {
            const response = await axios.get(`${url}/products`); //get from url/products getting all products
            console.log(response);//ADDED
            return response?.data;//? this will report an error incase we dont have a property data in reponse
        }
        catch(error) {
            console.log(error);
        }
    }
);

export const productsCreate = createAsyncThunk( //action creator
    "products/productsCreate",
    async(values) => { //values represents object coming in from submit form
        try {
      const response = await axios.post(`${url}/products`, values); //async action
      console.log(values);//ADDED
      return response.data;//? this will report an error incase we dont have a property data in reponse
        }
        catch(error) {
            console.log(error);
            toast.error(error.response?.data);
        }
    }
);

const productsSlice = createSlice({ 
    //a slice is logic containing reducers and actions, wont have different files for them
    name: "products",
    initialState,
    reducers: {}, //generate action creators
    extraReducers: {
        //State for getting Products, fetching products
        [productsFetch.pending]: (state, action) => {
            state.status = "pending";
        },
        [productsFetch.fulfilled]: (state, action) => {
            state.items = action.payload;
            state.status = "success";
        },
        [productsFetch.rejected]: (state, action) => {
            state.status = "rejected";
        },
        //States for creating products
        [productsCreate.pending]: (state, action) => {
            state.createStatus = "pending";
        },
        [productsCreate.fulfilled]: (state, action) => {
            state.items.push(action.payload); //push product from API to products
            state.createStatus = "success";
        }, 
        [productsCreate.rejected]: (state, action) => {
            state.createStatus = "rejected";
        },
    }, //only handle action types
});

export default productsSlice.reducer;