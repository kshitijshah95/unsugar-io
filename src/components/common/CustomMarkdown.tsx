import React from "react";
import markdownit from 'markdown-it'
import parse, { type HTMLReactParserOptions } from "html-react-parser";
import DOMPurify from "dompurify";
import "@styles/components/common/CustomMarkdown.css";

/*
  Convert markdown to HTML
*/
const convertMarkdownToHTML = (markdown: string) => {
  const md = markdownit({
    html: false,
    linkify: true,
    typographer: true,
    breaks: true,
  })
  return md.render(markdown);
}

/*
  Sanitize HTML
*/
const sanitizeHTML = (html: string) => {
  const config = {
    ALLOWED_URI_REGEXP: /https?:\/\//,
  };
  const purify = DOMPurify.sanitize(html, config);
  return purify;
}

/*
  Convert HTML to React
*/
const convertHTMLToReact = (html: string) => {
  const options: HTMLReactParserOptions = {};
  const parser = parse(html, options);
  return parser;
}

interface CustomMarkdownProps {
  content: string;
}

export const CustomMarkdown: React.FC<CustomMarkdownProps> = ({ content }) => {
  const htmlContent = convertMarkdownToHTML(content);
  const reactContent = convertHTMLToReact(sanitizeHTML(htmlContent));

  return (
    <div className="markdown-content">
      {reactContent}
    </div>
  )
}