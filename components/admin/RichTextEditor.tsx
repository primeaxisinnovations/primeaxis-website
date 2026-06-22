'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading2,
  Heading3,
  Pilcrow,
  List,
  ListOrdered,
  Quote,
  AlignLeft,
  AlignCenter,
  AlignRight,
  IndentIncrease,
  IndentDecrease,
  Link2,
  ImagePlus,
  Minus,
  Undo2,
  Redo2,
} from 'lucide-react'

interface RichTextEditorProps {
  value: string
  onChange: (html: string) => void
}

interface ActiveFormats {
  bold: boolean
  italic: boolean
  underline: boolean
  strikeThrough: boolean
  insertUnorderedList: boolean
  insertOrderedList: boolean
  justifyLeft: boolean
  justifyCenter: boolean
  justifyRight: boolean
  h2: boolean
  h3: boolean
  paragraph: boolean
  blockquote: boolean
}

const EMPTY_FORMATS: ActiveFormats = {
  bold: false,
  italic: false,
  underline: false,
  strikeThrough: false,
  insertUnorderedList: false,
  insertOrderedList: false,
  justifyLeft: false,
  justifyCenter: false,
  justifyRight: false,
  h2: false,
  h3: false,
  paragraph: false,
  blockquote: false,
}

const TOOLBAR_BUTTON_BASE =
  'flex items-center justify-center w-9 h-9 border border-transparent text-cream/70 hover:text-gold hover:bg-white/5 transition-colors duration-150 disabled:opacity-30 disabled:cursor-not-allowed'
const TOOLBAR_BUTTON_ACTIVE = 'text-gold bg-white/10 border-gold/40'
const TOOLBAR_DIVIDER = 'w-px h-6 bg-white/15 mx-1'

// Finds the element that is a direct child of `root` and contains `node`.
// contentEditable keeps its content as a flat list of block-level direct
// children (paragraphs, headings, lists, blockquotes), so this is the unit
// we operate on when changing block-level formatting.
function closestTopLevelBlock(node: Node | null, root: HTMLElement): HTMLElement | null {
  let current: Node | null = node
  while (current && current.parentNode !== root) {
    current = current.parentNode
  }
  return current instanceof HTMLElement ? current : null
}

