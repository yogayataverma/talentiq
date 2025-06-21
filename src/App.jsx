import './App.css'
import Dashboard from './components/Dashboard'
import RegisterLogin from './components/RegisterLogin'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Candidates from './components/Candidates'
import Employees from './components/Employees'
import Attendance from './components/Attendance'
import Leaves from './components/Leaves'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RegisterLogin />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<Navigate to="candidates" replace />} />
          <Route path="candidates" element={<Candidates />} />
          <Route path="employees" element={<Employees />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="leaves" element={<Leaves />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
