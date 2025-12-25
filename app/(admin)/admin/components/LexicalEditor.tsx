'use client';

import React, { useEffect, useCallback, useState, useRef } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListNode, ListItemNode } from '@lexical/list';
import { LinkNode, AutoLinkNode } from '@lexical/link';
import { CodeNode, CodeHighlightNode } from '@lexical/code';
import {
  $getRoot,
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  EditorState,
  LexicalEditor as LexicalEditorType,
  COMMAND_PRIORITY_HIGH,
  createCommand,
  LexicalCommand,
  DecoratorNode,
  NodeKey,
  SerializedLexicalNode,
  Spread,
  DOMConversionMap,
  DOMExportOutput,
  DOMConversionOutput,
} from 'lexical';
import { $setBlocksType } from '@lexical/selection';
import { $createHeadingNode, $createQuoteNode } from '@lexical/rich-text';
import { INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND } from '@lexical/list';
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Image,
} from 'lucide-react';

// Image Node
type SerializedImageNode = Spread<
  {
    src: string;
    altText: string;
    storageId?: string;
    width?: number;
    height?: number;
  },
  SerializedLexicalNode
>;

export class ImageNode extends DecoratorNode<React.ReactElement> {
  __src: string;
  __altText: string;
  __storageId?: string;
  __width?: number;
  __height?: number;

  static getType(): string {
    return 'image';
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(node.__src, node.__altText, node.__storageId, node.__width, node.__height, node.__key);
  }

  constructor(src: string, altText: string, storageId?: string, width?: number, height?: number, key?: NodeKey) {
    super(key);
    this.__src = src;
    this.__altText = altText;
    this.__storageId = storageId;
    this.__width = width;
    this.__height = height;
  }

  static importJSON(serializedNode: SerializedImageNode): ImageNode {
    return new ImageNode(
      serializedNode.src,
      serializedNode.altText,
      serializedNode.storageId,
      serializedNode.width,
      serializedNode.height
    );
  }

  exportJSON(): SerializedImageNode {
    return {
      type: 'image',
      version: 1,
      src: this.__src,
      altText: this.__altText,
      storageId: this.__storageId,
      width: this.__width,
      height: this.__height,
    };
  }

  createDOM(): HTMLElement {
    const div = document.createElement('div');
    div.className = 'lexical-image-container';
    return div;
  }

  updateDOM(): boolean {
    return false;
  }

  static importDOM(): DOMConversionMap | null {
    return {
      img: () => ({
        conversion: (domNode: HTMLElement): DOMConversionOutput | null => {
          const img = domNode as HTMLImageElement;
          const src = img.getAttribute('src');
          const alt = img.getAttribute('alt') || '';
          const storageId = img.getAttribute('data-storage-id') || undefined;
          if (src) {
            return { node: new ImageNode(src, alt, storageId) };
          }
          return null;
        },
        priority: 0,
      }),
    };
  }

  exportDOM(): DOMExportOutput {
    const img = document.createElement('img');
    img.setAttribute('src', this.__src);
    img.setAttribute('alt', this.__altText);
    if (this.__storageId) {
      img.setAttribute('data-storage-id', this.__storageId);
    }
    if (this.__width) img.setAttribute('width', String(this.__width));
    if (this.__height) img.setAttribute('height', String(this.__height));
    return { element: img };
  }

  decorate(): React.ReactElement {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={this.__src}
        alt={this.__altText || 'Image'}
        data-storage-id={this.__storageId}
        className="max-w-full h-auto rounded-lg my-2"
        style={{ maxHeight: '400px' }}
      />
    );
  }

  getStorageId(): string | undefined {
    return this.__storageId;
  }
}

export const INSERT_IMAGE_COMMAND: LexicalCommand<{
  src: string;
  altText: string;
  storageId?: string;
}> = createCommand('INSERT_IMAGE_COMMAND');

// Toolbar Plugin
function ToolbarPlugin({ onImageUpload }: { onImageUpload: () => void }) {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
      setIsStrikethrough(selection.hasFormat('strikethrough'));
    }
  }, []);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => updateToolbar());
    });
  }, [editor, updateToolbar]);

  const formatHeading = (tag: 'h1' | 'h2') => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createHeadingNode(tag));
      }
    });
  };

  const formatQuote = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createQuoteNode());
      }
    });
  };

  const btnClass = (active: boolean) =>
    `p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-600 ${active ? 'bg-slate-200 dark:bg-slate-600' : ''}`;

  return (
    <div className="flex flex-wrap gap-1 p-2 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 rounded-t-lg">
      <button type="button" onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')} className={btnClass(isBold)} title="Bold">
        <Bold size={18} />
      </button>
      <button type="button" onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')} className={btnClass(isItalic)} title="Italic">
        <Italic size={18} />
      </button>
      <button type="button" onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')} className={btnClass(isUnderline)} title="Underline">
        <Underline size={18} />
      </button>
      <button type="button" onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')} className={btnClass(isStrikethrough)} title="Strikethrough">
        <Strikethrough size={18} />
      </button>
      <div className="w-px h-6 bg-slate-300 dark:bg-slate-600 mx-1 self-center" />
      <button type="button" onClick={() => formatHeading('h1')} className={btnClass(false)} title="Heading 1">
        <Heading1 size={18} />
      </button>
      <button type="button" onClick={() => formatHeading('h2')} className={btnClass(false)} title="Heading 2">
        <Heading2 size={18} />
      </button>
      <button type="button" onClick={() => formatQuote()} className={btnClass(false)} title="Quote">
        <Quote size={18} />
      </button>
      <div className="w-px h-6 bg-slate-300 dark:bg-slate-600 mx-1 self-center" />
      <button type="button" onClick={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)} className={btnClass(false)} title="Bullet List">
        <List size={18} />
      </button>
      <button type="button" onClick={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)} className={btnClass(false)} title="Numbered List">
        <ListOrdered size={18} />
      </button>
      <div className="w-px h-6 bg-slate-300 dark:bg-slate-600 mx-1 self-center" />
      <button type="button" onClick={onImageUpload} className={btnClass(false)} title="Insert Image">
        <Image size={18} />
      </button>
    </div>
  );
}

