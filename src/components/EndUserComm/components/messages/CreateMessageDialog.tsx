'use client'
import {useEffect, useState} from 'react';
import {StandardDialog} from '../ui/overlay/dialog';
import {Label} from '../ui/controls/label';
import {Input} from '../ui/controls/input';
import {Button} from '../ui/controls/button';
import type {UiMessageInfo, UiMessageDefinition, UiMessageTemplate, UiNewMessageDefinitionRequest} from '@/components/EndUserComm/http-services-sdk/be-types';
import {MessageType} from '@/components/EndUserComm/http-services-sdk/be-types';
import {endUserCommSdk} from '@/components/EndUserComm/http-services-sdk/http-sdk';
import {Eye, MessageSquare, Settings} from 'lucide-react';
import type {Template} from '../templates/TemplateManager';
import {extractTextFromLexical, convertTextToLexical} from '@/components/EndUserComm/lib/lexicalUtils';
import {LexicalEditor} from '../ui/controls/lexical-editor';
import {PreviewIframe} from '../shared/PreviewIframe';
import {usePrivileges} from '@/components/EndUserComm/hooks/usePrivileges';
import {FORM_INPUT_TEXT_SIZE, FORM_DISABLED} from '@/components/EndUserComm/lib/formStyles';

interface CreateMessageDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (messageData: UiMessageDefinition) => void;
  templates?: Template[];
  editMessage?: UiMessageInfo | null;
  messages?: UiMessageInfo[];
}

