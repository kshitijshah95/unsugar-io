import type { FC } from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import BlogList from './pages/BlogList'
import BlogPage from './pages/BlogPage'
import './App.css'

const App: FC = () => {
  return (
    <>
      <Link to="/">Unsugar.io</Link>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<BlogList />} />
        <Route path="/blog/:id" element={<BlogPage />} />
      </Routes>
    </>
  )
}

export default App;
