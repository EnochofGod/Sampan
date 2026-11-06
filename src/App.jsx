import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

const Home = lazy(() => import('./pages/Home'))
const Courses = lazy(() => import('./pages/Courses'))
const CourseDetail = lazy(() => import('./pages/CourseDetail'))
const ApplicationForm = lazy(() => import('./pages/ApplicationForm'))
const Status = lazy(() => import('./pages/Status'))
const Privacy = lazy(() => import('./pages/Privacy'))
const Terms = lazy(() => import('./pages/Terms'))
const Admin = lazy(() => import('./pages/Admin'))

function PageFallback() {
  return (
    <div className="container-page py-16">
      <div className="surface-card mx-auto max-w-md p-8 text-center">
        <p className="text-sm font-medium text-ink-2">Loading page…</p>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen w-full flex-col bg-surface">
        <Navbar />
        <main className="w-full flex-1">
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/courses/:slug" element={<CourseDetail />} />
              <Route path="/apply" element={<ApplicationForm />} />
              <Route path="/status" element={<Status />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
