'use client'
import { useState, useEffect } from 'react';
import { Check, Eye } from 'lucide-react';
import { LogoUploadSection } from './LogoUploadSection';
import { endUserCommSdk } from '@/components/EndUserComm/http-services-sdk/http-sdk';
import type { UiBrandingInfo } from '@/components/EndUserComm/http-services-sdk/be-types';
import { getLogoType } from '@/components/EndUserComm/lib/brandingUtils';
import { Alert } from '../ui/display/alert';
import { Button } from '../ui/controls/button';
import { Label } from '../ui/controls/label';
import { ColorInput } from '../ui/controls/color-input';
import { PreviewContainer } from '../shared/PreviewContainer';
import { usePrivileges } from '@/components/EndUserComm/hooks/usePrivileges';

interface BrandingManagerProps {
  branding: UiBrandingInfo | null;
  onBrandingChange: (branding: UiBrandingInfo) => void;
}

export function BrandingManager({
  branding,
  onBrandingChange,
}: BrandingManagerProps) {
  const { canManageBrandConfiguration } = usePrivileges();
  const [error, setError] = useState<string | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<UiBrandingInfo | null>(null);
  const [originalTheme, setOriginalTheme] = useState<UiBrandingInfo | null>(null);
  const [savedSuccessfully, setSavedSuccessfully] = useState(false);

  useEffect(() => {
    if (branding) {
      // Set the theme (create independent copies)
      setSelectedTheme({ ...branding });
      setOriginalTheme({ ...branding });
    }
  }, [branding]);

  // Check if there are any changes
  const hasChanges = selectedTheme && originalTheme && (
    selectedTheme.primaryColor !== originalTheme.primaryColor ||
    selectedTheme.secondaryColor !== originalTheme.secondaryColor ||
    selectedTheme.backgroundColor !== originalTheme.backgroundColor ||
    selectedTheme.textColor !== originalTheme.textColor ||
    selectedTheme.logo !== originalTheme.logo
  );

  const handleSaveChanges = async () => {
    if (selectedTheme) {
      try {
        setError(null);
        // Prepare update request
        const updateRequest = {
          brandingName: selectedTheme.brandingName,
          primaryColor: selectedTheme.primaryColor,
          secondaryColor: selectedTheme.secondaryColor,
          backgroundColor: selectedTheme.backgroundColor,
          textColor: selectedTheme.textColor,
          logo: selectedTheme.logo,
        };

        const response = await endUserCommSdk.uiMgmtMessage.updateBranding(
          selectedTheme.brandingId,
          updateRequest,
        );

        // Update parent component with the updated branding
        onBrandingChange(response.data);

        // Update original theme to match current
        setOriginalTheme({ ...selectedTheme });

        setSavedSuccessfully(true);
        setTimeout(() => setSavedSuccessfully(false), 3000);
      } catch (err) {
        console.error('Failed to save branding:', err);
        setError('Failed to save branding changes. Please try again.');
        setTimeout(() => setError(null), 5000);
      }
    }
  };

  const handleRevertToDefaults = () => {
    if (originalTheme) {
      setSelectedTheme({ ...originalTheme });
    }
  };

  if (!selectedTheme || !branding) {
    return null;
  }

  return (
    <div className="p-8">
      {/* Error State */}
      {error && (
        <Alert
            variant="destructive"
            className="mb-4">
          {error}
        </Alert>
      )}

      {/* Main Content */}
      {renderBrandingForm()}
    </div>
  );

  function renderBrandingForm() {
    if (!selectedTheme) return null;

    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div
            className="grid grid-cols-1 lg:grid-cols-2"
            style={{ gap: 'calc(var(--spacing) * 8)' }}>
          {/* Left Column - Controls */}
          <div className="space-y-4">
            {/* Selected Theme Indicator */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 mb-0.5">Theme</p>
                  <p className="text-sm text-purple-900 font-medium">
                    {selectedTheme.brandingName}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div
                      className="w-6 h-6 rounded border border-gray-300"
                      style={{ backgroundColor: selectedTheme.primaryColor }}
                      title="Primary Color"/>
                  <div
                      className="w-6 h-6 rounded border border-gray-300"
                      style={{ backgroundColor: selectedTheme.secondaryColor }}
                      title="Secondary Color"/>
                </div>
              </div>
            </div>

            {/* Color Configuration */}
            <div>
              <Label className="block text-gray-700 mb-2 text-sm">Color Palette</Label>
              <div className="grid grid-cols-2 gap-3">
                <ColorInput
                    label="Primary Color"
                    value={selectedTheme.primaryColor}
                    onChange={(value) => setSelectedTheme({ ...selectedTheme, primaryColor: value })}
                    disabled={!canManageBrandConfiguration}/>
                <ColorInput
                    label="Secondary Color"
                    value={selectedTheme.secondaryColor}
                    onChange={(value) => setSelectedTheme({ ...selectedTheme, secondaryColor: value })}
                    disabled={!canManageBrandConfiguration}/>
                <ColorInput
                    label="Background Color"
                    value={selectedTheme.backgroundColor}
                    onChange={(value) => setSelectedTheme({ ...selectedTheme, backgroundColor: value })}
                    disabled={!canManageBrandConfiguration}/>
                <ColorInput
                    label="Text Color"
                    value={selectedTheme.textColor}
                    onChange={(value) => setSelectedTheme({ ...selectedTheme, textColor: value })}
                    disabled={!canManageBrandConfiguration}/>
              </div>
            </div>

            {/* Logo Management */}
            <div className="space-y-2 border-t border-purple-200"></div>
            <Label className="block text-gray-700 mb-2 text-sm">Logo</Label>

            <LogoUploadSection
                customLogo={selectedTheme.logo || null}
                originalLogo={originalTheme?.logo || null}
                onLogoChange={(logo) => setSelectedTheme({ ...selectedTheme, logo: logo || '' })}
                disabled={!canManageBrandConfiguration}/>

            {/* Save Changes */}
            {canManageBrandConfiguration && (
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  {hasChanges && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRevertToDefaults}>
                      Discard Changes
                    </Button>
                  )}
                  <Button
                      variant="purple"
                      size="sm"
                      onClick={handleSaveChanges}
                      disabled={!hasChanges}>
                    Save Changes
                  </Button>
                </div>
                {savedSuccessfully && (
                  <span className="text-green-600 text-sm flex items-center gap-1">
                    <Check className="w-4 h-4"/>
                    Saved successfully
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Right Column - Live Preview */}
          <div className="lg:sticky lg:top-8 self-start">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="w-4 h-4 text-purple-900"/>
              <Label className="text-gray-900">Live Preview</Label>
            </div>
            <PreviewContainer>
              <div
                  className="flex flex-col w-full rounded-lg shadow-xl border-t-4"
                  style={{
                    borderColor: selectedTheme.primaryColor,
                    backgroundColor: selectedTheme.backgroundColor,
                    width: '700px'
                  }}>
                {selectedTheme.logo && (
                  <div className="p-4 border-b border-gray-100 flex items-center justify-center">
                    <style>{`
                        .branding-preview-logo-wrapper {
                          display: flex;
                          align-items: center;
                          justify-content: center;
                          width: 100%;
                          min-height: 32px;
                        }
                        .branding-preview-logo-wrapper svg {
                          max-height: 32px !important;
                          max-width: 180px !important;
                          height: auto !important;
                          width: auto !important;
                          display: block !important;
                        }
                        .branding-preview-logo-wrapper img {
                          max-height: 32px !important;
                          max-width: 180px !important;
                          height: auto !important;
                          width: auto !important;
                        }
                      `}</style>
                    {getLogoType(selectedTheme.logo) === 'svg' ? (
                      <div
                          dangerouslySetInnerHTML={{ __html: selectedTheme.logo }}
                          className="branding-preview-logo-wrapper"/>
                    ) : (
                      <div className="branding-preview-logo-wrapper">
                        <img
                            src={selectedTheme.logo}
                            alt="Theme logo"/>
                      </div>
                    )}
                  </div>
                )}

                <div className="p-4">
                  <h3 className="text-lg font-medium" style={{ color: selectedTheme.primaryColor }}>
                    Sample Message Title
                  </h3>
                  <p className="mt-2 text-sm" style={{ color: selectedTheme.textColor }}>
                    This is how your message will appear to end users with the selected branding theme.
                    Custom colors and styling will be applied automatically.
                  </p>
                </div>
                <div className="border-t px-4 py-3">
                  <Button
                      className="w-full text-white hover:opacity-90"
                      style={{ backgroundColor: selectedTheme.primaryColor }}>
                    Action Button
                  </Button>
                </div>
              </div>
            </PreviewContainer>
          </div>
        </div>
      </div>
    );
  }
}
