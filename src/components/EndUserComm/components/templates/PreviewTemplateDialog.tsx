import type {UiMessageTemplate} from '@/components/EndUserComm/http-services-sdk/be-types';
import {PreviewDialog} from '../preview/PreviewDialog';

interface PreviewTemplateDialogProps {
    open: boolean;
    onClose: () => void;
    template: UiMessageTemplate;
}

export function PreviewTemplateDialog({ open, onClose, template }: PreviewTemplateDialogProps) {
    const payload = {
        type: 'template' as const,
        template
    };

    return (
        <PreviewDialog
            open={open}
            onClose={onClose}
            payload={payload}/>
    );
}

