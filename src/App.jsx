import React from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import ChatIt from './Components/chat-it'
import Home from './Components/Home'
import Login from './Components/login'
import Questions from './Components/Questions'
import TimeTable from './Components/time-table'
import Pdf from './Components/pdf-summarizer'
import Fc from './Components/flashCards'
import Motivator from './Components/Motivator'

const App = () => {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/chatit" element={<ChatIt />} />
        <Route path="/questions" element={<Questions />} />
        <Route path="/timetable" element={<TimeTable />} />
        <Route path="/pdf" element={<Pdf />} />
        <Route path="/fcards" element={<Fc />} />
        <Route path="/motivator" element={<Motivator />} />
      </Routes>
    </div>
  )
}

export default App