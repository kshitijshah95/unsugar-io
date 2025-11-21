import type { FC } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from '@pages/Home'
import BlogList from '@pages/BlogList'
import BlogPage from '@pages/BlogPage'
import NavBar from '@components/NavBar'
import Footer from '@components/Footer'
import '@styles/App.css'

const App: FC = () => {
  return (
    <>
      <NavBar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:id" element={<BlogPage />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
};

export default App;
