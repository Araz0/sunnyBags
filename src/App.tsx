import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CategoryPage, ExplorePage, HomePage, ItemPage } from './pages'

// Studio is a private tool — load it on demand so shop visitors don't download it.
const lazyNamed = <T extends string>(load: () => Promise<Record<T, React.ComponentType>>, name: T) =>
  React.lazy(() => load().then((m) => ({ default: m[name] })))

const StudioLayout = lazyNamed(() => import('./studio/ui/StudioLayout'), 'StudioLayout')
const StudioDashboard = lazyNamed(() => import('./studio/pages/StudioDashboard'), 'StudioDashboard')
const StudioCalendar = lazyNamed(() => import('./studio/pages/StudioCalendar'), 'StudioCalendar')
const StudioQueue = lazyNamed(() => import('./studio/pages/StudioQueue'), 'StudioQueue')
const StudioLibrary = lazyNamed(() => import('./studio/pages/StudioLibrary'), 'StudioLibrary')
const StudioSettings = lazyNamed(() => import('./studio/pages/StudioSettings'), 'StudioSettings')
const StudioConnections = lazyNamed(() => import('./studio/pages/StudioConnections'), 'StudioConnections')
const StudioInsights = lazyNamed(() => import('./studio/pages/StudioInsights'), 'StudioInsights')
const StudioGuide = lazyNamed(() => import('./studio/pages/StudioGuide'), 'StudioGuide')
const ItemStudio = lazyNamed(() => import('./pages/ItemStudio'), 'ItemStudio')

function App() {
  return (
    <BrowserRouter>
      <React.Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="about" element={<>about page</>} />
          <Route path="explore" element={<ExplorePage />} />
          <Route path="category/:categoryId" element={<CategoryPage />} />
          <Route path="item/:itemId" element={<ItemPage />} />

          {/* Content studio */}
          <Route element={<StudioLayout />}>
            <Route path="studio" element={<StudioDashboard />} />
            <Route path="studio/calendar" element={<StudioCalendar />} />
            <Route path="studio/queue" element={<StudioQueue />} />
            <Route path="studio/library" element={<StudioLibrary />} />
            <Route path="studio/settings" element={<StudioSettings />} />
            <Route path="studio/connections" element={<StudioConnections />} />
            <Route path="studio/insights" element={<StudioInsights />} />
            <Route path="studio/guide" element={<StudioGuide />} />
            <Route path="item/:itemId/studio" element={<ItemStudio />} />
          </Route>
        </Routes>
      </React.Suspense>
    </BrowserRouter>
  )
}

export default App
