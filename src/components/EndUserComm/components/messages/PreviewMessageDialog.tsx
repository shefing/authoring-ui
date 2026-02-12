import type {UiMessageDefinition, UiMessageTemplate} from '@/components/EndUserComm/http-services-sdk/be-types';
import {PreviewDialog} from '../preview/PreviewDialog';

interface PreviewMessageDialogProps {
    open: boolean;
    onClose: () => void;
    message: UiMessageDefinition;
    template: UiMessageTemplate;
}

export function PreviewMessageDialog({ open, onClose, message, template }: PreviewMessageDialogProps) {
    const payload = {
        type: 'message' as const,
        template,
        message
    };

    return (
        <PreviewDialog
            open={open}
            onClose={onClose}
            payload={payload}/>
    );
}

