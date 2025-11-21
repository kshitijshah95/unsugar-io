export interface Blog {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  publishedDate: string;
  readTime: string;
  tags: string[];
  thumbnail: string;
  content?: string;
}

export interface BlogsResponse {
  success: boolean;
  count: number;
  data: Blog[];
}

export interface BlogResponse {
  success: boolean;
  data: Blog;
}
