import type {PreviewPayload} from './preview';
import {InfoField} from '../ui/display/info-field';
import {ChannelBadges, TypeBadge} from '../shared/MessageBadges';

export interface PreviewInfoSectionProps {
    payload: PreviewPayload;
    name: string;
}

export function PreviewInfoSection({ payload, name }: PreviewInfoSectionProps) {
    const isTemplate = payload.type === 'template';
    const title = isTemplate ? 'Template Information' : 'Message Information';

    return (
        <>
            <h3 className="text-gray-900 font-medium mb-4">{title}</h3>
            <div className="space-y-3 pl-2">
                <InfoField label="Name">{name}</InfoField>

                {isTemplate && (
                    <InfoField label="Description">{payload.template.description || '—'}</InfoField>
                )}

                <InfoField label="Type">
                    <TypeBadge type={payload.template.type}/>
                </InfoField>

                <InfoField label="Channels">
                    <ChannelBadges channels={payload.template.channels}/>
                </InfoField>

                {!isTemplate && (
                    <InfoField label="Template">{payload.template.name}</InfoField>
                )}

                {isTemplate && (
                    <>
                        <InfoField label="Branding">{payload.template.branding.brandingName}</InfoField>
                        <InfoField label="Logo Alignment">{payload.template.logo.alignment}</InfoField>
                        <InfoField label="Button Alignment">{payload.template.buttons.alignment}</InfoField>
                    </>
                )}
            </div>
        </>
    );
}

