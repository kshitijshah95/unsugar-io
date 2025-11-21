import { useMemo, type FC } from 'react';
import markdownit from 'markdown-it';
import parse, { type HTMLReactParserOptions } from 'html-react-parser';
import DOMPurify from 'dompurify';
import '@styles/components/common/CustomMarkdown.css';

/*
  Convert markdown to HTML
*/
const convertMarkdownToHTML = (markdown: string) => {
  try {
    const md = markdownit({
      html: false,
      linkify: true,
      typographer: true,
      breaks: true,
    });
    return md.render(markdown);
  } catch (error) {
    console.error('Markdown conversion error:', error);
    return '<p>Error rendering content</p>';
  }
};

/*
  Sanitize HTML
*/
const sanitizeHTML = (html: string) => {
  const config = {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li', 'a', 'code', 'pre', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'hr', 'table', 'thead', 'tbody', 'tr', 'th', 'td'],
    ALLOWED_ATTR: ['href', 'class', 'id'],
    ALLOWED_URI_REGEXP: /^https?:\/\//,
  };
  const purify = DOMPurify.sanitize(html, config);
  return purify;
};

/*
  Convert HTML to React
*/
const convertHTMLToReact = (html: string) => {
  const options: HTMLReactParserOptions = {};
  const parser = parse(html, options);
  return parser;
};

interface CustomMarkdownProps {
  content: string;
}

export const CustomMarkdown: FC<CustomMarkdownProps> = ({ content }) => {
  const reactContent = useMemo(() => {
    const htmlContent = convertMarkdownToHTML(content);
    const sanitizedHTML = sanitizeHTML(htmlContent);
    return convertHTMLToReact(sanitizedHTML);
  }, [content]);

  return (
    <div className="markdown-content">
      {reactContent}
    </div>
  );
};