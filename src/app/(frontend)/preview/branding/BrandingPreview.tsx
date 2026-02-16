'use client'

import React from 'react'
import { useLivePreview } from '@payloadcms/live-preview-react'
import { Branding } from '@/payload-types'
import { MessagePreview } from '@/app/(frontend)/components/MessagePreview'

export const BrandingPreview: React.FC<{ initialData: Branding }> = ({ initialData }) => {
  const { data } = useLivePreview<Branding>({
    serverURL: process.env.NEXT_PUBLIC_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'),
    depth: 1,
    initialData: initialData,
  })

  // Debug log to see what data we're getting from live preview
  console.log('[DEBUG_LOG] Live Preview Data:', data);
  console.log('[DEBUG_LOG] Initial Data:', initialData);

  // Map the Branding collection data to the BrandingPackage type used by MessagePreview
  // This is a partial mapping based on what Branding collection has
  const brandingData = data || initialData
  
  // Debug log to trace data mapping
  console.log('[DEBUG_LOG] Mapping brandingData:', {
    id: brandingData.id,
    title: brandingData.title,
    message: brandingData.message,
    general: brandingData.general,
  });
  
  // Dynamically load font families for the preview page itself
  React.useEffect(() => {
    const fontsToLoad = new Set<string>()
    if (brandingData.message?.fontFamily) fontsToLoad.add(brandingData.message.fontFamily)
    if (brandingData.title?.fontFamily) fontsToLoad.add(brandingData.title.fontFamily)
    
    fontsToLoad.forEach(font => {
      if (font && !['serif', 'sans-serif', 'monospace', 'cursive', 'fantasy', 'system-ui', '-apple-system'].includes(font.toLowerCase())) {
        const linkId = `preview-font-${font.replace(/\s+/g, '-').toLowerCase()}`
        if (!document.getElementById(linkId)) {
          console.log(`[DEBUG_LOG] Loading font (BrandingPreview): ${font}`);
          const link = document.createElement('link')
          link.id = linkId
          link.rel = 'stylesheet'
          link.href = `https://fonts.googleapis.com/css2?family=${font.replace(/\s+/g, '+')}:wght@100;200;300;400;500;600;700;800;900&display=swap`
          document.head.appendChild(link)
        }
      }
    })
  }, [brandingData.message?.fontFamily, brandingData.title?.fontFamily])
  
  const mappedBranding = React.useMemo(() => ({
    titleTypography: brandingData.title,
    messageTypography: brandingData.message,
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
        logoPos: (brandingData as any).logoAlignment || 'center'
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
    // Pass branding fields for easier access in MessagePreview
    general: brandingData.general,
    title: brandingData.title,
    message: brandingData.message,
    actions: brandingData.actions,
  }), [brandingData])

  const sampleContent = React.useMemo(() => ({
    title: 'Your Brand in Action',
    body: 'This preview shows how your chosen colors and typography apply to your messages.',
    actions: [
      {
        kind: 'approve',
        label: 'Approve',
      },
      {
        kind: 'dismiss',
        label: 'Dismiss',
      },
    ],
  }), [])

  return (
    <div 
      key={brandingData.id + JSON.stringify(brandingData.general) + JSON.stringify(brandingData.title) + JSON.stringify(brandingData.message) + JSON.stringify(brandingData.actions) + (brandingData.logo && typeof brandingData.logo === 'object' ? (brandingData.logo as any).id || (brandingData.logo as any).url : '')}
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
            Branding: {brandingData.name}
        </h2>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <MessagePreview 
                content={sampleContent as any} 
                branding={mappedBranding as any}
            />
        </div>
        
        {/* Helper for showing actual applied style values if needed during development */}
        {process.env.NODE_ENV === 'development' && (
          <details style={{ marginTop: '40px', padding: '10px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#fff' }}>
              <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>View Raw Branding Data (JSON)</summary>
              <pre style={{ fontSize: '12px', overflow: 'auto', marginTop: '10px' }}>
                  {JSON.stringify(brandingData, null, 2)}
              </pre>
          </details>
        )}
      </div>
    </div>
  )
}
