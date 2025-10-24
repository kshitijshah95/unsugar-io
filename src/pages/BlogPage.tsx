import type { FC } from "react";
import { useParams } from 'react-router-dom'

const BlogPage: FC = () => {
  const { id } = useParams();
  return (
    <>
      <h1>Blog Page</h1>
      <p>Blog ID: {id}</p>
    </>
  )
}

export default BlogPage;