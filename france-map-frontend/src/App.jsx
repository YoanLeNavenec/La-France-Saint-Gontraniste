import './App.css'
import { Routes, Route} from 'react-router-dom'
import FranceMap from './components/FranceMap'
import AdminPanel from './components/AdminPanel'
import LoginPage from './components/LoginPage'

function App() {
  return(
    <Routes>
      <Route path="/" element={<FranceMap/>}/>
      <Route path="/login" element={<LoginPage/>}/>
      <Route path="/admin" element={<AdminPanel />}/>
    </Routes>
  )
}

export default App
