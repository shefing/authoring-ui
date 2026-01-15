import { deepReplacePlaceholders, extractPlainText, extractHtml } from './utils'

export type PreviewInput = {
  template: any
  variables: Record<string, any>
}

export function buildPreview({ template, variables }: PreviewInput) {
  const body = template?.body ?? template
  const text = extractPlainText(body, variables)
  const html = extractHtml(body, variables)

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
      ...text.split('\n').filter(line => line.trim() !== '').map(line => ({
        type: 'TextBlock',
        text: line,
        wrap: true
      })),
    ],
    actions: (device.actions || []).map((a: any) => ({
      type: 'Action.Submit',
      title: a.label || a.kind,
      data: { action: a.kind },
    })),
  }

  return { title, text, html, device, teams }
}
