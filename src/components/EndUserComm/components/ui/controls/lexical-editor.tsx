'use client'
import {LexicalComposer} from '@lexical/react/LexicalComposer';
import {RichTextPlugin} from '@lexical/react/LexicalRichTextPlugin';
import {ContentEditable} from '@lexical/react/LexicalContentEditable';
import {HistoryPlugin} from '@lexical/react/LexicalHistoryPlugin';
import {OnChangePlugin} from '@lexical/react/LexicalOnChangePlugin';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {ListPlugin} from '@lexical/react/LexicalListPlugin';
import {LinkPlugin} from '@lexical/react/LexicalLinkPlugin';
import {LexicalErrorBoundary} from '@lexical/react/LexicalErrorBoundary';
import {useEffect, useState} from 'react';
import {ListNode, ListItemNode, $isListNode, $isListItemNode} from '@lexical/list';
import {LinkNode, $isLinkNode} from '@lexical/link';
import {FORMAT_TEXT_COMMAND, $getSelection, $isRangeSelection} from 'lexical';
import type {LexicalEditor as LexicalEditorType} from 'lexical';
import {INSERT_UNORDERED_LIST_COMMAND, INSERT_ORDERED_LIST_COMMAND} from '@lexical/list';
import {TOGGLE_LINK_COMMAND} from '@lexical/link';
import {RichTextToolbar} from './rich-text-toolbar';
import type {FormatAction} from './rich-text-toolbar';
import {FORM_INPUT_TEXT_SIZE, BUTTON_DISABLED} from '@/components/EndUserComm/lib/formStyles';
import {cn} from '../utils';

interface LexicalEditorProps {
  field: 'titleLexical' | 'bodyLexical';
  value: string; // Lexical JSON string
  onChange: (lexicalJson: string) => void;
  minHeight?: string;
  className?: string;
  disabled?: boolean;
}

function ToolbarIntegration({disabled = false}: {disabled?: boolean}) {
  const [editor] = useLexicalComposerContext();
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
    ul: false,
    ol: false,
    link: false
  });
  
  // Detect active formatting states from selection
  useEffect(() => {
    return editor.registerUpdateListener(({editorState}) => {
      editorState.read(() => {
        const selection = $getSelection();
        
        if (!$isRangeSelection(selection)) {
          setActiveFormats({bold: false, italic: false, underline: false, ul: false, ol: false, link: false});
          return;
        }
        
        // Check text formatting
        const bold = selection.hasFormat('bold');
        const italic = selection.hasFormat('italic');
        const underline = selection.hasFormat('underline');
        
        // Traverse node tree to find link or list
        let node: ReturnType<typeof selection.anchor.getNode> | null = selection.anchor.getNode();
        let link = false;
        let listType: 'bullet' | 'number' | null = null;
        
        while (node) {
          if ($isLinkNode(node)) link = true;
          if ($isListItemNode(node)) {
            const parent = node.getParent();
            if (parent && $isListNode(parent)) {
              const type = parent.getListType();
              listType = (type === 'bullet' || type === 'number') ? type : null;
            }
            break;
          }
          node = node.getParent();
        }
        
        setActiveFormats({
          bold,
          italic,
          underline,
          ul: listType === 'bullet',
          ol: listType === 'number',
          link
        });
      });
    });
  }, [editor]);
  
  // Dispatch Lexical commands for formatting (bold/italic/underline, lists, links)
  const handleFormat = (action: FormatAction, value?: string) => {
    editor.focus();

    if (action === 'bold' || action === 'italic' || action === 'underline') {
      editor.dispatchCommand(FORMAT_TEXT_COMMAND, action);
    } else if (action === 'ul') {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else if (action === 'ol') {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    } else if (action === 'link') {
      const url = prompt('Enter URL:');
      if (url) {
        editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
      }
    }
  };

  return <RichTextToolbar onFormat={handleFormat} activeFormats={activeFormats} disabled={disabled}/>;
}

