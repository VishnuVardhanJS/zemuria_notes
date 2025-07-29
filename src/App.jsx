import './App.css'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Login from './pages/login/login'
import Home from './pages/home/home'
import PublicNote from './pages/publicNote/PublicNote'

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path='/notes' element={<Home />} />
           <Route path="/public/:id" element={<PublicNote />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