function getSelectedTopLevelBlocks(root: HTMLElement): HTMLElement[] {
  const selection = window.getSelection()
  if (!selection || selection.rangeCount === 0) return []
  const range = selection.getRangeAt(0)
  if (!root.contains(range.commonAncestorContainer)) return []

  const startBlock = closestTopLevelBlock(range.startContainer, root)
  const endBlock = closestTopLevelBlock(range.endContainer, root)
  if (!startBlock || !endBlock) return []
  if (startBlock === endBlock) return [startBlock]

  const blocks: HTMLElement[] = []
  let cursor: Element | null = startBlock
  while (cursor) {
    blocks.push(cursor as HTMLElement)
    if (cursor === endBlock) break
    cursor = cursor.nextElementSibling
  }
  return blocks
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const isFocusedRef = useRef(false)
  const [formats, setFormats] = useState<ActiveFormats>(EMPTY_FORMATS)

  // Sync external value changes into the DOM, but only while the editor is
  // not focused — otherwise every keystroke's onChange would round-trip back
  // in and reset the caret position mid-typing.
  useEffect(() => {
    const el = editorRef.current
    if (!el) return
    if (!isFocusedRef.current && el.innerHTML !== value) {
      el.innerHTML = value
    }
  }, [value])

  const emitChange = useCallback(() => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }, [onChange])

  const queryState = useCallback((command: string): boolean => {
    try {
      return document.queryCommandState(command)
    } catch {
      return false
    }
  }, [])

  const blockTagActive = useCallback((tag: string): boolean => {
    const root = editorRef.current
    const selection = window.getSelection()
    if (!root || !selection || selection.rangeCount === 0) return false
    const block = closestTopLevelBlock(selection.getRangeAt(0).startContainer, root)
    return block?.tagName === tag
  }, [])

  const updateActiveFormats = useCallback(() => {
    setFormats({
      bold: queryState('bold'),
      italic: queryState('italic'),
      underline: queryState('underline'),
      strikeThrough: queryState('strikeThrough'),
      insertUnorderedList: queryState('insertUnorderedList'),
      insertOrderedList: queryState('insertOrderedList'),
      justifyLeft: queryState('justifyLeft'),
      justifyCenter: queryState('justifyCenter'),
      justifyRight: queryState('justifyRight'),
      h2: blockTagActive('H2'),
      h3: blockTagActive('H3'),
      paragraph: blockTagActive('P') || blockTagActive('DIV'),
      blockquote: blockTagActive('BLOCKQUOTE'),
    })
  }, [blockTagActive, queryState])

  useEffect(() => {
    function handleSelectionChange() {
      if (isFocusedRef.current) {
        updateActiveFormats()
      }
    }
    document.addEventListener('selectionchange', handleSelectionChange)
    return () => document.removeEventListener('selectionchange', handleSelectionChange)
  }, [updateActiveFormats])

  function handleInput() {
    emitChange()
    updateActiveFormats()
  }

  function handleFocus() {
    isFocusedRef.current = true
    // Use <p> tags for new lines instead of bare <div>s so block-level
    // toolbar actions (headings, blockquote) have a consistent element to
    // operate on.
    try {
      document.execCommand('defaultParagraphSeparator', false, 'p')
    } catch {
      // Ignored — defaultParagraphSeparator is non-critical, only affects
      // which tag Enter produces.
    }
  }

  function handleBlur() {
    isFocusedRef.current = false
  }

  // Runs a browser execCommand for the formatting that's reliable across
  // Chrome/Edge (inline styles, lists, alignment, history).
  function exec(command: string, value?: string) {
    editorRef.current?.focus()
    document.execCommand(command, false, value)
    handleInput()
  }

  // Renames every top-level block in the current selection to `tag`,
  // preserving inline content. execCommand('formatBlock', ...) is
  // unreliable across browsers for this, so it's done by hand.
  function applyBlockTag(tag: 'H2' | 'H3' | 'P') {
    const root = editorRef.current
    if (!root) return
    root.focus()
    const blocks = getSelectedTopLevelBlocks(root)
    if (blocks.length === 0) return

    let lastReplaced: HTMLElement | null = null
    blocks.forEach((block) => {
      const replacement = document.createElement(tag)
      replacement.innerHTML = block.innerHTML
      block.replaceWith(replacement)
      lastReplaced = replacement
    })

    if (lastReplaced) {
      const range = document.createRange()
      range.selectNodeContents(lastReplaced)
      range.collapse(false)
      const selection = window.getSelection()
      selection?.removeAllRanges()
      selection?.addRange(range)
    }

    handleInput()
  }

  // Wraps the selected top-level blocks in a single <blockquote>, or
  // unwraps them if they're already inside one. Manual DOM, same reasoning
  // as applyBlockTag.
  function toggleBlockquote() {
    const root = editorRef.current
    if (!root) return
    root.focus()
    const blocks = getSelectedTopLevelBlocks(root)
    if (blocks.length === 0) return

    const allQuoted = blocks.every((block) => block.parentElement?.tagName === 'BLOCKQUOTE')

    if (allQuoted) {
      const quote = blocks[0].parentElement as HTMLElement
      const parent = quote.parentNode
      while (quote.firstChild) {
        parent?.insertBefore(quote.firstChild, quote)
      }
      quote.remove()
    } else {
      const wrapper = document.createElement('blockquote')
      blocks[0].parentNode?.insertBefore(wrapper, blocks[0])
      blocks.forEach((block) => wrapper.appendChild(block))
    }

    handleInput()
  }

  // Wraps the current selection in a real <a href>. Manual DOM because
  // execCommand('createLink') can't reliably set target/rel and mishandles
  // collapsed selections.
  function insertLink() {
    const root = editorRef.current
    if (!root) return
    root.focus()
    const selection = window.getSelection()
    if (!selection) return
    if (selection.rangeCount === 0 || !root.contains(selection.getRangeAt(0).commonAncestorContainer)) {
      const fallback = document.createRange()
      fallback.selectNodeContents(root)
      fallback.collapse(false)
      selection.removeAllRanges()
      selection.addRange(fallback)
    }
    const range = selection.getRangeAt(0).cloneRange()

    const url = window.prompt('Enter a URL:')
    if (!url) return

    const anchor = document.createElement('a')
    anchor.href = url
    anchor.target = '_blank'
    anchor.rel = 'noopener noreferrer'

    if (range.collapsed) {
      anchor.textContent = url
      range.insertNode(anchor)
    } else {
      anchor.appendChild(range.extractContents())
      range.insertNode(anchor)
    }

    const newRange = document.createRange()
    newRange.setStartAfter(anchor)
    newRange.collapse(true)
    selection.removeAllRanges()
    selection.addRange(newRange)

    handleInput()
  }

  // Inserts a real <img src>. Only prompts for a direct image URL for now —
  // this will be replaced with real file upload once Vercel Blob storage is
  // wired up in a future phase.
  function insertImage() {
    const root = editorRef.current
    if (!root) return
    root.focus()
    const selection = window.getSelection()
    if (!selection) return
    if (selection.rangeCount === 0 || !root.contains(selection.getRangeAt(0).commonAncestorContainer)) {
      const fallback = document.createRange()
      fallback.selectNodeContents(root)
      fallback.collapse(false)
      selection.removeAllRanges()
      selection.addRange(fallback)
    }
    const range = selection.getRangeAt(0).cloneRange()

    const url = window.prompt('Enter an image URL:')
    if (!url) return

    const img = document.createElement('img')
    img.src = url
    img.alt = ''

    range.deleteContents()
    range.insertNode(img)

    const newRange = document.createRange()
    newRange.setStartAfter(img)
    newRange.collapse(true)
    selection.removeAllRanges()
    selection.addRange(newRange)

    handleInput()
  }

  // Inserts a real <hr>, followed by an empty paragraph so the caret has
  // somewhere to land that isn't inside the (non-editable) <hr> itself.
  function insertHorizontalRule() {
    const root = editorRef.current
    const selection = window.getSelection()
    if (!root || !selection || selection.rangeCount === 0) return
    const range = selection.getRangeAt(0).cloneRange()
    if (!root.contains(range.commonAncestorContainer)) return

    const hr = document.createElement('hr')
    range.deleteContents()
    range.insertNode(hr)

    const paragraph = document.createElement('p')
    paragraph.appendChild(document.createElement('br'))
    hr.after(paragraph)

    const newRange = document.createRange()
    newRange.setStart(paragraph, 0)
    newRange.collapse(true)
    selection.removeAllRanges()
    selection.addRange(newRange)

    handleInput()
  }

  function buttonClass(active: boolean): string {
    return active ? `${TOOLBAR_BUTTON_BASE} ${TOOLBAR_BUTTON_ACTIVE}` : TOOLBAR_BUTTON_BASE
  }

  // Prevents the toolbar button's mousedown from blurring the editor, which
  // would otherwise collapse the current selection before the click handler
  // (and execCommand) ever runs.
  function preserveSelection(e: React.MouseEvent) {
    e.preventDefault()
  }

  return (
    <div className="border border-border bg-white">
      <div className="flex items-center gap-0.5 flex-wrap bg-deep px-2 py-1.5 border-b border-border">
        <button type="button" title="Bold" onMouseDown={preserveSelection} onClick={() => exec('bold')} className={buttonClass(formats.bold)}>
          <Bold size={16} />
        </button>
        <button type="button" title="Italic" onMouseDown={preserveSelection} onClick={() => exec('italic')} className={buttonClass(formats.italic)}>
          <Italic size={16} />
        </button>
        <button type="button" title="Underline" onMouseDown={preserveSelection} onClick={() => exec('underline')} className={buttonClass(formats.underline)}>
          <Underline size={16} />
        </button>
        <button type="button" title="Strikethrough" onMouseDown={preserveSelection} onClick={() => exec('strikeThrough')} className={buttonClass(formats.strikeThrough)}>
          <Strikethrough size={16} />
        </button>

        <span className={TOOLBAR_DIVIDER} />

        <button type="button" title="Heading 2" onMouseDown={preserveSelection} onClick={() => applyBlockTag('H2')} className={buttonClass(formats.h2)}>
          <Heading2 size={16} />
        </button>
        <button type="button" title="Heading 3" onMouseDown={preserveSelection} onClick={() => applyBlockTag('H3')} className={buttonClass(formats.h3)}>
          <Heading3 size={16} />
        </button>
        <button type="button" title="Paragraph" onMouseDown={preserveSelection} onClick={() => applyBlockTag('P')} className={buttonClass(formats.paragraph)}>
          <Pilcrow size={16} />
        </button>

        <span className={TOOLBAR_DIVIDER} />

        <button type="button" title="Bullet list" onMouseDown={preserveSelection} onClick={() => exec('insertUnorderedList')} className={buttonClass(formats.insertUnorderedList)}>
          <List size={16} />
        </button>
        <button type="button" title="Numbered list" onMouseDown={preserveSelection} onClick={() => exec('insertOrderedList')} className={buttonClass(formats.insertOrderedList)}>
          <ListOrdered size={16} />
        </button>
        <button type="button" title="Blockquote" onMouseDown={preserveSelection} onClick={toggleBlockquote} className={buttonClass(formats.blockquote)}>
          <Quote size={16} />
        </button>

        <span className={TOOLBAR_DIVIDER} />

        <button type="button" title="Align left" onMouseDown={preserveSelection} onClick={() => exec('justifyLeft')} className={buttonClass(formats.justifyLeft)}>
          <AlignLeft size={16} />
        </button>
        <button type="button" title="Align center" onMouseDown={preserveSelection} onClick={() => exec('justifyCenter')} className={buttonClass(formats.justifyCenter)}>
          <AlignCenter size={16} />
        </button>
        <button type="button" title="Align right" onMouseDown={preserveSelection} onClick={() => exec('justifyRight')} className={buttonClass(formats.justifyRight)}>
          <AlignRight size={16} />
        </button>
        <button type="button" title="Indent" onMouseDown={preserveSelection} onClick={() => exec('indent')} className={buttonClass(false)}>
          <IndentIncrease size={16} />
        </button>
        <button type="button" title="Outdent" onMouseDown={preserveSelection} onClick={() => exec('outdent')} className={buttonClass(false)}>
          <IndentDecrease size={16} />
        </button>

        <span className={TOOLBAR_DIVIDER} />

        <button type="button" title="Insert link" onMouseDown={preserveSelection} onClick={insertLink} className={buttonClass(false)}>
          <Link2 size={16} />
        </button>
        <button type="button" title="Insert image" onMouseDown={preserveSelection} onClick={insertImage} className={buttonClass(false)}>
          <ImagePlus size={16} />
        </button>
        <button type="button" title="Horizontal rule" onMouseDown={preserveSelection} onClick={insertHorizontalRule} className={buttonClass(false)}>
          <Minus size={16} />
        </button>

        <span className={TOOLBAR_DIVIDER} />

        <button type="button" title="Undo" onMouseDown={preserveSelection} onClick={() => exec('undo')} className={buttonClass(false)}>
          <Undo2 size={16} />
        </button>
        <button type="button" title="Redo" onMouseDown={preserveSelection} onClick={() => exec('redo')} className={buttonClass(false)}>
          <Redo2 size={16} />
        </button>
      </div>

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onMouseUp={updateActiveFormats}
        onKeyUp={updateActiveFormats}
        className="rte-content min-h-[400px] px-6 py-5 font-sans text-[15px] leading-relaxed text-ink outline-none [&_h1]:font-display [&_h1]:text-[26px] [&_h1]:font-semibold [&_h1]:text-deep [&_h1]:mt-6 [&_h1]:mb-3 [&_h2]:font-display [&_h2]:text-[21px] [&_h2]:font-semibold [&_h2]:text-deep [&_h2]:mt-5 [&_h2]:mb-2.5 [&_h3]:font-display [&_h3]:text-[18px] [&_h3]:font-semibold [&_h3]:text-deep [&_h3]:mt-4 [&_h3]:mb-2 [&_p]:mb-3 [&_a]:text-teal [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-gold [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted [&_blockquote]:my-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-3 [&_hr]:border-border [&_hr]:my-6 [&_img]:max-w-full [&_img]:my-4"
      />
    </div>
  )
}
