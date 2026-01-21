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
    msgTypo: brandingData.messageTypography,
    titleTypo: brandingData.titleTypography,
    colors: brandingData.colors,
    buttonStyles: brandingData.buttonStyles
  });
  
  // Dynamically load font families for the preview page itself
  React.useEffect(() => {
    const fontsToLoad = new Set<string>()
    if (brandingData.messageTypography?.fontFamily) fontsToLoad.add(brandingData.messageTypography.fontFamily)
    if (brandingData.titleTypography?.fontFamily) fontsToLoad.add(brandingData.titleTypography.fontFamily)
    
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
  }, [brandingData.messageTypography?.fontFamily, brandingData.titleTypography?.fontFamily])
  
  const mappedBranding = React.useMemo(() => ({
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
    // Pass original colors and buttonStyles for easier access in MessagePreview
    colors: brandingData.colors,
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
      key={brandingData.id + JSON.stringify(brandingData.colors) + JSON.stringify(brandingData.buttonStyles) + JSON.stringify(brandingData.messageTypography) + JSON.stringify(brandingData.titleTypography) + (brandingData.logo && typeof brandingData.logo === 'object' ? (brandingData.logo as any).id || (brandingData.logo as any).url : '')} 
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
