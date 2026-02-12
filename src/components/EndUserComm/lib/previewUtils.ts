import {useEffect, useRef, useState} from 'react';
import type {MessageButtons, UiBrandingInfo, UiMessageTemplate} from '@/components/EndUserComm/http-services-sdk/be-types';
import {ButtonStyle} from '@/components/EndUserComm/http-services-sdk/be-types';

/**
 * Convert alignment enum to CSS value
 */
export function getAlignmentCss(alignment: string): string {
  const align = alignment.toLowerCase();
  return align === 'right' ? 'flex-end' : align === 'center' ? 'center' : 'flex-start';
}

/**
 * Apply button text overrides to buttons object
 */
export function applyButtonTextOverrides(
  buttons: MessageButtons,
  buttonTexts?: string[]
): MessageButtons {
  if (!buttonTexts || buttonTexts.length === 0) return buttons;
  
  return {
    ...buttons,
    buttons: buttons.buttons.map((btn, index) => ({
      ...btn,
      text: buttonTexts[index] || btn.text
    }))
  };
}

/**
 * Generate button HTML for live preview updates
 *
 * USAGE CONTEXTS:
 * 1. From useLivePreview (PreviewIframe): buttonTexts provided → applies overrides here
 * 2. From contentRenderer (AgentBroadcastPage): buttonTexts undefined → uses buttons as-is
 *
 * @param buttons - Button configuration (actions, styles, texts)
 * @param branding - Branding colors for styling
 * @param buttonTexts - Optional text overrides (when provided, overrides button.text values)
 */
export function generateButtonsHtml(
  buttons: MessageButtons,
  branding: UiBrandingInfo,
  buttonTexts?: string[]
): string {
  if (buttons.buttons.length === 0) return '';

  // Apply button text overrides if provided
  // PreviewIframe path: buttonTexts provided, apply overrides here
  // AgentBroadcastPage path: buttonTexts undefined, buttons already have correct text
  const buttonsToRender = buttonTexts
    ? applyButtonTextOverrides(buttons, buttonTexts)
    : buttons;

  const buttonElements = buttonsToRender.buttons
    .map(btn => {
      const baseStyle = 'padding: 10px; border-radius: 8px; font-size: 14px; cursor: pointer; border: none; min-width: 80px; font-family: inherit;';
      const styleMap: Record<string, string> = {
        [ButtonStyle.Primary]: `background: ${branding.primaryColor}; color: white;`,
        [ButtonStyle.Secondary]: `background: ${branding.secondaryColor}; color: white;`,
        [ButtonStyle.Plain]: `background: transparent; color: ${branding.textColor};`
      };
      const buttonStyle = `${baseStyle} ${styleMap[btn.style] || styleMap[ButtonStyle.Primary]}`;
      return `<button style="${buttonStyle}">${btn.text}</button>`;
    })
    .join(' ');

  const alignment = getAlignmentCss(buttons.alignment);

  return `<div style="display: flex; gap: 8px; justify-content: ${alignment};">${buttonElements}</div>`;
}

export interface UseLivePreviewOptions {
  baseHtml: string;
  titleHtml: string;
  bodyHtml: string;
  template: UiMessageTemplate | null;
  buttonsText: string[];
  skipInitialUpdate?: boolean; // Skip DOM updates on first render (content already in srcDoc)
}

/**
 * Custom hook for managing partial live preview iframe updates
 * Updates only changed parts (title, body, buttons) without re-rendering entire HTML
 *
 * skipInitialUpdate flag prevents redundant DOM manipulation
 * when content is already present in the initial srcDoc HTML
 */
export function useLivePreview({
  baseHtml,
  titleHtml,
  bodyHtml,
  template,
  buttonsText,
  skipInitialUpdate = false
}: UseLivePreviewOptions) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Update content when dependencies change or iframe loads
  useEffect(() => {
    if (!iframeRef.current || !baseHtml) return;

    // Skip updates on initial render if content already in HTML
    if (skipInitialUpdate) return;

    const updateContent = () => {
      try {
        const iframe = iframeRef.current;
        if (!iframe) return;
        
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
        if (!iframeDoc) return;

        // Update title if element exists
        const titleElement = iframeDoc.getElementById('title');
        if (titleElement && titleHtml) {
          titleElement.innerHTML = titleHtml;
        }

        // Update body if element exists
        const bodyElement = iframeDoc.getElementById('body');
        if (bodyElement && bodyHtml) {
          bodyElement.innerHTML = bodyHtml;
        }

        // Update buttons if they changed
        if (template && template.buttons && buttonsText.length > 0) {
          const buttonsElement = iframeDoc.getElementById('buttons');
          if (buttonsElement) {
            const buttonsHtml = generateButtonsHtml(template.buttons, template.branding, buttonsText);
            buttonsElement.innerHTML = buttonsHtml;
          }
        }
      } catch (error) {
        // If DOM manipulation fails (e.g., cross-origin), fall back to full re-render
        console.warn('Failed to update preview parts:', error);
      }
    };

    const iframe = iframeRef.current;
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    
    // If iframe is ready, update immediately
    if (iframeDoc && iframeDoc.readyState === 'complete') {
      updateContent();
    } else {
      // Otherwise wait for load event
      const handleLoad = () => {
        updateContent();
      };
      iframe.addEventListener('load', handleLoad);
      return () => iframe.removeEventListener('load', handleLoad);
    }
  }, [titleHtml, bodyHtml, buttonsText, template, baseHtml, isLoaded, skipInitialUpdate]);

  // Handle iframe load event
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleLoad = () => {
      setIsLoaded(true);
    };

    iframe.addEventListener('load', handleLoad);
    return () => iframe.removeEventListener('load', handleLoad);
  }, [baseHtml]);

  return iframeRef;
}