// Image Plugin
function ImagePlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([ImageNode])) {
      throw new Error('ImageNode not registered');
    }

    return editor.registerCommand(
      INSERT_IMAGE_COMMAND,
      (payload) => {
        const { src, altText, storageId } = payload;
        const imageNode = new ImageNode(src, altText, storageId);
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          selection.insertNodes([imageNode]);
        }
        return true;
      },
      COMMAND_PRIORITY_HIGH
    );
  }, [editor]);

  return null;
}

// Init Plugin - Load initial HTML
function InitPlugin({ initialHtml }: { initialHtml?: string }) {
  const [editor] = useLexicalComposerContext();
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current || !initialHtml) return;
    initialized.current = true;

    editor.update(() => {
      const parser = new DOMParser();
      const dom = parser.parseFromString(initialHtml, 'text/html');
      const nodes = $generateNodesFromDOM(editor, dom);
      const root = $getRoot();
      root.clear();
      root.append(...nodes);
    });
  }, [editor, initialHtml]);

  return null;
}

// Extract storage IDs from editor
export function extractStorageIdsFromEditor(editor: LexicalEditorType): string[] {
  const ids: string[] = [];
  editor.getEditorState().read(() => {
    const root = $getRoot();
    const iterate = (node: unknown) => {
      if (node instanceof ImageNode) {
        const storageId = node.getStorageId();
        if (storageId) ids.push(storageId);
      }
      if (typeof node === 'object' && node !== null && 'getChildren' in node) {
        (node as { getChildren: () => unknown[] }).getChildren().forEach(iterate);
      }
    };
    iterate(root);
  });
  return ids;
}

// Props
interface LexicalEditorProps {
  value?: string;
  onChange?: (html: string, storageIds: string[]) => void;
  placeholder?: string;
}

export default function LexicalEditor({ value, onChange, placeholder = 'Nhập nội dung...' }: LexicalEditorProps) {
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const [editor, setEditor] = useState<LexicalEditorType | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initialConfig = {
    namespace: 'PostEditor',
    theme: {
      root: 'prose dark:prose-invert max-w-none',
      paragraph: 'mb-2',
      heading: {
        h1: 'text-2xl font-bold mb-4',
        h2: 'text-xl font-semibold mb-3',
        h3: 'text-lg font-medium mb-2',
      },
      list: {
        ul: 'list-disc ml-4 mb-2',
        ol: 'list-decimal ml-4 mb-2',
        listitem: 'mb-1',
      },
      quote: 'border-l-4 border-slate-300 pl-4 italic text-slate-600 dark:text-slate-400 my-4',
      text: {
        bold: 'font-bold',
        italic: 'italic',
        underline: 'underline',
        strikethrough: 'line-through',
      },
    },
    nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode, LinkNode, AutoLinkNode, CodeNode, CodeHighlightNode, ImageNode],
    onError: (error: Error) => console.error(error),
  };

  const handleChange = useCallback(
    (editorState: EditorState, ed: LexicalEditorType) => {
      setEditor(ed);
      editorState.read(() => {
        const html = $generateHtmlFromNodes(ed, null);
        const storageIds = extractStorageIdsFromEditor(ed);
        onChange?.(html, storageIds);
      });
    },
    [onChange]
  );

  const handleImageUpload = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !editor) return;

      try {
        const uploadUrl = await generateUploadUrl();
        const res = await fetch(uploadUrl, {
          method: 'POST',
          headers: { 'Content-Type': file.type },
          body: file,
        });

        if (!res.ok) throw new Error('Upload failed');

        const { storageId } = (await res.json()) as { storageId: Id<'_storage'> };
        
        // Get the URL - Convex storage URL pattern
        const imageUrl = `${process.env.NEXT_PUBLIC_CONVEX_URL?.replace('.cloud', '.site')}/api/storage/${storageId}`;

        editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
          src: imageUrl,
          altText: file.name,
          storageId: storageId,
        });
      } catch (err) {
        console.error('Image upload error:', err);
      }

      e.target.value = '';
    },
    [editor, generateUploadUrl]
  );

  return (
    <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
      <LexicalComposer initialConfig={initialConfig}>
        <ToolbarPlugin onImageUpload={handleImageUpload} />
        <div className="relative min-h-[300px] p-4 bg-white dark:bg-slate-900">
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="outline-none min-h-[280px] text-slate-900 dark:text-white" />
            }
            placeholder={
              <div className="absolute top-4 left-4 text-slate-400 pointer-events-none">{placeholder}</div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <ListPlugin />
          <LinkPlugin />
          <ImagePlugin />
          <InitPlugin initialHtml={value} />
          <OnChangePlugin onChange={handleChange} />
        </div>
      </LexicalComposer>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
