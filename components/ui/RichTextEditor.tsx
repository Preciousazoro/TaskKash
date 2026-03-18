"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Italic, Underline, List, ListOrdered, Heading1, Heading2, Heading3, Link } from 'lucide-react';
import { useState } from 'react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function RichTextEditor({ content, onChange, placeholder = "Start typing...", className = "", disabled = false }: RichTextEditorProps) {
  const [linkUrl, setLinkUrl] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
    ],
    content,
    editable: !disabled,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: `prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[150px] p-3 ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
        placeholder,
      },
    },
  });

  if (!editor) {
    return null;
  }

  const setLink = () => {
    if (linkUrl) {
      editor.chain().focus().setLink({ href: linkUrl }).run();
      setLinkUrl('');
      setShowLinkInput(false);
    }
  };

  const unsetLink = () => {
    editor.chain().focus().unsetLink().run();
  };

  const Button = ({ onClick, isActive = false, children, title = "", disabled = false }: { 
    onClick: () => void; 
    isActive?: boolean; 
    children: React.ReactNode;
    title?: string;
    disabled?: boolean;
  }) => (
    <button
      onClick={onClick}
      title={title}
      disabled={disabled}
      className={`p-2 rounded transition-colors ${
        disabled 
          ? 'opacity-50 cursor-not-allowed' 
          : isActive 
            ? 'bg-primary text-primary-foreground' 
            : 'hover:bg-muted text-muted-foreground hover:text-foreground'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-background">
      {/* Toolbar */}
      <div className="border-b border-border bg-muted/30 p-2 flex flex-wrap gap-1">
        <Button
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          title="Bold"
          disabled={disabled}
        >
          <Bold className="w-4 h-4" />
        </Button>
        
        <Button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          title="Italic"
          disabled={disabled}
        >
          <Italic className="w-4 h-4" />
        </Button>
        
        <Button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive('underline')}
          title="Underline"
          disabled={disabled}
        >
          <Underline className="w-4 h-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        <Button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor.isActive('heading', { level: 1 })}
          title="Heading 1"
          disabled={disabled}
        >
          <Heading1 className="w-4 h-4" />
        </Button>
        
        <Button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive('heading', { level: 2 })}
          title="Heading 2"
          disabled={disabled}
        >
          <Heading2 className="w-4 h-4" />
        </Button>
        
        <Button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor.isActive('heading', { level: 3 })}
          title="Heading 3"
          disabled={disabled}
        >
          <Heading3 className="w-4 h-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        <Button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          title="Bullet List"
          disabled={disabled}
        >
          <List className="w-4 h-4" />
        </Button>
        
        <Button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
          title="Numbered List"
          disabled={disabled}
        >
          <ListOrdered className="w-4 h-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        {showLinkInput ? (
          <div className="flex items-center gap-2 p-1 bg-background border border-border rounded">
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="Enter URL..."
              className="px-2 py-1 text-sm border-0 outline-none bg-transparent"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setLink();
                } else if (e.key === 'Escape') {
                  setShowLinkInput(false);
                  setLinkUrl('');
                }
              }}
            />
            <button
              onClick={setLink}
              className="px-2 py-1 text-xs bg-primary text-primary-foreground rounded"
            >
              Add
            </button>
            <button
              onClick={() => {
                setShowLinkInput(false);
                setLinkUrl('');
              }}
              className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded"
            >
              Cancel
            </button>
          </div>
        ) : (
          <Button
            onClick={() => {
              if (editor.isActive('link')) {
                unsetLink();
              } else {
                setShowLinkInput(true);
              }
            }}
            isActive={editor.isActive('link')}
            title={editor.isActive('link') ? "Remove Link" : "Add Link"}
            disabled={disabled}
          >
            <Link className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />
      
      {/* Character count */}
      <div className="border-t border-border bg-muted/30 px-3 py-2 text-xs text-muted-foreground text-right">
        {editor.storage.characterCount?.characters() || 0} characters
      </div>
    </div>
  );
}