export function LexicalEditor({
  field,
  value,
  onChange,
  minHeight = '2.5rem',
  className = '',
  disabled = false
}: LexicalEditorProps) {
  const theme = {
    text: {
      bold: 'editor-text-bold',
      italic: 'editor-text-italic',
      underline: 'editor-text-underline',
      strikethrough: 'editor-text-strikethrough',
    },
    list: {
      nested: {
        listitem: 'editor-nested-listitem',
      },
      ol: 'editor-list-ol',
      ul: 'editor-list-ul',
      listitem: 'editor-listitem',
    },
    link: 'editor-link',
  };

  const initialConfig = {
    namespace: `MessageEditor-${field}`,
    theme,
    nodes: [ListNode, ListItemNode, LinkNode], // Register node types for lists and links
    onError: (error: Error) => {
      console.error('Lexical editor error:', error);
    },
    // Initialize editor with Lexical JSON from props (for edit mode)
    editorState: value ? ((editor: LexicalEditorType) => {
      try {
        const parsed = JSON.parse(value);
        const editorStateData = parsed.editorState || parsed;
        editor.setEditorState(editor.parseEditorState(editorStateData));
      } catch {
        // If parsing fails, editor will use default empty state
      }
    }) : null
  };

  // Convert Lexical EditorState to JSON string on every change
  const handleChange = (editorState: any) => {
    const json = editorState.toJSON();
    onChange(JSON.stringify({editorState: json}));
  };

  return (
    <div className={`lexical-editor-wrapper-${field}`}>
      <LexicalComposer initialConfig={initialConfig}>
        <div className={cn(
          'flex flex-col border border-gray-300 rounded-md overflow-hidden',
          disabled ? BUTTON_DISABLED : 'bg-white'
        )}>
          <ToolbarIntegration disabled={disabled}/>
          <div className="relative border-t border-gray-200">
            <RichTextPlugin
              contentEditable={
                <ContentEditable
                  className={cn(
                    `editor-input-${field} px-3 py-2 ${FORM_INPUT_TEXT_SIZE} focus:outline-none`,
                    disabled && 'text-gray-500',
                    className
                  )}
                  style={{
                    minHeight,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word'
                  }}/>
              }
              ErrorBoundary={LexicalErrorBoundary}/>
            <HistoryPlugin/>
            <ListPlugin/>
            <LinkPlugin/>
            <OnChangePlugin onChange={handleChange}/>
            <EditorStateSync value={value}/>
            <ReadOnlyPlugin disabled={disabled}/>
          </div>
        </div>
      </LexicalComposer>
      <style>{`
        .editor-text-bold {
          font-weight: bold !important;
        }
        .editor-text-italic {
          font-style: italic !important;
        }
        .editor-text-underline {
          text-decoration: underline !important;
        }
        .editor-text-strikethrough {
          text-decoration: line-through !important;
        }
        .editor-list-ul {
          list-style-type: disc !important;
          margin-left: 1.5rem !important;
          padding-left: 0.5rem !important;
        }
        .editor-list-ol {
          list-style-type: decimal !important;
          margin-left: 1.5rem !important;
          padding-left: 0.5rem !important;
        }
        .editor-listitem {
          display: list-item !important;
          margin: 0.25rem 0 !important;
        }
        .editor-nested-listitem {
          margin-left: 1rem !important;
        }
        .editor-link {
          color: #2563eb !important;
          text-decoration: underline !important;
          cursor: pointer !important;
        }
        .editor-link:hover {
          color: #1d4ed8 !important;
        }
        .editor-input-${field} strong,
        .editor-input-${field} b {
          font-weight: bold !important;
        }
        .editor-input-${field} em,
        .editor-input-${field} i {
          font-style: italic !important;
        }
        .editor-input-${field} u {
          text-decoration: underline !important;
        }
        .editor-input-${field} ul {
          list-style-type: disc !important;
          margin-left: 1.5rem !important;
          padding-left: 0.5rem !important;
        }
        .editor-input-${field} ol {
          list-style-type: decimal !important;
          margin-left: 1.5rem !important;
          padding-left: 0.5rem !important;
        }
        .editor-input-${field} li {
          display: list-item !important;
          margin: 0.25rem 0 !important;
        }
        .editor-input-${field} a {
          color: #2563eb !important;
          text-decoration: underline !important;
          cursor: pointer !important;
        }
      `}</style>
    </div>
  );
}

// Sync external value changes into editor (e.g., when switching between edit/create modes)
function EditorStateSync({value}: {value: string}) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!value) return;

    try {
      const parsed = JSON.parse(value);
      const editorStateData = parsed.editorState || parsed;
      const currentState = editor.getEditorState().toJSON();

      // Only update if state actually changed to avoid unnecessary re-renders
      if (JSON.stringify(currentState) !== JSON.stringify(editorStateData)) {
        editor.setEditorState(editor.parseEditorState(editorStateData));
      }
    } catch (error) {
      console.error('Error parsing Lexical JSON for editor:', error);
    }
  }, [value, editor]);

  return null;
}

// Plugin to control editor editability (read-only mode)
function ReadOnlyPlugin({disabled}: {disabled: boolean}) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    editor.setEditable(!disabled);
  }, [editor, disabled]);

  return null;
}

