'use client';

import { EditorContent, useEditor, EditorContext } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { ToolBar } from './ToolBar';
import Highlight from '@tiptap/extension-highlight';
import Placeholder from '@tiptap/extension-placeholder';
import Link from './tiptap-extension/link-extension';

import '@/components/tiptap-node/paragraph-node/paragraph-node.scss';
import { LinkPopover } from './tiptap-ui/link-popover';

export function RichTextEditor({
  description,
  onChange,
  placeholder,
}: {
  description?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
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
      Placeholder.configure({
        placeholder: placeholder,
      }),
      Highlight,
      Link.configure({ openOnClick: false }),
    ],
    content: description,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'min-h-[156px] border rounded-md py-2 px-3 text-sm',
      },
      transformPastedHTML(html) {
        // Wrap pasted content in a paragraph tag if it's not already wrapped
        const trimmed = html.trim();
        if (!trimmed.startsWith('<')) {
          return `<p>${html}</p>`;
        }
        return html;
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange?.(html);
    },
  });

  return (
    <EditorContext.Provider value={{ editor }}>
      <div
        className="tiptap-button-group border rounded-md p-1 mb-1 space-x-2 z-50"
        data-orientation="horizontal"
      >
        <ToolBar editor={editor} />
        <LinkPopover />
      </div>
      <EditorContent editor={editor} />
    </EditorContext.Provider>
  );
}
