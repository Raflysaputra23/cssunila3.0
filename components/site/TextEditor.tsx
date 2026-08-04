"use client"

import MDEditor from '@uiw/react-md-editor';
import rehypeSanitize from "rehype-sanitize";
import Remarkdown from './Remarkdown';

interface TextEditorProps {
    value: string;
    onChange: (value: string | undefined) => void;
}

const TextEditor = ({ value, onChange }: TextEditorProps) => {

    return (
        <div className="w-full max-h-96 overflow-y-auto mt-1 rounded-lg">
            <MDEditor
                value={value}
                preview="edit"
                className="border! bg-transparent! font-poppins!"
                onChange={onChange}
                previewOptions={{
                    rehypePlugins: [[rehypeSanitize]],
                }}
            />
            {value &&
                <div className="mt-2 border rounded-lg bg-black/60 px-3 py-2 max-w-none prose dark:prose-invert prose-pre:bg-transparent prose-pre:p-0 prose-pre:m-0">
                    <Remarkdown content={value || ""} />
                </div>
            }
        </div>

    );
}

export default TextEditor;