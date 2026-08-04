"use client"

import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useState } from "react";
import { Check, Copy } from "lucide-react";

interface Props {
    content: string;
}

const cleanTheme = {
    ...oneDark,
    'pre[class*="language-"]': {
        ...oneDark['pre[class*="language-"]'],
        background: "transparent",
    },
};

const Remarkdown = ({ content }: Props) => {
    const [copied, setCopied] = useState(false);
    const copyCode = (code: string) => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
                code({ className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    const isBlock = !!match;

                    if (isBlock) {
                        return (
                            <div className="my-4 rounded-xl overflow-hidden border border-zinc-700 bg-[#1e1e1e]">

                                {/* Header terminal */}
                                <div className="flex items-center justify-between gap-2 px-4 py-2 bg-zinc-800">
                                    <div className="flex items-center gap-2">
                                        <span className="w-3 h-3 bg-red-500 rounded-full" />
                                        <span className="w-3 h-3 bg-yellow-500 rounded-full" />
                                        <span className="w-3 h-3 bg-green-500 rounded-full" />
                                        <span className="ml-3 text-xs text-zinc-400">
                                            {match[1]}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => copyCode(String(children).replace(/\n$/, ""))}
                                        className="flex items-center cursor-pointer gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {copied ? <Check className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5" />}
                                        {copied ? "Disalin!" : "Salin"}
                                    </button>
                                </div>
                                <SyntaxHighlighter
                                    style={cleanTheme}
                                    language={match[1]}
                                    PreTag="div"

                                >
                                    {String(children).replace(/\n$/, "")}
                                </SyntaxHighlighter>
                            </div>
                        );
                    }

                    return (
                        <code className="bg-primary-foreground text-muted-foreground px-1 py-0.5 rounded text-sm">
                            {children}
                        </code>
                    );
                },
                table({ children }) {
                    return (
                        <div className="my-2 overflow-x-auto shadow">
                            <table className="min-w-max rounded-xl overflow-hidden">
                                {children}
                            </table>
                        </div>
                    );
                },

                th({ children }) {
                    return (
                        <th className="px-4 py-3 bg-primary-foreground font-semibold text-zinc-200 border-b border-zinc-700">
                            {children}
                        </th>
                    );
                },

                td({ children }) {
                    return (
                        <td className="px-4 py-3 border-b max-w-125 border-zinc-800 text-zinc-300">
                            {children}
                        </td>
                    );
                },
                tr({ children }) {
                    return (
                        <tr className="odd:bg-primary-foreground/10 even:bg-primary-foreground/50">
                            {children}
                        </tr>
                    );
                },
            }}
        >
            {content}
        </ReactMarkdown>
    )
}

export default Remarkdown;
