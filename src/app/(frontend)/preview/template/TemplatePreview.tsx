'use client'

import React from 'react'
import { useLivePreview } from '@payloadcms/live-preview-react'
import { Template, Branding } from '@/payload-types'
import { MessagePreview } from '@/app/(frontend)/components/MessagePreview'

export const TemplatePreview: React.FC<{ initialData: Template }> = ({ initialData }) => {
  const { data } = useLivePreview<Template>({
    serverURL: process.env.NEXT_PUBLIC_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'),
    depth: 2,
    initialData: initialData,
  })

  const templateData = data || initialData
  const brandingData = templateData.branding as Branding | undefined

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
                ? { 
                    url: (brandingData.logo as any).url || '',
                    sizes: (brandingData.logo as any).sizes || {}
                  } 
                : undefined,
            logoPos: (brandingData as any).logoAlignment || 'center',
            logoSize: (brandingData as any).logoSize || 'logo-small'
        },
        approveBtn: {
            label: 'Approve',
            bgColor: brandingData.actions?.primaryBackground || '',
            textColor: brandingData.actions?.primaryText || '#ffffff',
            align: (brandingData.actions as any)?.buttonAlignment || 'center',
        },
        buttonStyles: {
            dismissBgColor: brandingData.actions?.secondaryBackground || '',
            dismissTextColor: brandingData.actions?.secondaryText || '#ffffff',
        },
    }
  }, [brandingData])

  const messageContent = React.useMemo(() => ({
    title: templateData.title,
    body: templateData.body,
    actions: templateData.buttons?.map((btn: any) => ({
      kind: btn.button?.action === 'Cancel' ? 'secondary' : 'primary',
      label: btn.label || btn.button?.label || 'Action',
      icon: btn.button?.icon,
    })) || [],
  }), [templateData.title, templateData.body, templateData.buttons])

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
            Template Preview: {templateData.name}
        </h2>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <MessagePreview 
                content={messageContent as any} 
                branding={mappedBranding as any}
            />
        </div>
        
        {process.env.NODE_ENV === 'development' && (
          <details style={{ marginTop: '40px', padding: '10px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#fff' }}>
              <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>View Raw Template Data (JSON)</summary>
              <pre style={{ fontSize: '12px', overflow: 'auto', marginTop: '10px' }}>
                  {JSON.stringify(templateData, null, 2)}
              </pre>
          </details>
        )}
      </div>
    </div>
  )
}
