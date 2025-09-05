import React from 'react'
import { Routes, Route } from 'react-router-dom'
import  AuthPage  from './pages/AuthPage';

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<AuthPage />}></Route>
    </Routes>
  )
}

export default App;
