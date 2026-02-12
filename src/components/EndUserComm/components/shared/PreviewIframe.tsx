'use client'
import {useMemo, useRef} from 'react';
import type {UiMessageTemplate} from '@/components/EndUserComm/http-services-sdk/be-types';
import {renderMessage, convertLexicalToHtmlWithDefaults, DEFAULT_TITLE_HTML, DEFAULT_BODY_HTML} from '@/components/EndUserComm/lib/contentRenderer';
import {useLivePreview} from '@/components/EndUserComm/lib/previewUtils';
import {MESSAGE_CARD_WIDTH, MESSAGE_CARD_HEIGHT} from '@/components/EndUserComm/lib/messageCardConstants';
import {PreviewContainer} from './PreviewContainer';

interface PreviewIframeProps {
  template: UiMessageTemplate | null;
  titleLexical: string;
  bodyLexical: string;
  buttonsText: string[];
}

/**
 * PreviewIframe Component
 *
 * RENDERING STRATEGY:
 * - Initial render: Complete HTML with current content
 * - Live updates: Partial DOM updates only
 *
 * FLOW OVERVIEW:
 * ┌─────────────────────────────────────────────────────────────────┐
 * │ STEP 1: Generate Complete Initial HTML                          │
 * │ - Call renderMessage() with current content (title/body/buttons)│
 * │ - Generates complete, ready-to-display HTML document            │
 * │ - Content rendered ONCE (no duplicate conversions)              │
 * │ - Memoized on template (stable during typing)                   │
 * └─────────────────────────────────────────────────────────────────┘
 *                           ↓
 * ┌─────────────────────────────────────────────────────────────────┐
 * │ STEP 2: Initialize Iframe                                       │
 * │ - Set iframe srcDoc with complete HTML                          │
 * │ - Skip initial DOM updates (content already present)            │
 * └─────────────────────────────────────────────────────────────────┘
 *                           ↓
 * ┌─────────────────────────────────────────────────────────────────┐
 * │ STEP 3: Live Updates (when user types)                          │
 * │ - useLivePreview detects changes in titleHtml/bodyHtml          │
 * │ - Updates ONLY changed elements via DOM manipulation            │
 * │ - No full iframe re-render = fast & responsive typing           │
 * └─────────────────────────────────────────────────────────────────┘
 *
 */
export function PreviewIframe({
  template,
  titleLexical,
  bodyLexical,
  buttonsText
}: PreviewIframeProps) {

  // Generate Initial HTML with Current Content
  const initialHtml = useMemo(() => {
    if (!template) return '';

    // Use current content for initial render
    const titleToRender = titleLexical || template.titleLexical;
    const bodyToRender = bodyLexical || template.bodyLexical;
    const buttonsToRender = buttonsText.length > 0 ? {buttonText: buttonsText} : undefined;

    const {html} = renderMessage(
      template,
      titleToRender,
      bodyToRender,
      buttonsToRender
    );

    return html;
  }, [template]); // Only depends on template - content changes handled via DOM

  // Base HTML: Keep constant for iframe key
  // This ensures iframe doesn't reload during typing
  const basePreviewHtml = useMemo(() => initialHtml, [template]);

  // Track initial render to avoid redundant DOM updates
  const isInitialRenderRef = useRef(true);

  // HTML Parts: Converted Lexical content for DOM updates
  const {titleHtml, bodyHtml, isInitialRender} = useMemo(() => {
    if (!template) {
      return {titleHtml: DEFAULT_TITLE_HTML, bodyHtml: DEFAULT_BODY_HTML, isInitialRender: false};
    }
    const titleToRender = titleLexical || template.titleLexical;
    const bodyToRender = bodyLexical || template.bodyLexical;

    const currentIsInitial = isInitialRenderRef.current;
    isInitialRenderRef.current = false;

    return {
      titleHtml: convertLexicalToHtmlWithDefaults(titleToRender, DEFAULT_TITLE_HTML),
      bodyHtml: convertLexicalToHtmlWithDefaults(bodyToRender, DEFAULT_BODY_HTML),
      isInitialRender: currentIsInitial
    };
  }, [template, titleLexical, bodyLexical]);

  // useLivePreview hook:
  // - Returns ref to iframe element
  // - Watches titleHtml, bodyHtml, buttonsText for changes
  // - When they change, updates ONLY those elements in iframe DOM
  const iframeRef = useLivePreview({
    baseHtml: basePreviewHtml,
    titleHtml,
    bodyHtml,
    template,
    buttonsText,
    skipInitialUpdate: isInitialRender // Skip DOM updates on first render (content already in srcDoc)
  });

  return (
    <PreviewContainer>
      <iframe
        ref={iframeRef}
        key={basePreviewHtml}
        srcDoc={basePreviewHtml}
        className="border-0"
        style={{width: MESSAGE_CARD_WIDTH, height: MESSAGE_CARD_HEIGHT, borderRadius: '0.5rem'}}
        sandbox="allow-same-origin"/>
    </PreviewContainer>
  );
}

