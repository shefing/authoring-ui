'use client'

import React from 'react'
import { useLivePreview } from '@payloadcms/live-preview-react'
import { Message, Template, Branding } from '@/payload-types'
import { MessagePreview } from '@/app/(frontend)/components/MessagePreview'

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
    if (brandingData.messageTypography?.fontFamily) fontsToLoad.add(brandingData.messageTypography.fontFamily)
    if (brandingData.titleTypography?.fontFamily) fontsToLoad.add(brandingData.titleTypography.fontFamily)
    
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
  }, [brandingData?.messageTypography?.fontFamily, brandingData?.titleTypography?.fontFamily])
  
  const mappedBranding = React.useMemo(() => {
    if (!brandingData) return null

    return {
        titleTypography: brandingData.titleTypography,
        messageTypography: brandingData.messageTypography,
        themeTokens: {
          colors: {
            primary: brandingData.colors?.actionPrimaryColor || '',
            secondary: brandingData.colors?.actionSecondaryColor || '',
            text: brandingData.colors?.messageTextColor || '',
            background: brandingData.colors?.messageBackgroundColor || '',
            border: brandingData.colors?.actionSecondaryColor || '',
            buttonText: '#ffffff',
          },
          typography: {
            fontFamily: brandingData.messageTypography?.fontFamily || '',
            fontSize: brandingData.messageTypography?.fontSize || '',
            fontWeight: brandingData.messageTypography?.fontWeight || '',
          },
          titleTypography: {
            fontFamily: brandingData.titleTypography?.fontFamily || '',
            fontSize: brandingData.titleTypography?.fontSize || '',
            fontWeight: brandingData.titleTypography?.fontWeight || '',
          }
        },
        generalStyling: {
            messageTextColor: brandingData.colors?.messageTextColor || '',
            messageBackgroundColor: brandingData.colors?.messageBackgroundColor || '',
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
            bgColor: brandingData.buttonStyles?.approveBgColor || brandingData.colors?.actionPrimaryColor || '',
            textColor: brandingData.buttonStyles?.approveTextColor || '#ffffff',
            align: 'center' as const,
        },
        buttonStyles: {
            dismissBgColor: brandingData.buttonStyles?.dismissBgColor || brandingData.colors?.actionSecondaryColor || '',
            dismissTextColor: brandingData.buttonStyles?.dismissTextColor || '',
        },
        colors: brandingData.colors,
    }
  }, [brandingData])

  const messageContent = React.useMemo(() => ({
    title: messageData.name,
    body: messageData.content || templateData?.body,
    actions: [
      {
        kind: 'approve',
        label: 'Approve',
      },
    ],
  }), [messageData.name, messageData.content, templateData?.body])

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
