import { deepReplacePlaceholders, extractPlainText } from './utils'

export type PreviewInput = {
  template: any
  variables: Record<string, any>
}

export function buildPreview({ template, variables }: PreviewInput) {
  const bound = deepReplacePlaceholders(template?.body ?? template, variables)
  const text = extractPlainText(bound)

  const title = template?.name || template?.slug || 'Preview'

  const device = {
    kind: template?.type === 'action' ? 'confirm' : 'info',
    title,
    body: text,
    actions: [],
  }

  const teams = {
    type: 'AdaptiveCard',
    $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
    version: '1.5',
    body: [
      { type: 'TextBlock', text: title, weight: 'Bolder', size: 'Medium' },
      { type: 'TextBlock', text, wrap: true },
    ],
    actions: (device.actions || []).map((a: any) => ({
      type: 'Action.Submit',
      title: a.label || a.kind,
      data: { action: a.kind },
    })),
  }

  return { title, text, device, teams }
}
