'use client'
import {Label} from '../ui/controls/label';
import {Upload, Code, Check, Undo2} from 'lucide-react';
import {useState} from 'react';
import {getLogoType} from '@/components/EndUserComm/lib/brandingUtils';
import {cn} from '../ui/utils';
import {BUTTON_DISABLED, FORM_DISABLED} from '@/components/EndUserComm/lib/formStyles';

interface CustomLogoUploadSectionProps {
  customLogo: string | null;
  originalLogo?: string | null; // The saved logo from DB to reset to
  setCustomLogo?: (logo: string | null) => void;
  onLogoChange?: (logo: string | null) => void;
  disabled?: boolean;
}

export function LogoUploadSection({
  customLogo,
  originalLogo,
  setCustomLogo,
  onLogoChange,
  disabled = false
}: CustomLogoUploadSectionProps) {
  const handleLogoChange = (logo: string | null) => {
    setCustomLogo?.(logo);
    onLogoChange?.(logo);
  };

  const [showSvgInput, setShowSvgInput] = useState(false);
  const [svgCode, setSvgCode] = useState('');

  const handleApplySvg = () => {
    if (svgCode.trim()) {
      handleLogoChange(svgCode.trim());
      setShowSvgInput(false);
      setSvgCode('');
    }
  };

  // Compute logo type only when there's a logo
  const logoType = customLogo ? getLogoType(customLogo) : 'file';

  // Check if logo has changed from the original (saved) version
  const hasLogoChanged = customLogo !== originalLogo;

  return (
    <div className="space-y-2">
      <div className="bg-white border border-gray-200 rounded-lg p-2">
        <div className="flex gap-2">
          {/* Logo Preview */}
          <div className="w-20 h-20 border border-gray-300 rounded bg-gray-50 flex items-center justify-center flex-shrink-0 overflow-hidden">
            {customLogo ? (
              logoType === 'svg' ? (
                <div
                  dangerouslySetInnerHTML={{__html: customLogo}}
                  className="w-full h-full flex items-center justify-center [&_svg]:max-w-full [&_svg]:max-h-full [&_svg]:w-auto [&_svg]:h-auto"/>
              ) : (
                <img src={customLogo} alt="Logo" className="w-full h-full object-contain p-1"/>
              )
            ) : (
              <Upload className="w-6 h-6 text-gray-400"/>
            )}
          </div>

          {/* Logo Controls */}
          <div className="flex-1 space-y-1">
            <label className={cn('block', disabled ? 'cursor-not-allowed' : 'cursor-pointer')}>
              <div className={cn(
                'flex items-center justify-center gap-1 px-1.5 py-1 bg-purple-100 text-purple-900 rounded text-[10px] transition-colors',
                disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-200'
              )}>
                <Upload className="w-3 h-3"/>
                Upload File
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={disabled}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    // Clear SVG state when uploading a file
                    setShowSvgInput(false);
                    setSvgCode('');

                    const reader = new FileReader();
                    reader.onloadend = () => {
                      handleLogoChange(reader.result as string);
                      // Reset the input value so the same file can be selected again
                      e.target.value = '';
                    };
                    reader.readAsDataURL(file);
                  }
                }}/>
            </label>

            <button
              onClick={() => {
                setShowSvgInput(!showSvgInput);
                if (showSvgInput) {
                  // If closing the SVG input, clear it
                  setSvgCode('');
                } else {
                  // If opening the SVG input, populate it if current logo is SVG, otherwise start empty
                  setSvgCode(logoType === 'svg' && customLogo ? customLogo : '');
                }
              }}
              disabled={disabled}
              className={cn(
                "w-full flex items-center justify-center gap-1 px-1.5 py-1 rounded text-[10px] transition-colors",
                showSvgInput ? 'bg-purple-100 text-purple-900' : 'bg-gray-100 text-gray-700',
                disabled ? BUTTON_DISABLED : (showSvgInput ? 'hover:bg-purple-200' : 'hover:bg-gray-200')
              )}>
              <Code className="w-3 h-3"/>
              {showSvgInput ? 'Hide SVG Input' : 'Paste SVG'}
            </button>

            {hasLogoChanged && originalLogo && (
              <button
                onClick={() => handleLogoChange(originalLogo)}
                disabled={disabled}
                className={cn(
                  "w-full px-1.5 py-1 text-amber-700 rounded text-[10px] transition-colors flex items-center justify-center gap-1",
                  disabled ? BUTTON_DISABLED : 'hover:bg-amber-50'
                )}
                title="Discard Changes">
                <Undo2 className="w-3 h-3"/>
                Discard Changes
              </button>
            )}
          </div>
        </div>

        {/* Inline SVG Input */}
        {showSvgInput && (
          <div className="mt-2 pt-2 border-t border-gray-200 space-y-1">
            <textarea
              value={svgCode}
              onChange={(e) => setSvgCode(e.target.value)}
              placeholder="Paste your SVG code here..."
              rows={4}
              disabled={disabled}
              className={cn(
                "w-full px-2 py-1.5 border border-gray-300 rounded text-[10px] font-mono resize-none",
                FORM_DISABLED
              )}/>
            <button
              onClick={handleApplySvg}
              disabled={!svgCode.trim() || disabled}
              className={cn(
                "w-full flex items-center justify-center gap-1 px-1.5 py-1 bg-purple-900 text-white rounded text-[10px] transition-colors",
                (!svgCode.trim() || disabled) ? BUTTON_DISABLED : 'hover:bg-purple-950'
              )}>
              <Check className="w-3 h-3"/>
              Apply SVG Code
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
