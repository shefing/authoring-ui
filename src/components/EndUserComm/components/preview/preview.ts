import type {UiMessageTemplate, UiMessageDefinition, MessageButtonsText} from '@/components/EndUserComm/http-services-sdk/be-types';

export type PreviewPayload = 
  | { type: 'template', template: UiMessageTemplate }
  | { type: 'message', template: UiMessageTemplate, message: UiMessageDefinition };

export interface RenderableContent {
    template: UiMessageTemplate;
    titleLexical: string;
    bodyLexical: string;
    buttonsText: MessageButtonsText;
}

export function getRenderableContent(payload: PreviewPayload): RenderableContent {
    if (payload.type === 'message') {
        return {
            template: payload.template,
            titleLexical: payload.message.titleLexical,
            bodyLexical: payload.message.bodyLexical,
            buttonsText: payload.message.buttonsText
        };
    } else {
        return {
            template: payload.template,
            titleLexical: payload.template.titleLexical,
            bodyLexical: payload.template.bodyLexical,
            buttonsText: {
                buttonText: payload.template.buttons.buttons.map(b => b.text)
            }
        };
    }
}

export function getPreviewTitle(payload: PreviewPayload): string {
    return payload.type === 'template' ? 'Template Preview' : 'Message Preview';
}

export function getPreviewName(payload: PreviewPayload): string {
    return payload.type === 'template' ? payload.template.name : payload.message.definitionName;
}

