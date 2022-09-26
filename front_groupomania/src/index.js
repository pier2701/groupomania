import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.scss';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import { configureStore } from "@reduxjs/toolkit"
import rootReducer from "./reducers";
import { applyMiddleware } from "redux";
import thunkMiddleware from 'redux-thunk'
import { composeWithDevTools } from "redux-devtools-extension";

const middleware = [thunkMiddleware];
const middlewareEnhancer = applyMiddleware(...middleware)
// on met en place le "store"
const store = configureStore({
  reducer: rootReducer,
  composeWithDevTools,
  middlewareEnhancer,
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
