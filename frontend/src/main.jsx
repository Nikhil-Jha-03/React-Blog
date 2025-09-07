import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './app/store.js'
import {ToastContainer} from 'react-toastify'



createRoot(document.getElementById('root')).render(
    <BrowserRouter>
      <Provider store={store}>
        <ToastContainer position="top-right" autoClose={3000} />
        <App />
      </Provider>
    </BrowserRouter>
)


//auth redux for signup and signin
