import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ExplorePage, HomePage } from './pages'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="about" element={<>about page</>} />
        <Route path="explore" element={<ExplorePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
