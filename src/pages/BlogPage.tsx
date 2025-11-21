import { useState, useEffect, type FC } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CustomMarkdown } from '@components/common/CustomMarkdown';
import { blogService } from '@/services/blogService';
import type { Blog } from '@/types/blog';
import './BlogPage.css';

const BlogPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const data = await blogService.getBlogById(id);
        setBlog(data);
      } catch (err) {
        setError('Blog post not found.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  if (loading) {
    return (
      <div className="blog-page-container">
        <div className="loading-state">
          <div className="spinner" aria-label="Loading blog post"></div>
          <p>Loading article...</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="blog-page-container">
        <div className="error-state" role="alert">
          <h1>Article Not Found</h1>
          <p>{error || 'The article you are looking for does not exist.'}</p>
          <Link to="/" className="back-link">← Back to all articles</Link>
        </div>
      </div>
    );
  }

  return (
    <article className="blog-page-container">
      <Link to="/" className="back-link">← Back to all articles</Link>

      <header className="blog-header">
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

        <h1 className="article-title">{blog.title}</h1>

        <div className="blog-author-info">
          <span className="author-name">By {blog.author}</span>
        </div>

        <div className="blog-tags">
          {blog.tags.map((tag) => (
            <span key={tag} className="blog-tag">{tag}</span>
          ))}
        </div>
      </header>

      {blog.thumbnail && (
        <div className="blog-featured-image">
          <img src={blog.thumbnail} alt={`${blog.title} featured image`} loading="eager" />
        </div>
      )}

      <div className="blog-content">
        {blog.content && <CustomMarkdown content={blog.content} />}
      </div>
    </article>
  );
};

export default BlogPage;