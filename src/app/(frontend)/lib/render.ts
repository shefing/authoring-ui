import { Template, Message } from '@/payload-types'
import { extractHtml, extractPlainText } from './utils'
import { splitRenderData } from '@/lib/messageRenderData'

export type PreviewInput = {
  template: Template
  variables?: Record<string, unknown>
  message?: Message | null
}

export function buildPreview({ template, variables, message }: PreviewInput) {
  const isCustom = message?.templateType === 'custom'

  const renderData = splitRenderData(message?.renderData as any)
  const mergedVars = {
    ...renderData.variables,
    ...(variables || {}),
  }
  
  const titleSource = isCustom ? message?.title : template?.title
  const bodySource = isCustom ? message?.content : (template?.body ?? template)

  const titleText = isCustom ? extractPlainText(titleSource, mergedVars) : (template?.name || 'Preview')
  const titleHtml = extractHtml(titleSource, mergedVars)
  const bodyText = extractPlainText(bodySource, mergedVars)
  const bodyHtml = extractHtml(bodySource, mergedVars)

  const device = {
    kind: template?.messageType === 'confirmation' ? 'confirm' : 'info',
    title: titleText,
    body: bodyText,
    actions: renderData.buttons.map((label) => ({ kind: 'action', label })),
  }

  const teams = {
    type: 'AdaptiveCard',
    $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
    version: '1.5',
    body: [
      { type: 'TextBlock', text: titleText, weight: 'Bolder', size: 'Medium' },
      ...bodyText.split('\n').filter(line => line.trim() !== '').map(line => ({
        type: 'TextBlock',
        text: line,
        wrap: true
      })),
    ],
    actions: (device.actions || []).map((a: { label?: string; kind: string }) => ({
      type: 'Action.Submit',
      title: a.label || a.kind,
      data: { action: a.kind },
    })),
  }

  return { title: titleText, titleHtml, text: bodyText, html: bodyHtml, device, teams }
}
