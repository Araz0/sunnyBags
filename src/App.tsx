import styled from '@emotion/styled'
import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 10px;
`

function App() {
  const [showNotification, setShowNotification] = useState(true)
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<>home</>} />
        <Route path="about" element={<>about page</>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
