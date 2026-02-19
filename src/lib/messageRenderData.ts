export type RenderDataItem = {
  type?: 'variable' | 'button'
  label?: string | null
  value?: string | null
  key?: string | null
}

export function splitRenderData(renderData?: RenderDataItem[] | null) {
  const variables: Record<string, string> = {}
  const buttons: string[] = []

  if (!Array.isArray(renderData)) {
    return { variables, buttons }
  }

  for (const item of renderData) {
    if (!item || typeof item !== 'object') continue
    if (item.type === 'variable') {
      const key = item.key || item.label
      if (key) variables[key] = item.value ?? ''
    }
    if (item.type === 'button') {
      buttons.push(item.value ?? item.label ?? '')
    }
  }

  return { variables, buttons }
}