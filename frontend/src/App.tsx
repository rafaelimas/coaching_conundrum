import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import AvailabilityEditor from './pages/AvailabilityEditor'
import BookCoach from './pages/BookCoach'
import Home from "./pages/Home"
import CoachBookings from "./pages/CoachBookings"
import StudentBookings from "./pages/StudentBookings"

export default function App() {
  return (
    <>
      <div><p><a href="/">Home</a></p></div>
      <Router>
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/edit-availability" element={<AvailabilityEditor/>}/>            
            <Route path="/book-coach" element={<BookCoach/>}/>            
            <Route path="/bookings/coaches" element={<CoachBookings/>}/>
            <Route path="/bookings/students/:studentId?" element={<StudentBookings/>}/>
        </Routes>
      </Router>
    </>
  )
}