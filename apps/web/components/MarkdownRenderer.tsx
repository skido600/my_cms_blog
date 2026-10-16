"use client";

import React, { useRef, useState } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import "highlight.js/styles/atom-one-dark.css";

type Props = {
  content?: string;
};

function CodeBlock({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(preRef.current?.textContent ?? "");
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <div className="my-6 overflow-hidden  border border-neutral-800 bg-[#282c34]">
      <div className="flex items-center justify-end border-b border-white/10 bg-black/20 px-4 py-2 text-xs text-neutral-400">
        <button
          type="button"
          onClick={copy}
          className="rounded px-2 py-1 transition-colors hover:bg-white/10 hover:text-white">
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <pre
        ref={preRef}
        className="overflow-x-auto p-4 text-sm leading-6 text-[#abb2bf]">
        <code className={className}>{children}</code>
      </pre>
    </div>
  );
}

// Every element is styled here, so formatting does not depend on the
// @tailwindcss/typography plugin (no `prose` classes needed).
const components: Components = {
  h1: ({ children }) => (
    <h1 className="mb-4 mt-10 text-3xl font-bold tracking-tight text-neutral-950 dark:text-white">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="mb-4 mt-10 text-2xl font-bold tracking-tight text-neutral-950 dark:text-white">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mb-3 mt-8 text-xl font-semibold text-neutral-950 dark:text-white">
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4 className="mb-2 mt-6 text-lg font-semibold text-neutral-950 dark:text-white">
      {children}
    </h4>
  ),

  p: ({ children }) => (
    <p className="mb-5 text-base leading-7 text-neutral-700 dark:text-neutral-300">
      {children}
    </p>
  ),

  a: ({ href, children }) => {
    const isExternal = !!href && /^https?:\/\//.test(href);
    return (
      <a
        href={href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        className="font-medium text-blue-600 underline decoration-blue-600/30 underline-offset-4 transition-colors hover:decoration-blue-600 dark:text-blue-400 dark:decoration-blue-400/30 dark:hover:decoration-blue-400">
        {children}
      </a>
    );
  },

  ul: ({ className, children }) => (
    <ul
      className={`mb-5 space-y-2 text-neutral-700 dark:text-neutral-300 ${
        className?.includes("contains-task-list")
          ? "list-none pl-0"
          : "list-disc pl-6 marker:text-neutral-400"
      }`}>
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-5 list-decimal space-y-2 pl-6 text-neutral-700 marker:text-neutral-400 dark:text-neutral-300">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="leading-7">{children}</li>,

  blockquote: ({ children }) => (
    <blockquote className="my-6 border-l-4 border-neutral-300 pl-4 italic text-neutral-600 dark:border-neutral-700 dark:text-neutral-400 [&>p]:mb-0">
      {children}
    </blockquote>
  ),

  hr: () => <hr className="my-10 border-neutral-200 dark:border-neutral-800" />,

  // Inline code only. Fenced blocks never reach this component, because the
  // `pre` handler below renders its own <code> without the chip styles.
  code: ({ className, children }) => (
    <code
      className={`${className ?? ""} rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-[0.875em] text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200`}>
      {children}
    </code>
  ),

  pre: ({ children }) => {
    const child = React.Children.toArray(children)[0];
    if (!React.isValidElement(child)) return <pre>{children}</pre>;

    const { className = "", children: code } = child.props as {
      className?: string;
      children?: React.ReactNode;
    };

    // drop the `hljs` base class: it adds its own padding and background,
    // which the wrapper above already provides (token colors are unaffected)
    const cleaned = className.replace(/\bhljs\b/, "").trim();

    return <CodeBlock className={cleaned}>{code}</CodeBlock>;
  },

  table: ({ children }) => (
    <div className="my-6 overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm">
        {children}
      </table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border-b-2 border-neutral-300 px-3 py-2 font-semibold text-neutral-950 dark:border-neutral-700 dark:text-white">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border-b border-neutral-200 px-3 py-2 text-neutral-700 dark:border-neutral-800 dark:text-neutral-300">
      {children}
    </td>
  ),

  // Plain <img> on purpose: markdown images can come from any host, and
  // next/image throws on hosts that are not listed in next.config.
  img: ({ src, alt = "" }) =>
    typeof src === "string" && src ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="my-6 h-auto max-w-full rounded-xl"
      />
    ) : null,
};

const MarkdownRenderer = ({ content }: Props) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[
        rehypeRaw,
        [
          rehypeHighlight,
          {
            // detect: guess the language when a fence has none
            detect: true,

            subset: [
              "javascript",
              "typescript",
              "json",
              "bash",
              "css",
              "xml",
              "python",
            ],
            // do not throw on a language highlight.js doesn't know
            ignoreMissing: true,
          },
        ],
      ]}
      components={components}>
      {content || ""}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;
