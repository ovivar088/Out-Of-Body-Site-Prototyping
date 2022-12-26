import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

//From redux toolkit
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";

import productsReducer, { productsFetch } from './features/productsSlice';
import  { productsApi } from './features/productsApi';
import cartReducer, { getTotals } from "./features/cartSlice";
import authReducer from './features/authSlice';

const store = configureStore({
  //passing object acts as a centeral place for our application state
  reducer:{
    products: productsReducer,
    cart: cartReducer,
    auth: authReducer,
    [productsApi.reducerPath]: productsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
     getDefaultMiddleware().concat(productsApi.middleware), //automatic return without {}
});

store.dispatch(productsFetch()); //will dispatch our action creator, for fetching data using Asyncthunk
store.dispatch(getTotals());
//store.dispatch(loadUser(null));

//const root = ReactDOM.createRoot(document.getElementById('root'));
ReactDOM.render(
  <React.StrictMode>
    <Provider store = {store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

