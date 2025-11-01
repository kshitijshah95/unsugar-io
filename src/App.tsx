import type { FC } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from '@pages/Home'
import BlogList from '@pages/BlogList'
import BlogPage from '@pages/BlogPage'
import NavBar from '@components/NavBar'
import '@styles/App.css'

const App: FC = () => {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<BlogList />} />
        <Route path="/blog/:id" element={<BlogPage />} />
      </Routes>
    </>
  )
}

export default App;
