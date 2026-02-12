import type {PreviewPayload} from './preview';
import {getRenderableContent, getPreviewTitle, getPreviewName} from './preview';
import {PreviewInfoSection} from './PreviewInfoSection';
import {StandardDialog} from '../ui/overlay/dialog';
import {Button} from '../ui/controls/button';
import {PreviewIframe} from '../shared/PreviewIframe';

interface PreviewDialogProps {
    open: boolean;
    onClose: () => void;
    payload: PreviewPayload | null;
}

export function PreviewDialog({ open, onClose, payload }: PreviewDialogProps) {
    if (!payload) return null;

    const title = getPreviewTitle(payload);
    const name = getPreviewName(payload);
    const content = getRenderableContent(payload);
    const buttonsTextArray = content.buttonsText?.buttonText || [];

    return (
        <StandardDialog
            open={open}
            onClose={onClose}
            title={title}
            maxWidth="max-w-6xl"
            footer={<Button onClick={onClose}>Close</Button>}>
            {/* Dialog Content - Two Column Layout */}
            <div className="flex-1 overflow-y-auto">
                <div className="flex gap-6 py-8 px-6">
                    {/* Left: Preview */}
                    <div className="flex-[2]">
                        <PreviewIframe
                            template={content.template}
                            titleLexical={content.titleLexical}
                            bodyLexical={content.bodyLexical}
                            buttonsText={buttonsTextArray}/>
                    </div>

                    {/* Right: Information Section */}
                    <div className="flex-1 bg-gray-50 rounded-lg p-6 -mr-6">
                        <PreviewInfoSection payload={payload} name={name}/>
                    </div>
                </div>
            </div>
        </StandardDialog>
    );
}

