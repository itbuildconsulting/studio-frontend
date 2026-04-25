'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Placeholder from '@tiptap/extension-placeholder'
import { useEffect } from 'react'
import styles from './RichTextEditor.module.css'

interface RichTextEditorProps {
    label?: string
    value: string | null
    onChange: (html: string | null) => void
    placeholder?: string
}

const ToolbarButton = ({ onClick, active, title, children }: {
    onClick: () => void
    active?: boolean
    title: string
    children: React.ReactNode
}) => (
    <button
        type="button"
        onClick={onClick}
        title={title}
        className={`px-1.5 py-0.5 rounded text-sm transition-colors custom-button ${active
            ? 'bg-gray-800 text-white'
            : 'text-gray-600 hover:bg-gray-100'
            }`}
    >
        {children}
    </button>
)

export default function RichTextEditor({ label, value, onChange, placeholder }: RichTextEditorProps) {
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit,
            Underline,
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            Placeholder.configure({ placeholder: placeholder || 'Digite a descrição...' }),
        ],
        content: value || '',
        onUpdate({ editor }) {
            const html = editor.isEmpty ? null : editor.getHTML()
            onChange(html)
        },
    })

    useEffect(() => {
        if (!editor) return
        const current = editor.isEmpty ? null : editor.getHTML()
        if (current !== value) {
            editor.commands.setContent(value || '')
        }
    }, [value])

    if (!editor) return null

    return (
        <div className="flex flex-col">
            {label && <label className="mb-1">{label}</label>}
            <div className={styles.wrapper}>
                <div className={styles.toolbar}>
                    <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Negrito">
                        <strong>B</strong>
                    </ToolbarButton>
                    <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Itálico">
                        <em>I</em>
                    </ToolbarButton>
                    <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Sublinhado">
                        <span style={{ textDecoration: 'underline' }}>U</span>
                    </ToolbarButton>

                    <span className={styles.divider} />

                    <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Título">
                        H2
                    </ToolbarButton>
                    <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="Subtítulo">
                        H3
                    </ToolbarButton>

                    <span className={styles.divider} />

                    <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Lista">
                        &#8226;&#8212;
                    </ToolbarButton>
                    <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Lista numerada">
                        1&#8212;
                    </ToolbarButton>

                    <span className={styles.divider} />

                    <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} title="Alinhar à esquerda">
                        &#8676;
                    </ToolbarButton>
                    <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} title="Centralizar">
                        &#9635;
                    </ToolbarButton>
                    <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })} title="Alinhar à direita">
                        &#8677;
                    </ToolbarButton>
                </div>
                <EditorContent editor={editor} className={styles.content} />
            </div>
        </div>
    )
}
