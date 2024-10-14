import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import TranslateJsonPage from './TranslateJsonPage'

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<TranslateJsonPage/>}></Route>
    </Routes>
  </BrowserRouter>
  )
}

export default App
