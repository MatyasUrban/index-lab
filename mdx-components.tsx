import type { MDXComponents } from 'mdx/types'
import Image from 'next/image'
import Link from 'next/link'

// This file allows you to provide custom React components
// to be used in MDX files. You can import and use any
// React component you want, including components from
// other libraries.

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Allows customizing built-in components, e.g. to add styling.
    h1: ({ children }) => <h1 className="text-3xl font-bold mt-8 mb-4">{children}</h1>,
    h2: ({ children }) => <h2 className="text-2xl font-bold mt-6 mb-3">{children}</h2>,
    h3: ({ children }) => <h3 className="text-xl font-bold mt-4 mb-2">{children}</h3>,
    p: ({ children }) => <p className="mb-4">{children}</p>,
    ul: ({ children }) => <ul className="list-disc pl-6 mb-4">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal pl-6 mb-4">{children}</ol>,
    li: ({ children }) => <li className="mb-1">{children}</li>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4">{children}</blockquote>
    ),
    code: ({ children }) => (
      <code className="bg-gray-100 rounded px-1 py-0.5 font-mono text-sm">{children}</code>
    ),
    pre: ({ children }) => (
      <pre className="bg-gray-100 rounded p-4 overflow-x-auto my-4 font-mono text-sm">{children}</pre>
    ),
    // Add custom components
    a: ({ href, children }) => <Link href={href || '#'} className="text-blue-600 hover:underline">{children}</Link>,
    img: ({ src, alt }) => <Image src={src || ''} alt={alt || ''} width={800} height={450} className="my-4 rounded" />,
    ...components,
  }
} 