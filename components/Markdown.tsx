import ReactMarkdown from "react-markdown";
import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";

interface MarkdownProps {
  content?: string;
  contentId?: number;
}

export function Markdown({ content, contentId }: MarkdownProps) {
  const [markdownContent, setMarkdownContent] = useState<string>(content || "");
  const [loading, setLoading] = useState<boolean>(!!contentId && !content);

  useEffect(() => {
    if (contentId && !content) {
      // Simple fetch directly from public directory
      fetch(`/markdown/learn/${contentId}.md`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Failed to load: ${response.status}`);
          }
          return response.text();
        })
        .then((text) => {
          setMarkdownContent(text);
          setLoading(false);
        })
        .catch((error) => {
          console.error(`Error loading content for ID ${contentId}:`, error);
          setMarkdownContent("Content not available.");
          setLoading(false);
        });
    }
  }, [contentId, content]);

  if (loading) {
    return <p>Loading content...</p>;
  }

  return (
    <div className="prose max-w-none">
      <ReactMarkdown
        components={{
          // Styling for headings
          h1: (props) => (
            <h1 className="text-3xl font-bold mt-8 mb-4" {...props} />
          ),
          h2: (props) => (
            <h2 className="text-2xl font-bold mt-6 mb-3" {...props} />
          ),
          h3: (props) => (
            <h3 className="text-xl font-bold mt-4 mb-2" {...props} />
          ),

          // Styling for paragraphs and lists
          p: (props) => <p className="mb-4" {...props} />,
          ul: (props) => <ul className="list-disc pl-6 mb-4" {...props} />,
          ol: (props) => <ol className="list-decimal pl-6 mb-4" {...props} />,
          li: (props) => <li className="mb-1" {...props} />,

          // Styling for blockquotes and code
          blockquote: (props) => (
            <blockquote
              className="border-l-4 border-gray-300 pl-4 italic my-4"
              {...props}
            />
          ),
          code: ({ inline, className, ...props }: any) =>
            inline ? (
              <code
                className="bg-gray-100 rounded px-1 py-0.5 font-mono text-sm"
                {...props}
              />
            ) : (
              <code
                className="bg-gray-100 rounded px-1 py-0.5 font-mono text-sm"
                {...props}
              />
            ),
          pre: (props) => (
            <pre
              className="bg-gray-100 rounded p-4 overflow-x-auto my-4 font-mono text-sm"
              {...props}
            />
          ),

          // Custom components for links and images
          a: ({ href, ...props }) => (
            <Link
              href={href || "#"}
              className="text-blue-600 hover:underline"
              {...props}
            />
          ),
          img: ({ src, alt, ...props }: any) => {
            if (!src) return null;

            // Handle relative paths for images in markdown files
            let imageSrc = src;
            if (contentId && src.startsWith("./")) {
              imageSrc = `/markdown/learn/${src.replace("./", "")}`;
            }

            return (
              <span className="block my-4">
                <Image
                  src={imageSrc}
                  alt={alt || ""}
                  className="rounded max-w-full h-auto"
                  {...props}
                />
              </span>
            );
          },
        }}
      >
        {markdownContent}
      </ReactMarkdown>
    </div>
  );
}
