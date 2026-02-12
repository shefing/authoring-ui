import type {MessageButtons, MessageButtonsText, UiBrandingInfo, UiMessageTemplate} from '@/components/EndUserComm/http-services-sdk/be-types';
import {generateButtonsHtml, getAlignmentCss, applyButtonTextOverrides} from './previewUtils';
import {convertLexicalToHtml} from './lexicalUtils';

// Default HTML content for empty title and body
export const DEFAULT_TITLE_HTML = '<p>Sample Message Title</p>';
export const DEFAULT_BODY_HTML = '<p>This is the main message content area.</p>';

/**
 * Convert Lexical JSON to HTML with default fallback if empty
 * Extracted for reuse - avoids duplicate conversion in PreviewIframe
 */
export function convertLexicalToHtmlWithDefaults(
  lexicalJson: string | undefined,
  defaultHtml: string
): string {
  if (!lexicalJson) return defaultHtml;

  const html = convertLexicalToHtml(lexicalJson);
  if (isHtmlEmpty(html)) {
    return defaultHtml;
  }
  return html;
}

/**
 * Render message HTML from template with optional overrides
 *
 * COMPLETE FLOW:
 * ┌─────────────────────────────────────────────────────────────────┐
 * │ INPUT                                                           │
 * │ - template: base HTML/CSS structure with IDs                    │
 * │ - optional overrides: custom title, body, button texts          │
 * └─────────────────────────────────────────────────────────────────┘
 *                           ↓
 * ┌─────────────────────────────────────────────────────────────────┐
 * │ STEP 1: Convert Lexical JSON → HTML                             │
 * │ - titleLexical → "<p><strong>Bold Title</strong></p>"           │
 * │ - bodyLexical → "<p>Body with <em>formatting</em></p>"          │
 * └─────────────────────────────────────────────────────────────────┘
 *                           ↓
 * ┌─────────────────────────────────────────────────────────────────┐
 * │ STEP 2: Apply Button Overrides (if provided)                    │
 * │ - Override button texts while keeping actions/styles            │
 * │ - Both PreviewIframe and AgentBroadcastPage pass buttonsText    │
 * └─────────────────────────────────────────────────────────────────┘
 *                           ↓
 * ┌─────────────────────────────────────────────────────────────────┐
 * │ STEP 3: Populate Template via ID-based DOM manipulation         │
 * │ - Populates: logo, title, body, buttons                         │
 * └─────────────────────────────────────────────────────────────────┘
 *                           ↓
 * ┌─────────────────────────────────────────────────────────────────┐
 * │ RESULT: Complete HTML document ready to display                 │
 * └─────────────────────────────────────────────────────────────────┘
 *
 */
export function renderMessage(
  template: UiMessageTemplate,
  titleLexical?: string,
  bodyLexical?: string,
  buttonsText?: MessageButtonsText
): {html: string; buttons: MessageButtons; titleHtml: string; bodyHtml: string} {
  // Use override values or fall back to template defaults
  const titleToRender = titleLexical || template.titleLexical;
  const bodyToRender = bodyLexical || template.bodyLexical;

  // Convert Lexical JSON to HTML with defaults
  const titleHtml = convertLexicalToHtmlWithDefaults(titleToRender, DEFAULT_TITLE_HTML);
  const bodyHtml = convertLexicalToHtmlWithDefaults(bodyToRender, DEFAULT_BODY_HTML);

  // Apply button text overrides if provided (keep actions and styles from template)
  const buttonsToRender = applyButtonTextOverrides(template.buttons, buttonsText?.buttonText);

  // Render final HTML document
  const html = buildHtmlDocument(
    template.html,
    template.css,
    template.branding,
    titleHtml,
    bodyHtml,
    buttonsToRender,
    template.logo.alignment
  );

  return {html, buttons: buttonsToRender, titleHtml, bodyHtml};
}

/**
 * Build complete HTML document by populating content via IDs
 * Uses ID-based DOM manipulation for HTML content (logo, title, body, buttons)
 * Uses string replacement for CSS variables only
 */
function buildHtmlDocument(
  html: string,
  css: string,
  branding: UiBrandingInfo,
  titleText: string,
  bodyText: string,
  buttons: MessageButtons,
  logoAlignment: string): string {

  const logoHtml = getLogoHtml(branding);
  const buttonsHtml = generateButtonsHtml(buttons, branding);

  // Populate template content using ID-based DOM manipulation
  const processedHtml = populateTemplateContent(
    html,
    logoHtml,
    titleText,
    bodyText,
    buttonsHtml
  );

  // Handle CSS variables
  let processedCss = css;

  // Update alignment CSS variables
  processedCss = processedCss.replace(/--buttonAlignment:\s*[^;]+;/g, `--buttonAlignment: ${getAlignmentCss(buttons.alignment)};`);
  processedCss = processedCss.replace(/--logoAlignment:\s*[^;]+;/g, `--logoAlignment: ${getAlignmentCss(logoAlignment)};`);

  // Update branding colors CSS variables
  processedCss = processedCss.replace(/--primaryColor:\s*[^;]+;/g, `--primaryColor: ${branding.primaryColor};`);
  processedCss = processedCss.replace(/--backgroundColor:\s*[^;]+;/g, `--backgroundColor: ${branding.backgroundColor};`);
  processedCss = processedCss.replace(/--textColor:\s*[^;]+;/g, `--textColor: ${branding.textColor};`);

  // Wrap in complete HTML document
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            margin: 0;
            padding: 0;
          }
          .card-content > .button-container {
            margin-top: auto !important;
          }
          ${processedCss}
        </style>
      </head>
      <body>${processedHtml}</body>
    </html>
  `;
}

/**
 * Populate template content using ID-based DOM manipulation
 * All elements are optional - only populated if present in template
 */
function populateTemplateContent(
  html: string,
  logoHtml: string,
  titleHtml: string,
  bodyHtml: string,
  buttonsHtml: string
): string {
  if (typeof DOMParser === 'undefined') {
    return html; // Return original HTML if DOMParser is not available (SSR)
  }
  // Parse HTML synchronously using DOMParser
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  // Map of element IDs to their content (all optional)
  const contentMap: Record<string, string> = {
    'logo': logoHtml,
    'title': titleHtml,
    'body': bodyHtml,
    'buttons': buttonsHtml,
  };

  // Populate elements only if they exist in the template
  for (const [id, content] of Object.entries(contentMap)) {
    const element = doc.getElementById(id);
    if (element) {
      element.innerHTML = content;
    }
  }

  // Serialize back to HTML string (get body content)
  return doc.body.innerHTML;
}


/**
 * Check if HTML content is effectively empty (no text content)
 * Strips HTML tags and checks if remaining text is empty or whitespace only
 */
export function isHtmlEmpty(html: string): boolean {
  if (!html || html.trim() === '') return true;

  if (typeof DOMParser === 'undefined') {
    return false; // Assume not empty during SSR
  }

  // Create a temporary DOM element to extract text content
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const textContent = doc.body.textContent || '';

  // Check if text content is empty or only whitespace
  return textContent.trim() === '';
}


/**
 * Generate logo HTML for rendering in template
 */
function getLogoHtml(branding: UiBrandingInfo): string {
  const logo = branding.logo || '';
  const trimmed = logo.trim();

  // Detect if it's SVG or image URL
  if (trimmed.startsWith('<svg') || trimmed.startsWith('<?xml')) {
    return `<div style="max-height: 40px;">${trimmed}</div>`;
  }
  return `<img src="${logo}" alt="Company Logo" style="max-height: 40px; width: auto; object-fit: contain;"/>`;
}
