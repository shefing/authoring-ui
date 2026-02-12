import {createEditor} from 'lexical';
import {$generateHtmlFromNodes} from '@lexical/html';
import {$getRoot} from 'lexical';
import {ListNode, ListItemNode} from '@lexical/list';

const EMPTY_LEXICAL_JSON = JSON.stringify({
  editorState: {
    root: {
      type: "root",
      version: 1,
      children: [{
        type: "paragraph",
        version: 1,
        children: [],
        direction: null,
        format: "",
        indent: 0
      }],
      direction: null,
      format: "",
      indent: 0
    }
  }
});

/**
 * Convert Lexical JSON to HTML with formatting preserved
 * Steps: Parse JSON → Create editor → Set state → Generate HTML
 */
export function convertLexicalToHtml(lexicalJson: string): string {
  if (!lexicalJson || lexicalJson.trim() === '') {
    return '';
  }

  try {
    const parsed = JSON.parse(lexicalJson);
    const editorStateData = parsed.editorState || parsed;
    
    if (!editorStateData.root || !editorStateData.root.children || editorStateData.root.children.length === 0) {
      return '';
    }
    
    // Create editor with list nodes registered
    const editor = createEditor({
      nodes: [ListNode, ListItemNode]
    });
    
    // Load Lexical JSON into editor state
    editor.setEditorState(editor.parseEditorState(editorStateData));

    // Generate HTML from editor nodes
    let html = '';
    editor.read(() => { html = $generateHtmlFromNodes(editor); });
    
    return html;
  } catch (error) {
    console.error('Error converting Lexical JSON to HTML:', error);
    return '';
  }
}

// Extract plain text from Lexical JSON (for validation)
export function extractTextFromLexical(lexicalJson: string | undefined): string {
  if (!lexicalJson || lexicalJson.trim() === '') {
    return '';
  }

  try {
    const parsed = JSON.parse(lexicalJson);
    // Register list nodes to handle list types in Lexical JSON
    const editor = createEditor({
      nodes: [ListNode, ListItemNode]
    });
    editor.setEditorState(editor.parseEditorState(parsed.editorState || parsed));

    // Get text content from root node
    let text = '';
    editor.read(() => {
      const root = $getRoot();
      text = root.getTextContent();
    });
    
    return text;
  } catch (error) {
    return lexicalJson;
  }
}

// Convert plain text to Lexical JSON structure (root → paragraph → text node)
export function convertTextToLexical(text: string): string {
  if (!text || text.trim() === '') {
    return EMPTY_LEXICAL_JSON;
  }

  // If already Lexical JSON, return as-is
  try {
    const parsed = JSON.parse(text);
    if (parsed.editorState || parsed.root) {
      return text;
    }
  } catch {
    // Not JSON, continue to convert
  }

  // Create Lexical JSON structure: root → paragraph → text node
  return JSON.stringify({
    editorState: {
      root: {
        type: "root",
        version: 1,
        children: [{
          type: "paragraph",
          version: 1,
          children: [{
            type: "text",
            version: 1,
            text: text,
            format: 0,
            detail: 0,
            mode: "normal",
            style: ""
          }],
          direction: null,
          format: "",
          indent: 0
        }],
        direction: null,
        format: "",
        indent: 0
      }
    }
  });
}


