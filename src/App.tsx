import type { FC } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from '@pages/Home'
import BlogList from '@pages/BlogList'
import BlogPage from '@pages/BlogPage'
import Auth from '@pages/Auth'
import AuthCallback from '@pages/AuthCallback'
import Profile from '@pages/Profile'
import NavBar from '@components/NavBar'
import Footer from '@components/Footer'
import ErrorBoundary from '@components/ErrorBoundary'
import { NotFoundError } from '@components/ErrorFallback'
import '@styles/App.css'

const App: FC = () => {
  return (
    <ErrorBoundary>
      <NavBar />
      <main>
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blog" element={<BlogList />} />
            <Route path="/blog/:id" element={<BlogPage />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NotFoundError />} />
          </Routes>
        </ErrorBoundary>
      </main>
      <Footer />
    </ErrorBoundary>
  );
};

export default App;
