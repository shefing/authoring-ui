'use client'
import * as React from 'react'

type LexicalNode = {
  type: string
  children?: LexicalNode[]
  text?: string
  format?: number
  tag?: string
  fields?: any
  [key: string]: any
}

type LexicalContent = {
  root?: {
    children?: LexicalNode[]
  }
}

type RichTextRendererProps = {
  content: any
  textSize?: number | string
  colors?: Record<string, string>
  spacing?: Record<string, string>
  radii?: Record<string, string>
  onButtonClick?: (kind: string) => void
  customButtons?: Array<{
    kind: string
    label: string
    backgroundColor: string
    textColor: string
  }>
  variableValues?: Record<string, string>
}

export function RichTextRenderer({
  content,
  textSize = 16,
  colors = {},
  spacing = {},
  radii = {},
  onButtonClick,
  customButtons = [],
  variableValues = {},
}: RichTextRendererProps) {
  const getButtonStyle = React.useCallback((actionKind: string) => {
    const customButton = customButtons.find((btn) => btn.kind === actionKind)
    if (customButton) {
      return {
        backgroundColor: customButton.backgroundColor,
        color: customButton.textColor,
        label: customButton.label,
      }
    }
    return {
      backgroundColor: colors.primary || '#3b82f6',
      color: colors.buttonText || '#ffffff',
      label: null,
    }
  }, [colors.buttonText, colors.primary, customButtons])

  const getButtonStyles = React.useCallback((actionKind: string) => {
    const buttonStyle = getButtonStyle(actionKind)
    const baseSize = typeof textSize === 'number' ? textSize : parseFloat(String(textSize)) || 16;
    return {
      padding: `${spacing.xsmall || '8px'} ${spacing.small || '12px'}`,
      backgroundColor: buttonStyle.backgroundColor,
      color: buttonStyle.color,
      border: 'none',
      borderRadius: radii.small || '4px',
      fontSize: `${baseSize * 0.875}px`,
      fontWeight: 500,
      cursor: 'pointer',
      transition: 'opacity 0.2s',
    }
  }, [getButtonStyle, radii.small, spacing.small, spacing.xsmall, textSize])

  const renderLexicalNode = React.useCallback((node: LexicalNode, index: number, renderFn: (node: LexicalNode, index: number, fn: any) => React.ReactNode): React.ReactNode => {
    if (!node) return null

    // Text node
    if (node.type === 'text') {
      const textStyle: React.CSSProperties = {}
      const decorations: string[] = []

      // Format: 1 = bold, 2 = italic, 4 = strikethrough, 8 = underline (bitwise flags)
      // Some implementations use different bit positions, so we check multiple patterns
      if (node.format) {
        // Bold
        if (node.format & 1) textStyle.fontWeight = 'bold'

        // Italic
        if (node.format & 2) textStyle.fontStyle = 'italic'

        // Strikethrough
        if (node.format & 4) decorations.push('line-through')

        // Underline - check multiple possible bit positions
        if (node.format & 8) decorations.push('underline')
        if (node.format & 16) decorations.push('underline')
      }

      // Apply text decorations
      if (decorations.length > 0) {
        textStyle.textDecoration = decorations.join(' ')
      }

      return (
        <span key={index} style={textStyle}>
          {node.text}
        </span>
      )
    }

    // Paragraph node
    if (node.type === 'paragraph') {
      return (
        <p
          key={index}
          style={{
            margin: `${spacing.small || '12px'} 0`,
            fontSize: 'inherit',
            lineHeight: 1.5,
            fontFamily: 'inherit',
            color: 'inherit', // Ensure it inherits color from container
          }}
        >
          {node.children?.map((child, idx) => renderFn(child, idx, renderFn))}
        </p>
      )
    }

    // Heading nodes
    if (node.type === 'heading') {
      const HeadingTag = node.tag || 'h2'
      // Use numeric values for calculation, but fallback to strings if necessary
      const baseSize = typeof textSize === 'number' ? textSize : parseFloat(String(textSize)) || 16;
      const headingSizes: Record<string, string> = {
        h1: `${baseSize * 2}px`,
        h2: `${baseSize * 1.5}px`,
        h3: `${baseSize * 1.25}px`,
      }

      return React.createElement(
        HeadingTag,
        {
          key: index,
          style: {
            fontSize: headingSizes[HeadingTag] || `${baseSize * 1.5}px`,
            fontWeight: 600,
            margin: `${spacing.medium || '16px'} 0 ${spacing.small || '12px'} 0`,
            color: colors.text || '#374151',
          },
        },
        node.children?.map((child, idx) => renderFn(child, idx, renderFn)),
      )
    }

    // Quote/Blockquote node
    if (node.type === 'quote') {
      return (
        <blockquote
          key={index}
          style={{
            borderLeft: `4px solid ${colors.primary || '#3b82f6'}`,
            paddingLeft: spacing.medium || '16px',
            margin: `${spacing.medium || '16px'} 0`,
            fontStyle: 'italic',
            color: colors.textMuted || '#6b7280',
          }}
        >
          {node.children?.map((child, idx) => renderFn(child, idx, renderFn))}
        </blockquote>
      )
    }

    // Block node (for images and other blocks)
    if (node.type === 'inlineBlock' || node.type === 'block') {
      const { fields } = node

      // Image block
      if (fields?.blockType === 'image' && fields?.asset) {
        return (
          <img
            key={index}
            src={fields.asset.url}
            alt={fields.alt || fields.asset.alt || ''}
            style={{
              maxWidth: '100%',
              height: 'auto',
              borderRadius: radii.small || '4px',
              margin: `${spacing.small || '12px'} 0`,
              display: 'block',
            }}
          />
        )
      }

      // Variable block (inline)
      if (fields?.blockType === 'var' && fields?.variable) {
        const varKey = fields.variable.key || fields.variable.name
        const varType = fields.variable.type || 'string'

        // Use the actual value from variableValues if available, otherwise use textToDisplay or variable name
        const displayText =
          variableValues[varKey] || fields.textToDisplay || fields.variable.name || 'variable'

        // URL - render as actual link
        if (varType === 'url') {
          return (
            <a
              key={index}
              href={displayText}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: colors.primary || '#3b82f6',
                textDecoration: 'underline',
              }}
            >
              {displayText}
            </a>
          )
        }

        // Email - render as link with blue color
        if (varType === 'email') {
          return (
            <a
              key={index}
              href={`mailto:${displayText}`}
              style={{
                color: colors.primary || '#3b82f6',
                textDecoration: 'underline',
              }}
            >
              {displayText}
            </a>
          )
        }

        // Date/DateTime - render with underline (like Cmd+U)
        if (varType === 'date' || varType === 'dateTime') {
          return (
            <span
              key={index}
              style={{
                textDecoration: 'underline',
              }}
            >
              {displayText}
            </span>
          )
        }

        // Boolean - render as regular text with checkmark/x
        if (varType === 'boolean') {
          const boolValue = displayText.toLowerCase()
          const icon = boolValue === 'true' || boolValue === '1' ? '✓' : '✗'
          return (
            <span key={index}>
              {icon} {displayText}
            </span>
          )
        }

        // String, Number, Enum - render as regular text
        return <span key={index}>{displayText}</span>
      }

      // CTA block (inline button)
      if (fields?.blockType === 'cta') {
        return (
          <button
            key={index}
            type="button"
            style={{
              ...getButtonStyles(fields.kind || 'approve'),
              display: 'inline-block',
              margin: '0 4px',
            }}
            onClick={() => onButtonClick?.(fields.kind || 'approve')}
            onMouseOver={(e) => (e.currentTarget.style.opacity = '0.9')}
            onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
          >
            {fields.label || fields.kind}
          </button>
        )
      }
    }

    // Fallback for unknown nodes
    if (node.children) {
      return (
        <div key={index}>{node.children.map((child, idx) => renderFn(child, idx, renderFn))}</div>
      )
    }

    return null
  }, [colors.primary, colors.text, colors.textMuted, getButtonStyles, onButtonClick, radii.small, spacing.medium, spacing.small, textSize, variableValues])

  // Check if content is a Lexical rich text object
  if (typeof content === 'object' && content !== null && !Array.isArray(content)) {
    const lexicalContent = content as LexicalContent
    if (lexicalContent.root?.children) {
      return (
        <div style={{ marginBottom: spacing.medium || '16px', color: 'inherit', fontFamily: 'inherit' }}>
          {lexicalContent.root.children.map((node, idx) => renderLexicalNode(node, idx, renderLexicalNode))}
          <div style={{ height: spacing.small || '12px' }} />
        </div>
      )
    }
  }

  // Fallback to plain text
  return (
    <div
      style={{
        fontSize: 'inherit',
        lineHeight: 1.5,
        color: 'inherit', // Inherit from container
        marginBottom: spacing.medium || '16px',
        whiteSpace: 'pre-wrap',
        fontFamily: 'inherit',
      }}
    >
      {String(content)}
    </div>
  )
}
