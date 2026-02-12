/**
 * Determines if a logo string is an SVG or a file (data URL).
 */
export function getLogoType(logoString: string): 'svg' | 'file' {
  if (!logoString) return 'file';
  const trimmed = logoString.trim();
  return trimmed.startsWith('<svg') || trimmed.startsWith('<?xml') ? 'svg' : 'file';
}

