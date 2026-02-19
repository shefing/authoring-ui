'use client'

import React from 'react'
import { useLivePreview } from '@payloadcms/live-preview-react'
import { Message, Template, Branding } from '@/payload-types'
import { MessagePreview } from '@/app/(frontend)/components/MessagePreview'
import { splitRenderData } from '@/lib/messageRenderData'

export const MessagePreviewPage: React.FC<{ initialData: Message }> = ({ initialData }) => {
  const { data } = useLivePreview<Message>({
    serverURL: process.env.NEXT_PUBLIC_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'),
    depth: 3,
    initialData: initialData,
  })

  const messageData = data || initialData
  const templateData = messageData.template as Template | undefined
  const brandingData = templateData?.branding as Branding | undefined

  // Dynamically load font families for the preview page itself
  React.useEffect(() => {
    if (!brandingData) return
    const fontsToLoad = new Set<string>()
    if (brandingData.message?.fontFamily) fontsToLoad.add(brandingData.message.fontFamily)
    if (brandingData.title?.fontFamily) fontsToLoad.add(brandingData.title.fontFamily)
    
    fontsToLoad.forEach(font => {
      if (font && !['serif', 'sans-serif', 'monospace', 'cursive', 'fantasy', 'system-ui', '-apple-system'].includes(font.toLowerCase())) {
        const linkId = `preview-font-${font.replace(/\s+/g, '-').toLowerCase()}`
        if (!document.getElementById(linkId)) {
          const link = document.createElement('link')
          link.id = linkId
          link.rel = 'stylesheet'
          link.href = `https://fonts.googleapis.com/css2?family=${font.replace(/\s+/g, '+')}:wght@100;200;300;400;500;600;700;800;900&display=swap`
          document.head.appendChild(link)
        }
      }
    })
  }, [brandingData?.message?.fontFamily, brandingData?.title?.fontFamily])
  
  const mappedBranding = React.useMemo(() => {
    if (!brandingData) return null

    return {
        titleTypography: brandingData.title,
        messageTypography: brandingData.message,
        general: brandingData.general,
        title: brandingData.title,
        message: brandingData.message,
        actions: brandingData.actions,
        themeTokens: {
          colors: {
            primary: brandingData.actions?.primaryBackground || '',
            secondary: brandingData.actions?.secondaryBackground || '',
            text: brandingData.message?.textColor || '',
            background: brandingData.general?.messageBackgroundColor || '',
            border: brandingData.general?.borderColor || '',
            buttonText: '#ffffff',
          },
          typography: {
            fontFamily: brandingData.message?.fontFamily || '',
            fontSize: brandingData.message?.fontSize || '',
            fontWeight: brandingData.message?.fontWeight || '',
          },
          titleTypography: {
            fontFamily: brandingData.title?.fontFamily || '',
            fontSize: brandingData.title?.fontSize || '',
            fontWeight: brandingData.title?.fontWeight || '',
          }
        },
        generalStyling: {
            messageTextColor: brandingData.message?.textColor || '',
            messageBackgroundColor: brandingData.general?.messageBackgroundColor || '',
            direction: 'ltr' as const,
            messageWidth: 500,
            titleAlign: 'center' as const,
        },
        logoSettings: {
            logo: brandingData.logo && typeof brandingData.logo === 'object' 
                ? { url: (brandingData.logo as any).url || '' } 
                : undefined,
            logoPos: 'center' as const
        },
        approveBtn: {
            label: 'Approve',
            bgColor: brandingData.actions?.primaryBackground || '',
            textColor: brandingData.actions?.primaryText || '#ffffff',
            align: 'center' as const,
        },
        buttonStyles: {
            dismissBgColor: brandingData.actions?.secondaryBackground || '',
            dismissTextColor: brandingData.actions?.secondaryText || '#ffffff',
        },
    }
  }, [brandingData])

  const renderData = React.useMemo(
    () => splitRenderData(messageData.renderData as any),
    [messageData.renderData],
  )

  const messageContent = React.useMemo(() => {
    const templateButtons = Array.isArray(templateData?.buttons) ? templateData?.buttons : []
    const buttonLabels = templateButtons.map((buttonEntry: any, index: number) => {
      const buttonDoc = buttonEntry?.button && typeof buttonEntry.button === 'object' ? buttonEntry.button : null
      const defaultLabel = buttonEntry?.label || buttonDoc?.label || buttonDoc?.name || `Button ${index + 1}`
      return renderData.buttons[index] || defaultLabel
    })

    return {
      title: messageData.title,
      body: messageData.content || templateData?.body,
      actions: buttonLabels.map((label, index) => ({
        kind: index === 0 ? 'primary' : 'secondary',
        label,
      })),
    }
  }, [messageData.title, messageData.content, templateData?.body, templateData?.buttons, renderData.buttons])

  return (
    <div 
      style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#f4f4f4', minHeight: '100vh', color: '#000' }}
    >
      <div style={{ width: '100%', maxWidth: '800px' }}>
        <h2 style={{ 
          textAlign: 'center', 
          marginBottom: '20px', 
          color: 'inherit', 
          fontSize: '24px',
          fontWeight: 'bold',
          fontFamily: 'system-ui, sans-serif',
          margin: '0 0 20px 0'
        }}>
            Message Preview: {messageData.name}
        </h2>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <MessagePreview 
                content={messageContent as any} 
                branding={mappedBranding as any}
                variableValues={renderData.variables}
            />
        </div>
        
        {process.env.NODE_ENV === 'development' && (
          <details style={{ marginTop: '40px', padding: '10px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#fff' }}>
              <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>View Raw Message Data (JSON)</summary>
              <pre style={{ fontSize: '12px', overflow: 'auto', marginTop: '10px' }}>
                  {JSON.stringify(messageData, null, 2)}
              </pre>
          </details>
        )}
      </div>
    </div>
  )
}
