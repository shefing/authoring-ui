'use client'
import * as React from 'react'
import type { MessageContent } from '../lib/messages'
import { RichTextRenderer } from './RichTextRenderer'

type BrandingPackage = {
  generalStyling?: {
    textColorText?: string
    backgroundColorText?: string
    direction?: 'ltr' | 'rtl'
    messageWidth?: number
    titleAlign?: 'left' | 'center' | 'right'
  }
  logoSettings?: {
    logo?: { url: string }
    logoPos?: 'left-inline' | 'right-inline' | 'before' | 'after' | 'center'
  }
  approveBtn?: {
    label?: string
    bgColor?: string
    textColor?: string
    align?: 'left' | 'center' | 'right'
  }
  signature?: {
    text?: string
    position?: 'left' | 'right' | 'center'
  }
  themeTokens?: {
    colors?: Record<string, string>
    spacing?: Record<string, string>
    radii?: Record<string, string>
    typography?: Record<string, any>
  }
}

type MessagePreviewProps = {
  content: MessageContent
  branding?: BrandingPackage | null
  asPopup?: boolean
  onClose?: () => void
  variableValues?: Record<string, string>
}

export function MessagePreview({
  content,
  branding,
  asPopup = false,
  onClose,
  variableValues = {},
}: MessagePreviewProps) {
  const colors = branding?.themeTokens?.colors || {}
  const spacing = branding?.themeTokens?.spacing || {}
  const radii = branding?.themeTokens?.radii || {}
  const textSize = 16

  // Extract settings from branding
  const generalStyling = branding?.generalStyling || {}
  const logoSettings = branding?.logoSettings || {}
  const approveBtn = branding?.approveBtn || {}
  const signature = branding?.signature || {}

  const direction = generalStyling.direction || 'ltr'
  const messageWidth = generalStyling.messageWidth || 500
  const titleAlignment = generalStyling.titleAlign || 'left'
  const flip: Record<'left' | 'right', 'right' | 'left'> = { left: 'right', right: 'left' }

  const buttonsAlignment: 'left' | 'center' | 'right' =
    generalStyling.direction === 'ltr'
      ? approveBtn.align || 'center' // אם undefined → center
      : (approveBtn.align && flip[approveBtn.align as 'left' | 'right']) || 'center'

  const logoPosition = logoSettings.logoPos || 'center'
  const signaturePosition = signature.position || 'center'

  // Determine what to show based on availability in branding
  const showTitle = true // Always show title
  const showLogo = !!logoSettings.logo?.url
  const showApproveButton = !!approveBtn.label
  const showSignature = !!signature.text

  // Get button style by action kind
  const getButtonStyle = (actionKind: string) => {
    if (actionKind === 'approve' && approveBtn) {
      return {
        backgroundColor: approveBtn.bgColor || '#3b82f6',
        color: approveBtn.textColor || '#ffffff',
        label: approveBtn.label || 'Approve',
      }
    }
    return {
      backgroundColor: colors.primary || '#3b82f6',
      color: colors.buttonText || '#ffffff',
      label: null,
    }
  }

  const styles = {
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
      backgroundColor: generalStyling.backgroundColorText || colors.background || '#ffffff',
      color: generalStyling.textColorText || colors.text || '#000000',
      padding: spacing.medium || '16px',
      borderRadius: radii.medium || '8px',
      border: `1px solid ${colors.border || '#e5e7eb'}`,
      width: `${messageWidth}px`,
      fontFamily: 'system-ui, -apple-system, sans-serif',
      direction: direction,
      ...(asPopup && {
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        maxHeight: '90vh',
        overflowY: 'auto' as const,
      }),
    },
    logoContainer: {
      display: 'flex',
      justifyContent:
        logoPosition === 'center'
          ? 'center'
          : logoPosition === 'right-inline'
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
      textAlign: titleAlignment as 'left' | 'center' | 'right',
    },
    logo: {
      width: '40px',
      height: '40px',
      objectFit: 'cover' as const,
      borderRadius: radii.small || '4px',
    },
    title: {
      fontSize: `${textSize * 1.25}px`,
      fontWeight: 600,
      color: colors.primary || '#1f2937',
      margin: 0,
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
  }

  const getButtonStyles = (actionKind: string) => {
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
  }

  const renderHeader = () => {
    if (!showTitle && !showLogo) return null

    const logoUrl = logoSettings.logo?.url
    const isInline = logoPosition === 'left-inline' || logoPosition === 'right-inline'

    // Logo before title (separate row)
    if (showLogo && logoPosition === 'before') {
      return (
        <>
          <div style={styles.logoContainer}>
            <img src={logoUrl} alt="Logo" style={styles.logo} />
          </div>
          {showTitle && (
            <div style={styles.headerBlock}>
              <h2 style={styles.title}>{content.title}</h2>
            </div>
          )}
        </>
      )
    }

    // Logo after title (separate row)
    if (showLogo && logoPosition === 'after') {
      return (
        <>
          {showTitle && (
            <div style={styles.headerBlock}>
              <h2 style={styles.title}>{content.title}</h2>
            </div>
          )}
          <div style={styles.logoContainer}>
            <img src={logoUrl} alt="Logo" style={styles.logo} />
          </div>
        </>
      )
    }

    // Logo center (separate row)
    if (showLogo && logoPosition === 'center') {
      return (
        <>
          <div style={styles.logoContainer}>
            <img src={logoUrl} alt="Logo" style={styles.logo} />
          </div>
          {showTitle && (
            <div style={styles.headerBlock}>
              <h2 style={styles.title}>{content.title}</h2>
            </div>
          )}
        </>
      )
    }

    // Logo inline (same row)
    if (showLogo && showTitle && isInline) {
      return (
        <div style={styles.headerInline}>
          <img src={logoUrl} alt="Logo" style={styles.logo} />
          <h2 style={styles.title}>{content.title}</h2>
        </div>
      )
    }

    // Only title, no logo
    if (showTitle) {
      return (
        <div style={styles.headerBlock}>
          <h2 style={styles.title}>{content.title}</h2>
        </div>
      )
    }

    // Only logo, no title
    if (showLogo) {
      return (
        <div style={styles.logoContainer}>
          <img src={logoUrl} alt="Logo" style={styles.logo} />
        </div>
      )
    }

    return null
  }

  const messageContent = (
    <div style={styles.container}>
      {renderHeader()}

      <RichTextRenderer
        content={content.body}
        textSize={textSize}
        colors={colors}
        spacing={spacing}
        radii={radii}
        variableValues={variableValues}
        customButtons={
          approveBtn
            ? [
                {
                  kind: 'approve',
                  label: approveBtn.label || 'Approve',
                  backgroundColor: approveBtn.bgColor || '#3b82f6',
                  textColor: approveBtn.textColor || '#ffffff',
                },
              ]
            : []
        }
      />

      {((content.actions && content.actions.length > 0) || showApproveButton) && (
        <div style={styles.actions}>
          {showApproveButton && (
            <button
              type="button"
              style={getButtonStyles('approve')}
              onClick={() => onClose?.()}
              onMouseOver={(e) => (e.currentTarget.style.opacity = '0.9')}
              onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
            >
              {approveBtn.label || 'Approve'}
            </button>
          )}
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

      {showSignature && signature.text && (
        <div
          style={{
            ...styles.signature,
            textAlign: signaturePosition as 'left' | 'right' | 'center',
          }}
        >
          {signature.text}
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
