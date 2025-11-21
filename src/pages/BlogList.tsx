import { useState, useEffect, type FC } from 'react';
import { Link } from 'react-router-dom';
import Card from '@/ui-kit/Card';
import { blogService } from '@/services/blogService';
import type { Blog } from '@/types/blog';
import './BlogList.css';

const BlogList: FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const data = await blogService.getAllBlogs();
        setBlogs(data);
      } catch (err) {
        setError('Failed to load blogs. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div className="blog-list-container">
        <div className="loading-state">
          <div className="spinner" aria-label="Loading blogs"></div>
          <p>Loading blogs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="blog-list-container">
        <div className="error-state" role="alert">
          <h2>Oops! Something went wrong</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-list-container">
      <h2 className="blog-list-title">Latest Articles</h2>
      <div className="blog-grid">
        {blogs.map((blog) => (
          <Card key={blog.id} className="blog-card">
            <Link to={`/blog/${blog.id}`} className="blog-card-link">
              <div className="blog-thumbnail">
                <img 
                  src={blog.thumbnail} 
                  alt={`${blog.title} cover image`}
                  loading="lazy"
                />
              </div>
              <Card.Body>
                <div className="blog-meta">
                  <time dateTime={blog.publishedDate} className="blog-date">
                    {new Date(blog.publishedDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                  <span className="blog-read-time">{blog.readTime}</span>
                </div>
                <h3 className="blog-title">{blog.title}</h3>
                <p className="blog-excerpt">{blog.excerpt}</p>
                <div className="blog-tags">
                  {blog.tags.map((tag) => (
                    <span key={tag} className="blog-tag">{tag}</span>
                  ))}
                </div>
              </Card.Body>
              <Card.Footer>
                <div className="blog-author">
                  <span>By {blog.author}</span>
                </div>
              </Card.Footer>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BlogList;