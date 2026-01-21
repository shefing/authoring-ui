'use client'
import * as React from 'react'
import type { Branding } from '@/payload-types'
import type {MessageContent} from '../lib/messages'
import {RichTextRenderer} from './RichTextRenderer'
import {resolveTailwindColor} from '../lib/utils'

type MessagePreviewProps = {
  content: MessageContent
  branding?: Branding | null
  asPopup?: boolean
  onClose?: () => void
  variableValues?: Record<string, string>
  previewHtml?: string
}

export function MessagePreview({
  content,
  branding,
  asPopup = false,
  onClose,
  variableValues = {},
  previewHtml,
}: MessagePreviewProps) {
  // Extract typography settings from Branding
  const typography = branding?.messageTypography || {}
  const titleTypography = branding?.titleTypography || {}
  
  // Dynamically load font families if they are not already present
  React.useEffect(() => {
    const fontsToLoad = new Set<string>()
    if (typography.fontFamily) fontsToLoad.add(typography.fontFamily)
    if (titleTypography.fontFamily) fontsToLoad.add(titleTypography.fontFamily)
    
    fontsToLoad.forEach(font => {
      // Very basic check - if it has spaces or looks like a Google Font name, try to load it
      if (font && !['serif', 'sans-serif', 'monospace', 'cursive', 'fantasy', 'system-ui', '-apple-system'].includes(font.toLowerCase())) {
        const linkId = `font-${font.replace(/\s+/g, '-').toLowerCase()}`
        if (!document.getElementById(linkId)) {
          console.log(`[DEBUG_LOG] Loading font: ${font}`);
          const link = document.createElement('link')
          link.id = linkId
          link.rel = 'stylesheet'
          link.href = `https://fonts.googleapis.com/css2?family=${font.replace(/\s+/g, '+')}:wght@100;200;300;400;500;600;700;800;900&display=swap`
          document.head.appendChild(link)
        }
      }
    })
  }, [typography.fontFamily, titleTypography.fontFamily])

  const parseFontSize = (size: string | number | undefined, defaultValue: number): number => {
    if (size === undefined || size === null || size === '') return defaultValue
    if (typeof size === 'number') return size
    const parsed = parseFloat(size)
    return isNaN(parsed) ? defaultValue : parsed
  }

  const textSize = parseFontSize(typography.fontSize as string, 16)
  const titleTextSize = parseFontSize(titleTypography.fontSize as string, textSize * 1.25)

  // Extract settings from branding
  const colors = (branding as any)?.colors || {}
  const buttonStyles = (branding as any)?.buttonStyles || {}
  const spacing = (branding as any)?.spacing || {}
  const radii = (branding as any)?.radii || {}

  const direction: any = 'ltr' 
  const messageWidth = 500 
  const titleAlignment: any = 'left' 
  const flip: any = { left: 'right', right: 'left' }

  const buttonsAlignment: any = 'center'

  const logoPosition: any = 'center'
  const signaturePosition: any = 'center'

  // Determine what to show based on availability in branding
  const showTitle = !!content?.title
  const showLogo = !!(branding?.logo && typeof branding.logo === 'object' && (branding.logo as any).url) || !!((branding as any)?.logoSettings?.logo?.url)
  const logoUrl = (branding?.logo && typeof branding.logo === 'object' && (branding.logo as any).url) || (branding as any)?.logoSettings?.logo?.url || ''
  const showSignature = false

  // Get button style by action kind
  const getButtonStyle = React.useCallback((actionKind: string) => {
    if (actionKind === 'approve' || actionKind === 'primary') {
      const approveBg = (branding as any)?.approveBtn?.bgColor || (buttonStyles as any).approveBgColor || (colors as any).actionPrimaryColor || '#3b82f6'
      const approveText = (branding as any)?.approveBtn?.textColor || (buttonStyles as any).approveTextColor || '#ffffff'
      return {
        backgroundColor: resolveTailwindColor(approveBg),
        color: resolveTailwindColor(approveText),
        label: (branding as any)?.approveBtn?.label || 'Approve',
      }
    }
    if (actionKind === 'dismiss' || actionKind === 'secondary') {
      const dismissBg = (branding as any)?.buttonStyles?.dismissBgColor || (buttonStyles as any).dismissBgColor || (colors as any).actionSecondaryColor || '#6b7280'
      const dismissText = (branding as any)?.buttonStyles?.dismissTextColor || (buttonStyles as any).dismissTextColor || '#ffffff'
      return {
        backgroundColor: resolveTailwindColor(dismissBg),
        color: resolveTailwindColor(dismissText),
        label: 'Dismiss',
      }
    }
    return {
      backgroundColor: resolveTailwindColor((colors as any).actionPrimaryColor || '#3b82f6'),
      color: resolveTailwindColor('#ffffff'),
      label: 'Action',
    }
  }, [branding, buttonStyles, colors])

  const styles = React.useMemo(() => ({
    overlay: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px',
    },
    popupWrapper: {
      position: 'relative' as const,
    },
    closeButton: {
      position: 'absolute' as const,
      top: '-10px',
      right: '-10px',
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      backgroundColor: '#000000',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1001,
      transition: 'opacity 0.2s',
    },
    closeIcon: {
      color: '#ffffff',
      fontSize: '20px',
      fontWeight: 'bold',
      lineHeight: 1,
    },
    container: {
      backgroundColor: resolveTailwindColor((branding as any)?.colors?.messageBackgroundColor || (branding as any)?.themeTokens?.colors?.background || (branding as any)?.generalStyling?.messageBackgroundColor || colors.messageBackgroundColor || colors.background || '#ffffff'),
      color: resolveTailwindColor((branding as any)?.colors?.messageTextColor || (branding as any)?.themeTokens?.colors?.text || (branding as any)?.generalStyling?.messageTextColor || colors.messageTextColor || colors.text || '#000000'),
      padding: spacing.medium || '16px',
      borderRadius: radii.medium || '8px',
      border: `1px solid ${resolveTailwindColor((branding as any)?.colors?.actionSecondaryColor || colors.border || '#e5e7eb')}`,
      width: (messageWidth as any) === '100%' ? '100%' : `${messageWidth}px`,
      maxWidth: '100%',
      fontFamily: typography.fontFamily ? `${typography.fontFamily}, system-ui, -apple-system, sans-serif` : 'system-ui, -apple-system, sans-serif',
      fontSize: typeof typography.fontSize === 'number' ? `${typography.fontSize}px` : (typography.fontSize || `${textSize}px`),
      fontWeight: typography.fontWeight === 'italic' || typography.fontWeight === 'bold-italic' ? 'normal' : (typography.fontWeight || 'normal'),
      fontStyle: typography.fontWeight === 'italic' || typography.fontWeight === 'bold-italic' ? 'italic' : 'normal',
      direction: direction,
      margin: '0 auto',
      textAlign: 'left' as const, // Default text alignment for body
      ...(asPopup && {
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        maxHeight: '90vh',
        overflowY: 'auto' as const,
      }),
    },
    logoContainer: {
      display: 'flex',
      justifyContent:
        (branding as any)?.logoSettings?.logoPos || logoPosition === 'center'
          ? 'center'
          : ((branding as any)?.logoSettings?.logoPos || logoPosition) === 'right-inline'
            ? 'flex-end'
            : 'flex-start',
      marginBottom: spacing.small || '12px',
    },
    headerInline: {
      display: 'flex',
      alignItems: 'center',
      gap: spacing.small || '12px',
      marginBottom: spacing.medium || '16px',
      justifyContent:
        titleAlignment === 'center'
          ? 'center'
          : titleAlignment === 'right'
            ? 'flex-end'
            : 'flex-start',
      flexDirection: logoPosition === 'right-inline' ? ('row-reverse' as const) : ('row' as const),
    },
    headerBlock: {
      marginBottom: spacing.medium || '16px',
    },
    logo: {
      width: 'auto',
      height: 'fit-content',
      objectFit: 'cover' as const,
      borderRadius: radii.small || '4px',
    },
    title: {
      fontSize: typeof titleTypography.fontSize === 'number' ? `${titleTypography.fontSize}px` : titleTypography.fontSize || `${titleTextSize}px`,
      fontWeight: titleTypography.fontWeight === 'italic' || titleTypography.fontWeight === 'bold-italic' ? 'normal' : (titleTypography.fontWeight || 600),
      fontStyle: titleTypography.fontWeight === 'italic' || titleTypography.fontWeight === 'bold-italic' ? 'italic' : 'normal',
      color: resolveTailwindColor((branding as any)?.colors?.actionPrimaryColor || colors.primary || '#1f2937'),
      margin: 0,
      fontFamily: titleTypography.fontFamily ? `${titleTypography.fontFamily}, ${typography.fontFamily ? `${typography.fontFamily}, ` : ''}system-ui, -apple-system, sans-serif` : 'inherit',
      textAlign: titleAlignment as 'left' | 'center' | 'right',
      display: 'block', // Ensure it behaves like a block element since we're using div
      lineHeight: 1.2,
      borderBottom: `2px solid ${resolveTailwindColor((branding as any)?.colors?.actionSecondaryColor || colors.secondary || 'transparent')}`,
      paddingBottom: (branding as any)?.colors?.actionSecondaryColor ? '8px' : '0',
      marginBottom: (branding as any)?.colors?.actionSecondaryColor ? '16px' : '0',
    },

    actions: {
      display: 'flex',
      gap: spacing.small || '8px',
      flexWrap: 'wrap' as const,
      justifyContent:
        buttonsAlignment === 'center'
          ? 'center'
          : buttonsAlignment === 'right'
            ? 'flex-end'
            : 'flex-start',
    },
    signature: {
      marginTop: spacing.medium || '16px',
      paddingTop: spacing.small || '12px',
      borderTop: `1px solid ${colors.border || '#e5e7eb'}`,
      fontSize: `${textSize * 0.75}px`,
      color: colors.textMuted || '#6b7280',
      fontStyle: 'italic',
    },
  }), [asPopup, branding, buttonsAlignment, colors.background, colors.border, colors.primary, colors.text, colors.textMuted, direction, logoPosition, messageWidth, radii.medium, radii.small, spacing.medium, spacing.small, spacing.xsmall, titleAlignment, titleTextSize, titleTypography.fontWeight, titleTypography.fontSize, titleTypography.fontFamily, typography.fontFamily, typography.fontSize, typography.fontWeight, textSize])

  const getButtonStyles = React.useCallback((actionKind: string) => {
    const buttonStyle = getButtonStyle(actionKind)
    return {
      padding: `${spacing.xsmall || '8px'} ${spacing.small || '12px'}`,
      backgroundColor: buttonStyle.backgroundColor,
      color: buttonStyle.color,
      border: 'none',
      borderRadius: radii.small || '4px',
      fontSize: `${textSize * 0.875}px`,
      fontWeight: 500,
      cursor: 'pointer',
      transition: 'opacity 0.2s',
    }
  }, [getButtonStyle, radii.small, spacing.small, spacing.xsmall, textSize])

  const renderHeader = () => {
    if (!showTitle && !showLogo) return null

    return (
      <>
        {showLogo && (
          <div style={styles.logoContainer}>
            <img src={logoUrl} alt="Logo" style={styles.logo} />
          </div>
        )}
        {showTitle && (
          <div style={styles.headerBlock}>
            <div style={styles.title}>{content.title}</div>
          </div>
        )}
      </>
    )
  }

  const messageContent = (
    <div style={styles.container}>
      {renderHeader()}

      {previewHtml ? (
        <div
          style={{
            fontSize: 'inherit',
            lineHeight: 1.5,
            color: 'inherit',
            marginBottom: spacing.medium || '16px',
            whiteSpace: 'pre-wrap',
            fontFamily: 'inherit',
          }}
          dangerouslySetInnerHTML={{ __html: previewHtml }}
        />
      ) : (
        <RichTextRenderer
          content={content.body}
          textSize={textSize}
          colors={colors}
          spacing={spacing}
          radii={radii}
          variableValues={variableValues}
          customButtons={[]}
        />
      )}

      {(content.actions && content.actions.length > 0) && (
        <div style={styles.actions}>
          {content.actions?.map((action, idx) => {
            const buttonStyle = getButtonStyle(action.kind)
            return (
              <button
                key={idx}
                type="button"
                style={getButtonStyles(action.kind)}
                onClick={() => onClose?.()}
                onMouseOver={(e) => (e.currentTarget.style.opacity = '0.9')}
                onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
              >
                {buttonStyle.label || action.label}
              </button>
            )
          })}
        </div>
      )}

      {showSignature && (
        <div
          style={{
            ...styles.signature,
            textAlign: signaturePosition as 'left' | 'right' | 'center',
          }}
        >
          {/* signature text would go here */}
        </div>
      )}
    </div>
  )

  if (asPopup) {
    return (
      <div style={styles.overlay} onClick={() => onClose?.()}>
        <div style={styles.popupWrapper} onClick={(e) => e.stopPropagation()}>
          <button
            style={styles.closeButton}
            onClick={() => onClose?.()}
            onMouseOver={(e) => (e.currentTarget.style.opacity = '0.8')}
            onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
            aria-label="Close"
          >
            <span style={styles.closeIcon}>✕</span>
          </button>
          {messageContent}
        </div>
      </div>
    )
  }

  return messageContent
}
