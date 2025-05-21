import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Home from './pages/Home'
import CurrentTimeOff from './pages/CurrentTimeOff'
import { Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar'


function App() {
  
  return (
    <>
      <NavBar />
      <main className='main-container'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/current-timeoff' element={<CurrentTimeOff />} />
        </Routes>
      </main>
    </>
  )
}

export default App