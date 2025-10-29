import type { FC } from "react";
import { Link } from "react-router-dom";
import { CustomMarkdown } from "../common/components/CustomMarkdown";

const BlogList: FC = () => {
  const blogs = [
    {
      id: 1,
      title: "Blog 1",
      content: "# Blog 1\n\nThis is the content of **blog 1**",
      thumbnail: "https://via.placeholder.com/150",
    },
    {
      id: 2,
      title: "Blog 2",
      content: "## Blog 2\n\nThis is the content of **blog 2**",
      thumbnail: "https://via.placeholder.com/150",
    },
  ];

  return (
    <>
      <h1>Blog List</h1>
      {blogs.map((blog) => (
        <div key={blog.id}>
          <Link to={`/blog/${blog.id}`}>{blog.title}</Link>
          <img src={blog.thumbnail} alt={blog.title} />
          <CustomMarkdown content={blog.content} />
        </div>
      ))}
    </>
  )
}

export default BlogList;