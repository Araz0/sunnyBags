import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ExplorePage } from './pages'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<>home</>} />
        <Route path="about" element={<>about page</>} />
        <Route path="explore" element={<ExplorePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
