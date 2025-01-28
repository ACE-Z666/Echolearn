import React from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import ChatIt from './Components/chat-it'
import Home from './Components/Home'
import Login from './Components/login'
import SignUp from './Components/sign-up'
import Questions from './Components/Questions'
import TimeTable from './Components/time-table'
import Pdf from './Components/pdf-summarizer'
import Yt from './Components/yt-summarizer'
import Motivator from './Components/Motivator'





const App = () => {
  return (
  <div>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='signup' element={<SignUp/>}/>
      <Route path='login' element={<Login/>}/>
      <Route path='chatit' element={<ChatIt/>}>
       <Route path='questions' element={<Questions/>}></Route>
       <Route path='timetable' element={<TimeTable/>}></Route>
       <Route path='pdf' element={<Pdf/>}></Route>
       <Route path='yt' element={<Yt/>}></Route>
       <Route path='motivator' element={<Motivator />} ></Route>
      </Route>
     </Routes>

  </div>
  )
}

export default App
