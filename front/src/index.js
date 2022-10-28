import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.scss';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import { configureStore } from "@reduxjs/toolkit"
import rootReducer from "./reducers";
import thunk from 'redux-thunk'
//import logger from 'redux-logger'
import { composeWithDevTools } from "redux-devtools-extension";
import { getUsers } from './actions/users.actions';
import { getPosts } from './actions/post.actions';

// on met en place le "store"
const store = configureStore({
  reducer: rootReducer,
  composeWithDevTools,
  middleware: [thunk]
});

// on met à disposition les "user"
store.dispatch(getUsers());

// on met à disposition les "post"
store.dispatch(getPosts());

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // le "store" deviendra un "prop" du <Provider />
  <Provider store={store}>
    <App />
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
