import type { FC } from "react";
import { Link } from "react-router-dom";

const BlogList: FC = () => {
  const blogs = [
    {
      id: 1,
      title: "Blog 1",
      content: "Content of blog 1",
      thumbnail: "https://via.placeholder.com/150",
    },
    {
      id: 2,
      title: "Blog 2",
      content: "Content of blog 2",
      thumbnail: "https://via.placeholder.com/150",
    },
  ];

  return (
    <>
      <h1>Blog List</h1>
      {blogs.map((blog) => (
        <div key={blog.id}>
          <Link to={`/blog/${blog.id}`}>{blog.title}</Link>
          <p>{blog.content}</p>
          <img src={blog.thumbnail} alt={blog.title} />
        </div>
      ))}
    </>
  )
}

export default BlogList;