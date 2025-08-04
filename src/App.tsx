import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CategoryPage, ExplorePage, HomePage, ItemPage } from './pages'


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="about" element={<>about page</>} />
        <Route path="explore" element={<ExplorePage />} />
        <Route path="category/:categorySlug" element={<CategoryPage />} />
        <Route path="item" element={<ItemPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