export function CreateMessageDialog({
  open,
  onClose,
  onSubmit,
  templates = [],
  editMessage = null,
  messages = []
}: CreateMessageDialogProps) {
  const { canManageMessages } = usePrivileges();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [fullTemplate, setFullTemplate] = useState<UiMessageTemplate | null>(null);
  const [isLoadingTemplate, setIsLoadingTemplate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);

  // Form data
  const [formData, setFormData] = useState({
    name: '',
    type: MessageType.Notification,
    templateId: '',
    // Message content using UiMessageDefinition structure
    titleLexical: '',
    bodyLexical: '',
    buttonsText: [] as string[],
  });

  const totalSteps = 2;


  // Fetch full message definition when editing
  useEffect(() => {
    if (editMessage && open) {
      endUserCommSdk.uiMgmtMessage.getMsgDefinition(editMessage.definitionId)
        .then(response => {
          const fullDefinition = response.data;
          const templateId = fullDefinition.templateId || '';
          
          // Find template to get type
          const template = templateId ? templates.find(t => t.id === templateId) : null;
          if (template) {
            setSelectedTemplate(template);
          }

          setFormData({
            name: fullDefinition.definitionName,
            type: template?.type || MessageType.Notification,
            templateId: templateId,
            titleLexical: fullDefinition.titleLexical || '',
            bodyLexical: fullDefinition.bodyLexical || '',
            buttonsText: fullDefinition.buttonsText?.buttonText || [],
          });
        })
        .catch(error => {
          console.error('Error fetching message definition:', error);
          setError('Failed to load message for editing. Please try again.');
        });
    } else if (!open) {
      // Reset when dialog closes
      setFormData({
        name: '',
        type: MessageType.Notification,
        templateId: '',
        titleLexical: '',
        bodyLexical: '',
        buttonsText: [],
      });
      setSelectedTemplate(null);
      setFullTemplate(null);
      setCurrentStep(1);
      setError(null);
      setNameError(null);
    }
  }, [editMessage, open, templates]);

  // Fetch full template when entering step 2
  useEffect(() => {
    if (currentStep === 2 && formData.templateId && !fullTemplate && !isLoadingTemplate) {
      setIsLoadingTemplate(true);
      endUserCommSdk.uiMgmtMessage.getTemplate(formData.templateId)
        .then(response => {
          const template = response.data;
          setFullTemplate(template);
          // Initialize buttonsText array based on template buttons
          const buttonCount = template.buttons?.buttons?.length || 0;
          setFormData(prev => {
            // Use template text if message texts are empty
            const titleLexical = prev.titleLexical || template.titleLexical || '';
            const bodyLexical = prev.bodyLexical || template.bodyLexical || '';
            // Ensure buttonsText array matches template button count
            // Use template button text if message doesn't have it
            const currentButtons = prev.buttonsText || [];
            const newButtons = Array(buttonCount).fill('').map((_, index) =>
              currentButtons[index] || template.buttons?.buttons?.[index]?.text || ''
            );
            return {
              ...prev,
              titleLexical,
              bodyLexical,
              buttonsText: newButtons
            };
          });
        })
        .catch(error => {
          console.error('Error fetching template:', error);
        })
        .finally(() => {
          setIsLoadingTemplate(false);
        });
    }
  }, [currentStep, formData.templateId, fullTemplate, isLoadingTemplate]);

  // Reset full template when templateId changes or dialog closes
  useEffect(() => {
    if (!open || !formData.templateId) {
      setFullTemplate(null);
    }
  }, [open, formData.templateId]);

  // Check if name is unique
  const isNameUnique = (name: string): boolean => {
    if (!name.trim()) return true; // Empty name, handled by required validation

    // When editing, exclude the current message from the check
    const existingMessages = editMessage
      ? messages.filter(msg => msg.definitionId !== editMessage.definitionId)
      : messages;

    return !existingMessages.some(msg =>
      msg.definitionName.toLowerCase() === name.trim().toLowerCase()
    );
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Validate name uniqueness when name changes
    if (field === 'name') {
      if (!isNameUnique(value)) {
        setNameError('A message with this name already exists. Please choose a different name.');
      } else {
        setNameError(null);
      }
    }

    // When message type changes, reset template selection
    if (field === 'type') {
      setFormData(prev => ({
        ...prev,
        templateId: '',
      }));
      setSelectedTemplate(null);
    }

    // When template is selected, reset full template (will be fetched in step 2)
    if (field === 'templateId' && value) {
      const template = templates.find(t => t.id === value);
      if (template) {
        setSelectedTemplate(template);
        setFullTemplate(null); // Reset, will be fetched when entering step 2
        setFormData(prev => ({
          ...prev,
          buttonsText: [], // Will be initialized when template is fetched
        }));
      }
    }

    // Handle buttonsText array updates
    if (field.startsWith('buttonText_')) {
      const index = parseInt(field.split('_')[1]);
      setFormData(prev => {
        const newButtonsText = [...prev.buttonsText];
        newButtonsText[index] = value;
        return {
          ...prev,
          buttonsText: newButtonsText,
        };
      });
    }
  };

  const handleSubmit = async () => {
    if (!isStepValid()) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Use Lexical JSON directly from formData (already in Lexical format from editor)
      const titleLexical = formData.titleLexical || convertTextToLexical('');
      const bodyLexical = formData.bodyLexical || convertTextToLexical('');

      // Backend expects Lexical JSON strings in titleText/bodyText fields
      const titleText = titleLexical;
      const bodyText = bodyLexical;

      // Get the first non-empty button text, or empty string if none
      const buttonText = formData.buttonsText.find(btn => btn.trim() !== '') || '';

      // Prepare request body for API
      const requestBody: UiNewMessageDefinitionRequest = {
        name: formData.name,
        templateId: formData.templateId,
        titleText: titleText, // This is actually Lexical JSON, despite the field name
        bodyText: bodyText,   // This is actually Lexical JSON, despite the field name
        buttonText: buttonText,
      };

      let response;
      if (editMessage) {
        // Update existing message definition
        response = await endUserCommSdk.uiMgmtMessage.updateMsgDefinition(editMessage.definitionId, requestBody);
      } else {
        // Create new message definition
        response = await endUserCommSdk.uiMgmtMessage.createMsgDefinition(requestBody);
      }

      // Call onSubmit callback if provided (for parent component to update state)
      if (onSubmit) {
        const messageDefinition: UiMessageDefinition = response.data;
        onSubmit(messageDefinition);
      }

      // Reset form
      setFormData({
        name: '',
        type: MessageType.Notification,
        templateId: '',
        titleLexical: '',
        bodyLexical: '',
        buttonsText: [],
      });
      setSelectedTemplate(null);
      setFullTemplate(null);
      setCurrentStep(1);
      setNameError(null);
      onClose();
    } catch (error: any) {
      console.error(`Error ${editMessage ? 'updating' : 'creating'} message definition:`, error);
      const errorMessage = error?.response?.data?.message || error?.message || `Failed to ${editMessage ? 'update' : 'create'} message. Please try again.`;
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStepValid = () => {
    if (currentStep === 1) {
      return formData.name.trim() !== '' &&
             isNameUnique(formData.name) &&
             formData.type &&
             formData.templateId !== '';
    }
    if (currentStep === 2) {
      const titleText = extractTextFromLexical(formData.titleLexical);
      const bodyText = extractTextFromLexical(formData.bodyLexical);
      if (!titleText.trim()) return false;
      if (!bodyText.trim()) return false;
      return true;
    }
    return false;
  };

  // Filter templates by type - handle case-insensitive comparison
  // formData.type is lowercase string ('notification'), t.type is MessageType enum ('Notification')
  const filteredTemplates = templates.filter(t => {
    if (!t.type) return false;
    // Compare case-insensitively
    return t.type.toLowerCase() === formData.type.toLowerCase();
  });

  if (!open) return null;

  return (
    <StandardDialog
      open={open}
      onClose={onClose}
      title={editMessage ? (canManageMessages ? 'Edit Message' : 'View Message') : 'Create Message'}
      description={editMessage
        ? (canManageMessages ? 'Update your message content and settings' : 'View message content and settings')
        : 'Create a new message using a template with predefined branding and layout'}
      maxWidth="max-w-6xl"
      footer={
        <div className="flex justify-end items-center gap-3 w-full">
          <Button
            onClick={onClose}
            variant="ghost">
            {canManageMessages ? 'Cancel' : 'Close'}
          </Button>

          {currentStep > 1 && (
            <Button
              onClick={() => setCurrentStep(prev => prev - 1)}
              variant="outline"
              size="default">
              Back
            </Button>
          )}

          {currentStep < totalSteps ? (
            <Button
              onClick={() => setCurrentStep(prev => prev + 1)}
              disabled={canManageMessages && !isStepValid()}
              variant="purple">
              Next
            </Button>
          ) : canManageMessages ? (
            <Button
              onClick={handleSubmit}
              disabled={!isStepValid() || isSubmitting}
              variant="purple">
              {isSubmitting ? 'Creating...' : editMessage ? 'Save Changes' : 'Create Message'}
            </Button>
          ) : null}
        </div>
      }>
      {/* Dialog Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          {/* Progress Indicator */}
          <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            {[1, 2].map((step) => (
              <div key={step} className="flex items-center flex-1 gap-1.5">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  currentStep >= step ? 'bg-purple-900 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {step}
                </div>
                <div className="flex-1 ml-2">
                  <div className={`text-xs font-medium ${currentStep === step ? 'text-purple-900' : 'text-gray-900'}`}>
                    {step === 1 && 'Basic Info'}
                    {step === 2 && 'Message Content'}
                  </div>
                </div>
                {step < totalSteps && (
                  <div className={`flex-1 h-0.5 mx-2 ${currentStep > step ? 'bg-purple-900' : 'bg-gray-200'}`}/>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Step Content */}
        <div className="space-y-4">
          {/* Step 1: Basic Configuration & Template Selection */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Network Issue Notification"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  disabled={!canManageMessages}
                  className={`border ${nameError ? 'border-red-500' : 'border-gray-300'}`}/>
                {nameError && (
                  <p className="text-xs text-red-600">{nameError}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Message Type *</Label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) => handleChange('type', e.target.value as MessageType)}
                  className={`w-full px-3 py-2 bg-white border border-gray-300 rounded-lg ${FORM_INPUT_TEXT_SIZE} focus:ring-2 focus:ring-purple-500 focus:border-transparent ${FORM_DISABLED}`}
                  disabled>
                  <option value="Notification">Notification</option>
                </select>
              </div>

              {/* Template Selector */}
              <div className="space-y-2">
                <Label htmlFor="template">Select Template *</Label>
                <select
                  id="template"
                  value={formData.templateId}
                  onChange={(e) => handleChange('templateId', e.target.value)}
                  className={`w-full px-3 py-2 bg-white border border-gray-300 rounded-lg ${FORM_INPUT_TEXT_SIZE} focus:ring-2 focus:ring-purple-500 focus:border-transparent ${FORM_DISABLED}`}
                  disabled={!canManageMessages || filteredTemplates.length === 0}>
                  <option value="">-- Select a template --</option>
                  {filteredTemplates.map(template => (
                    <option key={template.id} value={template.id}>
                      {template.name} {template.description ? `- ${template.description}` : ''}
                    </option>
                  ))}
                </select>
                {filteredTemplates.length === 0 && (
                  <p className="text-xs text-red-600">
                    No templates available for {formData.type} messages. Please create a template first.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Message Content */}
          {currentStep === 2 && selectedTemplate && (
            <div className="space-y-4">
              <div className="flex gap-6 w-full">
                {/* Content Form */}
                <div className="flex-1 space-y-4 min-w-0 overflow-hidden">
                  {/* Title */}
                  <div className="space-y-2">
                    <Label htmlFor="titleLexical">Title *</Label>
                    <LexicalEditor
                      field="titleLexical"
                      value={formData.titleLexical}
                      onChange={(lexicalJson) => handleChange('titleLexical', lexicalJson)}
                      minHeight="2.5rem"
                      disabled={!canManageMessages}/>
                  </div>

                  {/* Body */}
                  <div className="space-y-2">
                    <Label htmlFor="bodyLexical">Body *</Label>
                    <LexicalEditor
                      field="bodyLexical"
                      value={formData.bodyLexical}
                      onChange={(lexicalJson) => handleChange('bodyLexical', lexicalJson)}
                      minHeight="8rem"
                      disabled={!canManageMessages}/>
                  </div>

                  {/* Action Buttons */}
                  {fullTemplate && fullTemplate.buttons?.buttons && fullTemplate.buttons.buttons.length > 0 && (
                    <div className="space-y-3 pt-4 border-t border-gray-200">
                      <Label className="text-gray-900">Action Buttons</Label>
                      {fullTemplate.buttons.buttons.map((button, index) => (
                        <div key={index} className="space-y-1">
                          <Label htmlFor={`buttonText_${index}`} className="text-sm text-gray-600">
                            Button {index + 1} ({button.style})
                          </Label>
                          <Input
                            id={`buttonText_${index}`}
                            placeholder={`Button ${index + 1} text`}
                            value={formData.buttonsText[index] || ''}
                            onChange={(e) => handleChange(`buttonText_${index}`, e.target.value)}
                            disabled={!canManageMessages}
                            className="border border-gray-300 bg-white"/>
                        </div>
                      ))}
                    </div>
                  )}
                  {isLoadingTemplate && (
                    <div className="pt-4 text-sm text-gray-500">Loading template...</div>
                  )}
                </div>

                {/* Live Preview */}
                <div className="flex-shrink-0 space-y-2" style={{width: '750px'}}>
                  <div className="flex items-center gap-2 mb-2">
                    <Eye className="w-4 h-4 text-purple-900"/>
                    <Label className="text-gray-900">Live Preview</Label>
                  </div>
                  <PreviewIframe
                    template={fullTemplate}
                    titleLexical={formData.titleLexical}
                    bodyLexical={formData.bodyLexical}
                    buttonsText={formData.buttonsText}/>
                </div>
              </div>
            </div>
          )}
        </div>
        </div>
      </div>
    </StandardDialog>
  );
}
