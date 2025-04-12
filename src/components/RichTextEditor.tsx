'use client';

import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { ToolBar } from './ToolBar';
import Highlight from '@tiptap/extension-highlight';

export function RichTextEditor({
  description,
  onChange,
}: {
  description: string;
  onChange?: (value: string) => void;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: 'list-disc ml-3',
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: 'list-decimal ml-3',
          },
        },
      }),
      Highlight,
    ],
    content: description,
    editorProps: {
      attributes: {
        class: 'min-h-[156px] border rounded-md py-2 px-3 text-sm',
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange?.(html);
    },
  });

  return (
    <div>
      <ToolBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
