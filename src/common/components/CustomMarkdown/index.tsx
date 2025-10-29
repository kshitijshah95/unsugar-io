import React from "react";
import markdownit from 'markdown-it'
import parse, { type HTMLReactParserOptions } from "html-react-parser";
import DOMPurify from "dompurify";
import "./styles.css";

interface CustomMarkdownProps {
  content: string;
}

const convertMarkdownToHTML = (markdown: string) => {
  const md = markdownit({
    html: false,
    linkify: true,
    typographer: true,
    breaks: true,
  })
  return md.render(markdown);
}

const sanitizeHTML = (html: string) => {
  const config = {
    // TODO: Sanitize HTML, add allowed tags and attributes
    // ALLOWED_TAGS: [], // only <P> and text nodes
    // ALLOWED_ATTR: [],
    ALLOWED_URI_REGEXP: /https?:\/\//,
  };
  const purify = DOMPurify.sanitize(html, config);
  return purify;
}

const convertHTMLToReact = (html: string) => {
  const options: HTMLReactParserOptions = {
    replace: (domNode) => {
      // TODO: Implement custom markdown to react conversion
      return null;
    }
  };
  const parser = parse(html, options);
  return parser;
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